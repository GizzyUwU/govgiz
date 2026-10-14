import axios, { type AxiosInstance } from "axios";

export const HCES_BASE_URL = "https://hces.gizzy.gay/api/v1";

export type ProjectSource = "flavortown" | "macondo";

export interface HcesKeys {
  hcesApiKey: string;
  flavortownKey?: string;
  macondoKey?: string;
  macondoCookie?: string;
}

/** Read keys from env. Supports both `UNDERSCORE` names (used as
 *  GitHub Action `env:`) and the literal secret names (`HCES-API-Key`,
 *  `FT-API-Key`, `MC-API-Key`, `MC-Cookie`). */
export function readKeysFromEnv(
  env: NodeJS.ProcessEnv = process.env,
): HcesKeys {
  const pick = (...names: string[]): string | undefined => {
    for (const name of names) {
      const value = env[name];
      if (value && value.length > 0) return value;
    }
    return undefined;
  };

  return {
    hcesApiKey: pick("HCES_API_KEY", "HCES-API-Key") ?? "",
    flavortownKey: pick("FT_API_KEY", "FT-API-Key", "FLAVORTOWN_API_KEY"),
    macondoKey: pick("MC_API_KEY", "MC-API-Key", "MACONDO_API_KEY"),
    macondoCookie: pick(
      "MC_COOKIE",
      "MC-Cookie",
      "MACONDO_COOKIE",
      "MACONDO_COOKIE_VALUE",
    ),
  };
}

/** Shape returned by `GET /api/v1/{flavortown,macondo}/compat/projects/{id}`.
 *  Identical for both sources, which is the whole point of the compat API. */
export type CompatProject = {
  id: string;
  name: string;
  description: string;
  banner: string | null;
  maker: { pfp: string; name: string } | null;
  demoUrl: string | null;
  repoUrl: string | null;
  readmeUrl: string | null;
  aiDec: string | null;
  totalDevlogs: number;
  totalDuration: string | null;
  followers: number | null;
  devlogIds: (string | number)[];
  createdAt: string | null;
};

/** Shape returned by `GET /api/v1/{flavortown,macondo}/compat/projects/{id}/devlogs`. */
export type CompatDevlog = {
  id: string | number;
  /** ISO datetime the devlog was posted. */
  posted: string;
  /** ISO 8601 duration, e.g. `PT1H7M`. */
  timeLogged: string;
  /** Markdown body. */
  description: string;
  mediaUrls: { alt: string; src: string }[];
  likes: number | null;
  comments: number | null;
};

type FlavortownProjectsPage = {
  projects: { id: number }[];
  pagination?: { next_page?: number | null } | null;
};

type MacondoStreaks = {
  projects?: { id: number | string }[] | null;
};

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

const MAX_RETRIES = 5;

export default class HCES {
  lastCode: number | null = null;
  private fetch: AxiosInstance;
  private keys: HcesKeys;

  constructor(keys: HcesKeys, baseURL: string = HCES_BASE_URL) {
    if (!keys.hcesApiKey) {
      throw new Error(
        "Missing HCES API key (set HCES_API_KEY from the 'HCES-API-Key' secret)",
      );
    }
    this.keys = keys;
    this.fetch = axios.create({
      baseURL,
      headers: { Authorization: `Bearer ${keys.hcesApiKey}` },
    });
  }

  private headersFor(source: ProjectSource): Record<string, string> {
    const headers: Record<string, string> = {};
    if (source === "flavortown" && this.keys.flavortownKey) {
      headers["X-Flavortown-Key"] = this.keys.flavortownKey;
    }
    if (source === "macondo") {
      if (this.keys.macondoKey) headers["X-Macondo-Key"] = this.keys.macondoKey;
      if (this.keys.macondoCookie) {
        headers["X-Macondo-Cookie"] = this.keys.macondoCookie;
      }
    }
    return headers;
  }

  private async get<T>(
    url: string,
    source: ProjectSource,
    label: string,
  ): Promise<T> {
    for (let attempt = 0; ; attempt++) {
      try {
        const res = await this.fetch.get<T>(url, {
          headers: this.headersFor(source),
        });
        this.lastCode = res.status;
        return res.data;
      } catch (err) {
        if (!axios.isAxiosError(err)) throw err;
        const status = err.response?.status ?? err.status ?? null;
        this.lastCode = status;

        if (status === 429 && attempt < MAX_RETRIES) {
          const retryAfter = Number(
            err.response?.headers?.["retry-after"] ?? 10,
          );
          const waitMs =
            (Number.isFinite(retryAfter) ? retryAfter : 10) * 1000;
          console.log(
            `Rate limited (${label}), waiting ${waitMs / 1000}s… (attempt ${attempt + 1}/${MAX_RETRIES})`,
          );
          await sleep(waitMs);
          continue;
        }
        if (status === 401) {
          const hint =
            source === "flavortown"
              ? "check the 'HCES-API-Key' and 'FT-API-Key' secrets"
              : "check the 'HCES-API-Key' and 'MC-API-Key' secrets (plus 'MC-Cookie' if your Macondo session needs it)";
          throw new Error(`Unauthorized calling ${label}: ${hint}`);
        }
        throw err;
      }
    }
  }

  /** All Flavortown project IDs owned by `userId` (`"me"` = key owner).
   *  This is what makes new projects show up automatically. */
  async flavortownProjectIds(userId: string = "me"): Promise<string[]> {
    const ids: string[] = [];
    let page = 1;
    for (;;) {
      const data = await this.get<FlavortownProjectsPage>(
        `/flavortown/users/${userId}/projects?page=${page}&limit=100`,
        "flavortown",
        `flavortown:users/${userId}/projects p${page}`,
      );
      for (const project of data.projects ?? []) ids.push(String(project.id));
      const next = data.pagination?.next_page;
      if (!next) break;
      page = next;
    }
    return ids;
  }

  /** All Macondo project IDs for the key owner, discovered via the
   *  profile streaks endpoint (Macondo has no users/me/projects route). */
  async macondoProjectIds(): Promise<string[]> {
    const data = await this.get<MacondoStreaks>(
      "/macondo/profile/streaks",
      "macondo",
      "macondo:profile/streaks",
    );
    return (data.projects ?? []).map((project) => String(project.id));
  }

  async compatProject(
    source: ProjectSource,
    id: string | number,
  ): Promise<CompatProject> {
    return this.get<CompatProject>(
      `/${source}/compat/projects/${id}`,
      source,
      `${source}:project/${id}`,
    );
  }

  /** Full devlogs for a project in one call (no per-devlog N+1). */
  async compatDevlogs(
    source: ProjectSource,
    id: string | number,
  ): Promise<CompatDevlog[]> {
    const data = await this.get<CompatDevlog[] | { devlogs: CompatDevlog[] }>(
      `/${source}/compat/projects/${id}/devlogs`,
      source,
      `${source}:project/${id}/devlogs`,
    );
    return Array.isArray(data) ? data : (data.devlogs ?? []);
  }
}
