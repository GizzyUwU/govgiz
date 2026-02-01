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
  const tags = ["flavourtown", "flavortown", "projects"];

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

  const filePath = path.join(POSTS_DIR, `${slug}.md`);
  let existingContent = "";
  if (fs.existsSync(filePath)) {
    existingContent = fs.readFileSync(filePath, "utf8");
  }

  const fmMatch = existingContent.match(/^---\s*([\s\S]*?)\s*---/);
  let body = existingContent;
  if (fmMatch) body = existingContent.slice(fmMatch[0].length);

  const existingDevlogIds = Array.from(body.matchAll(/^## Devlog (\d+)/gm)).map(
    (m) => m[1],
  );

  const newDevlogs = devlogs
    .filter((d) => !existingDevlogIds.includes(d.id.toString()))
    .map(
      (d) =>
        `## Devlog ${d.id} • ${new Date(d.created_at).toISOString().slice(0, 10)}\n\n` +
        `${d.body}\n\n${d.likes_count} likes • ${Math.round(d.duration_seconds / 60)} min\n\n`,
    );

  const preDevlogContent = body.split(/^\s*## Devlog/m)[0];

  const existingDevlogContent = body.slice(preDevlogContent.length);

  const frontmatterContent =
    `---\n` +
    `title: "${title}"\n` +
    `description: "${project.description ?? ""}"\n` +
    `date: "${date}"\n` +
    `tags:\n${tags.map((t) => `  - ${t}`).join("\n")}\n` +
    `---\n`;

  const finalContent =
    frontmatterContent +
    preDevlogContent +
    existingDevlogContent +
    newDevlogs.join("");
  fs.writeFileSync(filePath, finalContent, "utf8");
}
fs.writeFileSync(POSTS_JSON, JSON.stringify(posts, null, 4), "utf-8");

posts.forEach((post: Post, index: number) => {
  const mdxPath = path.join(POSTS_DIR, `${post.slug}.md`);
  if (!fs.existsSync(mdxPath)) return;

  const content = fs.readFileSync(mdxPath, "utf8");
  const fmMatch = content.match(/^---\s*([\s\S]*?)\s*---/);
  if (!fmMatch) return;

  const fmData = yaml.load(fmMatch[1]) as Record<string, any>;

  const updatedYaml = yaml.dump(fmData, { lineWidth: -1 }).trim();
  const afterFrontmatter = content
  .slice(fmMatch[0].length)
  .replace(/^\s*\n+/, "\n\n");

  const updatedContent =
  `---\n${updatedYaml}\n---\n\n` + afterFrontmatter.trimStart();

  fs.writeFileSync(mdxPath, updatedContent, "utf8");
});
