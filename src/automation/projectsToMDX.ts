import axios from "axios";
import fs from "fs";
import path from "path";
import yaml from "js-yaml";
import HCES, {
  readKeysFromEnv,
  type CompatDevlog,
  type CompatProject,
  type ProjectSource,
} from "./lib/hces";
import type { Post } from "~/types";

const ROOT = process.cwd();
const POSTS_JSON = path.join(ROOT, "src", "data", "posts.json");
const POSTS_DIR = path.join(ROOT, "src", "routes", "blog", "posts");

const TAGS: Record<ProjectSource, string[]> = {
  // Keep the historic tags (typo included) so existing posts don't churn.
  flavortown: ["flavourtown", "flavortown", "projects"],
  macondo: ["macondo", "projects"],
};

/** One platform's project inside a combined group. */
type ProjectRef = { source: ProjectSource; id: string | number };

if (!fs.existsSync(POSTS_DIR)) {
  fs.mkdirSync(POSTS_DIR, { recursive: true });
}

if (!fs.existsSync(POSTS_JSON)) {
  fs.writeFileSync(POSTS_JSON, "[]", "utf-8");
}

/** Comma/space separated ID list, e.g. `FLAVORTOWN_PROJECT_IDS="1, 2, 3"`.
 *  Empty/unset means "auto-discover all my projects via the API". */
const explicitIds = (name: string): string[] | null => {
  const raw = process.env[name];
  if (!raw || !raw.trim()) return null;
  return raw
    .split(/[\s,]+/)
    .map((part) => part.trim())
    .filter(Boolean);
};

const skipIds = new Set(
  (process.env.SKIP_PROJECT_IDS ?? "")
    .split(/[\s,]+/)
    .map((part) => part.trim().toLowerCase())
    .filter(Boolean),
);

const skipped = (source: ProjectSource, id: string): boolean =>
  skipIds.has(id.toLowerCase()) || skipIds.has(`${source}:${id}`.toLowerCase());

const slugify = (text: string) =>
  text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");

const isValidDate = (value: unknown): boolean =>
  value instanceof Date
    ? !Number.isNaN(value.getTime())
    : typeof value === "string" || typeof value === "number"
      ? !Number.isNaN(new Date(value).getTime())
      : false;

/** Frontmatter of a post file, or null when missing/unparseable. */
const readFrontmatter = (filePath: string): Record<string, any> | null => {
  const content = fs.readFileSync(filePath, "utf8");
  const match = content.match(/^---\s*([\s\S]*?)\s*---/);
  if (!match) return null;
  try {
    const data = yaml.load(match[1]);
    return typeof data === "object" && data !== null
      ? (data as Record<string, any>)
      : null;
  } catch {
    return null;
  }
};

const stripFrontmatter = (content: string): string => {
  const match = content.match(/^---\s*([\s\S]*?)\s*---/);
  return match ? content.slice(match[0].length) : content;
};

/** Sync identity: the `projects` list (new) or legacy `source`/`projectId`. */
const identityRefs = (ident: {
  projects?: unknown;
  source?: unknown;
  projectId?: unknown;
}): ProjectRef[] => {
  const refs: ProjectRef[] = [];
  if (Array.isArray(ident.projects)) {
    for (const entry of ident.projects) {
      if (
        typeof entry === "object" &&
        entry !== null &&
        typeof (entry as ProjectRef).source === "string" &&
        (entry as ProjectRef).id !== undefined
      ) {
        refs.push({
          source: (entry as ProjectRef).source,
          id: (entry as ProjectRef).id,
        });
      }
    }
  }
  if (typeof ident.source === "string" && ident.projectId !== undefined) {
    refs.push({
      source: ident.source as ProjectSource,
      id: ident.projectId as string | number,
    });
  }
  return refs;
};

const managedBySync = (fm: Record<string, any> | null): boolean =>
  !!fm && identityRefs(fm).length > 0;

