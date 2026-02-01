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
			return {
				...(f.data.matter as object),
				slug: file.replace(/\.mdx?$/, ""),
			} as { date: string; slug: string };
		})
		.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

	writeFileSync(outputFile, JSON.stringify(blogPosts, null, 2), "utf-8");

	exec("bunx @biomejs/biome format --write ./src/data/posts.json");
};

export default function postPlugin(): Plugin {
	return {
		name: "posts-gen",
		buildEnd() {
			processFiles();
		},
		configureServer(server) {
			server.watcher.on("change", (filePath) => {
				if (
					!filePath.includes("/src/routes/blog/posts") &&
					!filePath.includes("/src/plugins/postsPlugin.ts")
				)
					return;

				processFiles();
			});
		},
	};
};