import fs from "fs";
import path from "path";
import yaml from "js-yaml";
import FT from "./lib/ft";
import type { Post } from "~/types";
import type { Project, Devlog } from "./lib/ft.d";

const ROOT = process.cwd();
const POSTS_JSON = path.join(ROOT, "src", "data", "posts.json");
const POSTS_DIR = path.join(ROOT, "src", "routes", "blog", "posts");

if (!process.env.FT_API_KEY) throw new Error("Missing API Key");

if (!fs.existsSync(POSTS_DIR)) {
  fs.mkdirSync(POSTS_DIR, { recursive: true });
}

if (!fs.existsSync(POSTS_JSON)) {
  fs.writeFileSync(POSTS_JSON, "[]", "utf-8");
}

const posts: Post[] = JSON.parse(fs.readFileSync(POSTS_JSON, "utf-8"));

const slugify = (text: string) =>
  text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");

const ft = new FT(process.env.FT_API_KEY);

const me = await ft.user({ id: "me" });
if (!me?.project_ids?.length) process.exit(0);

const projects: Project[] = [];

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

for (const id of me.project_ids) {
  while (true) {
    const res = await ft.project({ id });

    if (ft.lastCode === 429) {
      await sleep(10 * 1000);
      continue;
    }

    if (res) projects.push(res);
    break;
  }
}

for (const project of projects) {
  const title = project.title;
  const slug = slugify(title);

  const date = new Date(project.created_at).toISOString().slice(0, 10);
  const tags = ["flavourtown", "flavortown", "project"];

  let postExists = posts.find((p) => p.slug === slug);
  if (!postExists) {
    const newPost: Post = {
      title,
      slug,
      description: project.description,
      date: new Date(project.created_at),
      tags,
    };
    posts.push(newPost);
  }

  const devlogs: Devlog[] = [];
  for (const id of project.devlog_ids) {
    const devlog = await ft.devlog({ projectId: project.id, devlogId: id });
    if (devlog) devlogs.push(devlog);
  }

  devlogs.sort(
    (a, b) =>
      new Date(a.created_at).getTime() - new Date(b.created_at).getTime(),
  );

  const devlogContent = devlogs
    .map(
      (d) =>
        `## Devlog ${d.id} • ${new Date(d.created_at).toISOString().slice(0, 10)}\n\n` +
        `${d.body}\n\n` +
        `${d.likes_count} likes • ${Math.round(d.duration_seconds / 60)} min\n\n`,
    )
    .join("\n");

  const filePath = path.join(POSTS_DIR, `${slug}.mdx`);

  const frontmatter =
    `---\n` +
    `title: "${title}"\n` +
    `description: "${project.description ?? ""}"\n` +
    `date: "${date}"\n` +
    `tag:\n${tags.map((t) => `  - ${t}`).join("\n")}\n` +
    `---\n\n` +
    `${project.description ?? ""}\n\n` +
    `${project.repo_url ? `- **Repo:** [${project.repo_url}](${project.repo_url})\n` : ""}` +
    `${project.demo_url ? `- **Demo:** [${project.demo_url}](${project.demo_url})\n` : ""}` +
    `${project.readme_url ? `- **Readme:** [${project.readme_url}](${project.readme_url})\n` : ""}\n\n` +
    `## Contents\n` +
    `${devlogContent}`;

  fs.writeFileSync(filePath, frontmatter, "utf-8");
}
fs.writeFileSync(POSTS_JSON, JSON.stringify(posts, null, 4), "utf-8");

function getNavSlugs(index: number) {
  const prev = posts[(index - 1 + posts.length) % posts.length].slug;
  const next = posts[(index + 1) % posts.length].slug;
  return { prev, next };
}

posts.forEach((post: Post, index: number) => {
  const mdxPath = path.join(POSTS_DIR, `${post.slug}.mdx`);
  if (!fs.existsSync(mdxPath)) return;

  const content = fs.readFileSync(mdxPath, "utf8");
  const fmMatch = content.match(/^---\s*([\s\S]*?)\s*---/);
  if (!fmMatch) return;

  const fmData = yaml.load(fmMatch[1]) as Record<string, any>;
  const { prev, next } = getNavSlugs(index);

  fmData.prev = prev;
  fmData.next = next;

  const updatedYaml = yaml.dump(fmData, { lineWidth: -1 }).trim();
  const updatedContent =
    `---\n${updatedYaml}\n---\n` + content.slice(fmMatch[0].length).trimStart();

  fs.writeFileSync(mdxPath, updatedContent, "utf8");
});