const refMatches = (
  ident: { projects?: unknown; source?: unknown; projectId?: unknown },
  ref: ProjectRef,
): boolean =>
  identityRefs(ident).some(
    (own) => own.source === ref.source && String(own.id) === String(ref.id),
  );

const bySlug = (posts: Post[], slug: string): Post | undefined =>
  posts.find((post) => post.slug === slug);

/**
 * Pick up hand-written posts: any `.md`/`.mdx` file in the posts dir that
 * isn't managed by the project sync gets an entry in posts.json derived
 * from its frontmatter (the same shape `postsPlugin.ts` writes, so builds
 * and CI agree). Entries whose file was deleted are pruned — except ones
 * managed by the sync, which the sync itself rewrites below.
 *
 * Problems are reported as warnings naming the exact file, never thrown,
 * so one bad hand-written post can't break the whole sync.
 */
const reconcileManualPosts = (posts: Post[]): void => {
  const files = fs
    .readdirSync(POSTS_DIR)
    .filter((file) => file.endsWith(".md") || file.endsWith(".mdx"))
    .sort();
  const slugsOnDisk = new Map<string, string>();
  for (const file of files) {
    const slug = file.replace(/\.mdx?$/, "");
    if (slugsOnDisk.has(slug)) {
      console.warn(
        `::warning::Duplicate post slug "${slug}": ${slugsOnDisk.get(slug)} and ${file} — using ${slugsOnDisk.get(slug)}`,
      );
      continue;
    }
    slugsOnDisk.set(slug, file);
  }

  let added = 0;
  let updated = 0;
  for (const [slug, file] of slugsOnDisk) {
    const filePath = path.join(POSTS_DIR, file);
    const fm = readFrontmatter(filePath);
    if (!fm) {
      console.warn(
        `::warning::${file}: no readable frontmatter, skipping (add a --- block with title/date)`,
      );
      continue;
    }
    // Managed by the project sync — left for the sync loop below, which
    // stamps the projects list itself. Never treated as manual.
    if (managedBySync(fm)) continue;

    const missing: string[] = [];
    if (typeof fm.title !== "string" || !fm.title.trim()) missing.push("title");
    if (!isValidDate(fm.date)) missing.push("date");
    if (missing.length > 0) {
      console.warn(
        `::warning::${file}: skipping, frontmatter needs ${missing.join(" and ")} (e.g. title: "My post" and date: "2026-10-08")`,
      );
      continue;
    }

    // Legacy singular `tag:` also works on-site, but canonical is `tags:`.
    const tags =
      fm.tags ??
      (fm.tag !== undefined
        ? Array.isArray(fm.tag)
          ? fm.tag
          : [fm.tag]
        : undefined);

    const existing = bySlug(posts, slug);
    // Hand-written posts opt into updates via an `updatedAt:` frontmatter
    // field (use YYYY-MM-DD); otherwise they sort by their publish date.
    let updatedAtSource: unknown = fm.date;
    if (fm.updatedAt !== undefined) {
      if (isValidDate(fm.updatedAt)) {
        updatedAtSource = fm.updatedAt;
      } else {
        console.warn(
          `::warning::${file}: ignoring invalid updatedAt "${fm.updatedAt}" (use YYYY-MM-DD)`,
        );
      }
    }
    const entry: Post = {
      ...(existing ?? {}),
      ...fm,
      slug,
      title: fm.title,
      description:
        typeof fm.description === "string" ? fm.description : (
          (existing?.description ?? "")
        ),
      // Keep the raw frontmatter date form (usually "YYYY-MM-DD") so this
      // matches what postsPlugin.ts writes — avoids churn between CI and builds.
      date: fm.date as unknown as Date,
      createdAt: fm.date as unknown as Date,
      updatedAt: updatedAtSource as unknown as Date,
      ...(tags !== undefined ? { tags } : {}),
    } as Post;
    // Don't leak the legacy key into posts.json when we normalised it.
    if (fm.tags === undefined && fm.tag !== undefined) delete (entry as any).tag;

    if (!existing) {
      posts.push(entry);
      added++;
      console.log(`Manual post: ${file} → added "${slug}" to posts.json`);
    } else {
      const before = JSON.stringify(existing);
      Object.assign(existing, entry);
      if (JSON.stringify(existing) !== before) {
        updated++;
        console.log(`Manual post: ${file} → refreshed "${slug}" from frontmatter`);
      }
    }
  }

  let pruned = 0;
  for (let i = posts.length - 1; i >= 0; i--) {
    const post = posts[i];
    // Managed posts are rewritten by the sync loop below even if the
    // file is currently missing — never prune them here.
    if (identityRefs(post).length > 0) continue;
    const file = slugsOnDisk.get(post.slug);
    if (file) {
      // File exists but is sync-managed (stamped frontmatter): the sync
      // loop owns this entry, leave it alone.
      const fm = readFrontmatter(path.join(POSTS_DIR, file));
      if (managedBySync(fm)) continue;
    }
    if (!file) {
      console.log(
        `Manual post: "${post.slug}" has no file — removing from posts.json`,
      );
      posts.splice(i, 1);
      pruned++;
    }
  }

  if (added + updated + pruned === 0) console.log("Manual posts: nothing to do");
  else
    console.log(
      `Manual posts: ${added} added, ${updated} refreshed, ${pruned} pruned`,
    );
};

