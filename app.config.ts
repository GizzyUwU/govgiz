import type { UserConfig as ViteConfig } from "vite";
import { defineConfig } from "@solidjs/start/config";
import { viteStaticCopy } from "vite-plugin-static-copy";
import { fileURLToPath } from "url";
import path from "path";
//@ts-expect-error
import pkg from "@vinxi/plugin-mdx";
import remarkFrontmatter from "remark-frontmatter";
import rehypeMdxCodeProps from "rehype-mdx-code-props";
import mdxPrism from "./plugins/mdxPrism";
import prismjs from "vite-plugin-prismjs";
import remarkToc from "remark-toc";
import remarkGfm from "remark-gfm"
import postsPlugin from "./plugins/postsPlugin";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const { default: mdx } = pkg;
export default defineConfig({
  extensions: ["mdx", "md"],
  vite: {
    build: {
      target: "esnext",
    },
    plugins: [
      prismjs({
        languages: "all",
        plugins: ["line-numbers"],
        css: true,
      }),
      mdx.withImports({})({
        remarkPlugins: [remarkFrontmatter, remarkToc, remarkGfm],
        rehypePlugins: [rehypeMdxCodeProps, mdxPrism],
        jsx: true,
        jsxImportSource: "solid-js",
        providerImportSource: "solid-mdx",
      }),
      postsPlugin(),
      viteStaticCopy({
        targets: [
          {
            src: path.resolve(
              __dirname,
              "node_modules/govuk-frontend/dist/govuk/assets",
            ),
            dest: "assets"
          },
          {
            src: path.resolve(
              __dirname,
              "node_modules/govuk-frontend/dist/govuk/govuk-frontend.min.css",
            ),
            dest: "assets",
          },
        ],
      }),
    ],
  } satisfies ViteConfig,
  server: {
    preset: "static",
    prerender: {
      crawlLinks: true
    }
  },
});
