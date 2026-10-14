import type { Plugin } from "vite";
import { readSync } from "to-vfile";
import { matter } from "vfile-matter";
import { resolve, join } from "node:path";
import { readdirSync, statSync, writeFileSync } from "node:fs";
import { exec } from "node:child_process";

const processFiles = () => {
	const outputFile = resolve("src/data/posts.json");
	const blogDir = resolve("src/routes/blog/posts");
	const files = readdirSync(blogDir);
	const blogPosts = files
		.filter(
			(file) => statSync(join(blogDir, file)).isFile() && (file.endsWith(".mdx") || file.endsWith(".md")),
		)
		.map((file) => {
			const f = readSync(resolve("src/routes/blog/posts", file));
			matter(f);
			const frontmatter = f.data.matter as {
				date: string;
				updatedAt?: string;
			};
			return {
				...(frontmatter as object),
				slug: file.replace(/\.mdx?$/, ""),
				createdAt: frontmatter.date,
				// Hand-written posts opt in via an `updatedAt:` frontmatter
				// field; the project sync stamps it from the newest devlog.
				updatedAt: frontmatter.updatedAt ?? frontmatter.date,
			} as { date: string; createdAt: string; updatedAt: string; slug: string };
		})
		.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

	writeFileSync(outputFile, JSON.stringify(blogPosts, null, 2), "utf-8");

	exec("bunx @biomejs/biome format --write ./src/data/posts.json");
};

export default function postPlugin(): Plugin {
	return {
		name: "posts-gen",
		// buildStart (not buildEnd): posts.json is imported by the bundle,
		// so it must be fresh BEFORE bundling, or new posts miss the deploy.
		buildStart() {
			processFiles();
		},
		configureServer(server) {
			const onFile = (filePath: string) => {
				if (
					!filePath.includes("/src/routes/blog/posts") &&
					!filePath.includes("/src/plugins/postsPlugin.ts")
				)
					return;

				processFiles();
			};
			// "change" alone misses new files ("add") and deletions ("unlink").
			server.watcher.on("change", onFile);
			server.watcher.on("add", onFile);
			server.watcher.on("unlink", onFile);
		},
	};
};