/** ISO 8601 duration (`PT1H7M`, `P1W`, …) → seconds. */
const isoDurationToSeconds = (input: string | null | undefined): number => {
  if (!input) return 0;
  const match =
    /^P(?:(\d+)Y)?(?:(\d+)M)?(?:(\d+)W)?(?:(\d+)D)?(?:T(?:(\d+)H)?(?:(\d+)M)?(?:(\d+(?:\.\d+)?)S)?)?$/.exec(
      input.trim(),
    );
  if (!match) return 0;
  const [, years, months, weeks, days, hours, mins, secs] = match.map(Number);
  return (
    (years || 0) * 365 * 24 * 3600 +
    (months || 0) * 30 * 24 * 3600 +
    (weeks || 0) * 7 * 24 * 3600 +
    (days || 0) * 24 * 3600 +
    (hours || 0) * 3600 +
    (mins || 0) * 60 +
    (secs || 0)
  );
};

const formatDuration = (totalSeconds: number): string => {
  const days = Math.floor(totalSeconds / (24 * 3600));
  const hours = Math.floor((totalSeconds % (24 * 3600)) / 3600);
  const mins = Math.floor((totalSeconds % 3600) / 60);

  const parts: string[] = [];
  if (days) parts.push(`${days}d`);
  if (hours) parts.push(`${hours}h`);
  if (mins || parts.length === 0) parts.push(`${mins}m`);
  return parts.join(" ");
};

const renderDevlog = (devlog: CompatDevlog): string => {
  const date = new Date(devlog.posted).toISOString().slice(0, 10);
  const duration = formatDuration(isoDurationToSeconds(devlog.timeLogged));
  const likes = devlog.likes ?? 0;
  const comments =
    devlog.comments && devlog.comments > 0 ? ` • ${devlog.comments} comments` : "";
  return (
    `## Devlog ${devlog.id} • ${date}\n\n` +
    `${devlog.description}\n\n` +
    `${likes} likes • ${duration}${comments}\n\n`
  );
};

const hasGeneratedDevlogs = (content: string): boolean =>
  /^## Devlog\s/m.test(content);

const devlogCountOf = (project: CompatProject): number =>
  project.totalDevlogs ?? project.devlogIds.length;

const postsRaw = fs.readFileSync(POSTS_JSON, "utf-8");
const posts: Post[] = JSON.parse(postsRaw || "[]");
// Keep the file's existing indent style so a sync doesn't reformat it.
const postsIndent = postsRaw.match(/\n( +)\{/)?.[1].length ?? 4;

// Hand-written posts first, so project slugs avoid colliding with them
// and so this works even when the API keys are missing/broken.
reconcileManualPosts(posts);

const keys = readKeysFromEnv();
const savePosts = (): void => {
  posts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  fs.writeFileSync(POSTS_JSON, JSON.stringify(posts, null, postsIndent), "utf-8");
};

if (!keys.flavortownKey && !keys.macondoKey) {
  savePosts();
  console.warn(
    "::warning::Missing platform API keys (FT_API_KEY / MC_API_KEY) — synced project posts, only manual posts were reconciled",
  );
  process.exit(0);
}

const hces = new HCES(keys);
const usedSlugs = new Set(posts.map((post) => post.slug));

const wantedIds: { source: ProjectSource; id: string }[] = [];

if (keys.flavortownKey) {
  const ids =
    explicitIds("FLAVORTOWN_PROJECT_IDS") ??
    (await hces.flavortownProjectIds("me"));
  console.log(`Flavortown: syncing ${ids.length} project(s)`);
  for (const id of ids) {
    if (skipped("flavortown", id)) {
      console.log(`Flavortown ${id}: skipped via SKIP_PROJECT_IDS`);
      continue;
    }
    wantedIds.push({ source: "flavortown", id });
  }
}

if (keys.macondoKey) {
  const ids = explicitIds("MACONDO_PROJECT_IDS") ?? (await hces.macondoProjectIds());
  console.log(`Macondo: syncing ${ids.length} project(s)`);
  for (const id of ids) {
    if (skipped("macondo", id)) {
      console.log(`Macondo ${id}: skipped via SKIP_PROJECT_IDS`);
      continue;
    }
    wantedIds.push({ source: "macondo", id });
  }
}

if (wantedIds.length === 0) {
  console.log("No projects to sync (everything skipped or none found).");
  savePosts();
  process.exit(0);
}

type FetchedProject = {
  source: ProjectSource;
  id: string;
  project: CompatProject;
};

// Fetch every project first (404 = deleted/unshared → keep old content).
const fetched: FetchedProject[] = [];
for (const { source, id } of wantedIds) {
  try {
    fetched.push({ source, id, project: await hces.compatProject(source, id) });
  } catch (err) {
    if (axios.isAxiosError(err) && err.response?.status === 404) {
      console.warn(
        `::warning::${source} ${id}: project not found (deleted or unshared?) — keeping existing post`,
      );
      continue;
    }
    throw err;
  }
}

// Group same-name projects across platforms (compat API shapes match,
// so Flavortown + Macondo devlogs merge into one post).
const groups = new Map<string, FetchedProject[]>();
for (const item of fetched) {
  const base = slugify(item.project.name) || `${item.source}-${item.id}`;
  const group = groups.get(base) ?? [];
  group.push(item);
  groups.set(base, group);
}

// Drop Macondo-only projects with no journals — they have nothing to show.
// Also self-clean: remove a previously generated stub for them (managed
// frontmatter, zero devlog sections, empty body) plus its posts.json entry,
// unless the entry carries hand-added extras.
const ENTRY_MANAGED_KEYS = new Set([
  "title",
  "slug",
  "description",
  "date",
  "tags",
  "tag",
  "projects",
  "source",
  "projectId",
]);
for (const [base, group] of [...groups]) {
  const hasFlavortown = group.some((item) => item.source === "flavortown");
  const total = group.reduce((sum, item) => sum + devlogCountOf(item.project), 0);
  if (hasFlavortown || total > 0) continue;

  console.log(
    `Macondo ${group.map((item) => item.id).join(", ")} ("${group[0].project.name}"): no journals — skipping`,
  );
  groups.delete(base);

  const stubFile = path.join(POSTS_DIR, `${base}.md`);
  if (!fs.existsSync(stubFile)) continue;
  const stubFm = readFrontmatter(stubFile);
  const stubBody = stripFrontmatter(fs.readFileSync(stubFile, "utf8")).trim();
  if (!managedBySync(stubFm) || hasGeneratedDevlogs(stubBody) || stubBody !== "") {
    continue;
  }
  const entryIndex = posts.findIndex(
    (post) =>
      post.slug === base &&
      identityRefs(post).length > 0 &&
      Object.keys(post).every((key) => ENTRY_MANAGED_KEYS.has(key)),
  );
  fs.rmSync(stubFile);
  console.log(`Macondo "${base}": removed empty generated stub ${base}.md`);
  if (entryIndex >= 0) {
    posts.splice(entryIndex, 1);
    console.log(`Macondo "${base}": removed stub entry from posts.json`);
  }
}

let added = 0;
let updated = 0;

for (const [base, group] of groups) {
  const refs: ProjectRef[] = group.map((item) => ({
    source: item.source,
    id: item.project.id,
  }));
  const label = group.map((item) => `${item.source}:${item.id}`).join(" + ");

  // Flavortown leads when present (keeps existing titles/descriptions stable).
  const primary =
    group.find((item) => item.source === "flavortown") ?? group[0];
  const title = primary.project.name;
  const description =
    primary.project.description ??
    group.find((item) => item.project.description)?.project.description ??
    "";
  const tags = [...new Set(group.flatMap((item) => TAGS[item.source]))];

  // Fetch devlogs for every side that has any. A side reporting zero
  // journals is skipped (no call needed); if a side with journals fails,
  // the whole group keeps its old content rather than half-rewriting it.
  let devlogs: CompatDevlog[] = [];
  let failedSide: FetchedProject | null = null;
  for (const item of group) {
    if (devlogCountOf(item.project) === 0 && item.project.devlogIds.length === 0) {
      continue;
    }
    try {
      const side = await hces.compatDevlogs(item.source, item.id);
      devlogs.push(...side);
    } catch (err) {
      if (axios.isAxiosError(err) && err.response?.status === 404) {
        console.warn(
          `::warning::${item.source} ${item.id}: devlogs not found — keeping existing post`,
        );
        failedSide = item;
      } else {
        throw err;
      }
    }
  }
  if (failedSide) {
    console.warn(
      `::warning::${label}: skipping rewrite (one side failed to load)`,
    );
    continue;
  }

  devlogs.sort(
    (a, b) => new Date(b.posted).getTime() - new Date(a.posted).getTime(),
  );

  // Resolve the slug. Identity lives in the .md frontmatter (projects
  // list) so it survives a posts.json regen; a colliding file full of
  // generated devlogs is adopted instead of duplicated.
  let slug = base;
  let keepFile = false;
  const fileFor = (s: string): string => path.join(POSTS_DIR, `${s}.md`);
  const owner = bySlug(posts, slug);
  const ownerFm =
    owner && fs.existsSync(fileFor(slug))
      ? readFrontmatter(fileFor(slug))
      : null;
  const sameGroup =
    owner &&
    (refs.some((ref) => refMatches(owner, ref)) ||
      (ownerFm && refs.some((ref) => refMatches(ownerFm, ref))));

  if (!owner) {
    usedSlugs.add(slug);
  } else if (sameGroup) {
    usedSlugs.add(slug);
    keepFile = true;
  } else {
    const body = fs.existsSync(fileFor(slug))
      ? fs.readFileSync(fileFor(slug), "utf8")
      : "";
    // A file full of generated devlog sections under the same slug is a
    // project post whose identity was lost (e.g. posts.json regenerated
    // from frontmatter): adopt it instead of creating a suffixed duplicate.
    if (hasGeneratedDevlogs(body)) {
      console.log(
        `${label} → adopting existing ${slug}.md (same project, restamping identity)`,
      );
      usedSlugs.add(slug);
      keepFile = true;
    } else {
      // Genuine collision with a manual post: namespace instead of
      // overwriting.
      let candidate = `${slug}-projects`;
      let counter = 2;
      while (usedSlugs.has(candidate)) candidate = `${slug}-projects-${counter++}`;
      slug = candidate;
      usedSlugs.add(slug);
    }
  }

  const existing = bySlug(posts, slug);
  let postDate: string;
  if (existing && isValidDate(existing.date)) {
    // Never shift an established post's date (the compat `createdAt` is
    // when HCES first saw the project, not when it was created).
    postDate = new Date(existing.date).toISOString().slice(0, 10);
  } else {
    // New post: best available start = oldest of project creation and
    // first devlog.
    const candidates = [
      ...group
        .map((item) => item.project.createdAt)
        .filter((value): value is string => !!value)
        .map((value) => new Date(value).getTime()),
      ...devlogs.map((devlog) => new Date(devlog.posted).getTime()),
    ].filter((time) => Number.isFinite(time));
    postDate = new Date(
      candidates.length > 0 ? Math.min(...candidates) : Date.now(),
    )
      .toISOString()
      .slice(0, 10);
  }

  // A synced post was last updated when its newest devlog landed.
  const updatedOn =
    devlogs.length > 0
      ? new Date(devlogs[0].posted).toISOString().slice(0, 10)
      : postDate;

  // Preserve hand-added extras (e.g. featuredImage) from the existing
  // frontmatter; drop the legacy single-project identity keys in favour
  // of the projects list. Extras are only carried over from the group's
  // own file, never from a colliding manual post.
  const {
    title: _fmTitle,
    description: _fmDesc,
    date: _fmDate,
    updatedAt: _fmUpdatedAt,
    tags: _fmTags,
    projects: _fmProjects,
    source: _fmSource,
    projectId: _fmProjectId,
    ...fmExtras
  } = (keepFile && ownerFm) || {};
  void _fmTitle;
  void _fmDesc;
  void _fmDate;
  void _fmUpdatedAt;
  void _fmTags;
  void _fmProjects;
  void _fmSource;
  void _fmProjectId;

  // Preserve hand-added extras (e.g. featuredImage) from posts.json too.
  const { source: _legacySource, projectId: _legacyId, ...extras } =
    (existing ?? {}) as Post & { source?: unknown; projectId?: unknown };
  void _legacySource;
  void _legacyId;
  const entry: Post = {
    ...extras,
    title,
    slug,
    description,
    date: postDate as unknown as Date,
    createdAt: postDate as unknown as Date,
    updatedAt: updatedOn as unknown as Date,
    tags,
    projects: refs,
  };
  if (!existing) {
    posts.push(entry);
    added++;
  } else {
    const before = JSON.stringify(existing);
    // Remove legacy keys so they don't linger next to `projects`.
    delete (existing as Post & { source?: unknown }).source;
    delete (existing as Post & { projectId?: unknown }).projectId;
    Object.assign(existing, entry);
    if (JSON.stringify(existing) !== before) updated++;
  }

  const filePath = fileFor(slug);
  let existingContent = "";
  if (keepFile && fs.existsSync(filePath)) {
    existingContent = fs.readFileSync(filePath, "utf8");
  }

  // Preserve any hand-written intro above the generated devlogs.
  const preDevlogContent = stripFrontmatter(existingContent).split(
    /^\s*## Devlog/m,
  )[0];

  const frontmatter = yaml
    .dump(
      {
        ...fmExtras,
        title,
        description,
        date: postDate,
        // Only stamped when a devlog actually moved it — otherwise the
        // post simply falls back to its publish date everywhere.
        ...(updatedOn !== postDate ? { updatedAt: updatedOn } : {}),
        tags,
        projects: refs,
      },
      { lineWidth: -1 },
    )
    .trim();

  const finalContent =
    `---\n${frontmatter}\n---\n` +
    preDevlogContent +
    devlogs.map(renderDevlog).join("");

  fs.writeFileSync(filePath, finalContent, "utf8");
  console.log(`${label} → ${slug}.md (${devlogs.length} devlogs)`);
}

savePosts();

console.log(`Done. ${added} new post(s), ${updated} updated.`);
