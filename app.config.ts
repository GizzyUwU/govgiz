import { defineConfig } from "@solidjs/start/config";
import { viteStaticCopy } from "vite-plugin-static-copy";
import type { UserConfig as ViteConfig } from "vite";
import path from "path";
import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default defineConfig({
ssr: false,
  vite: {
    plugins: [
      viteStaticCopy({
        targets: [
          {
            src: path.resolve(
              __dirname,
              "node_modules/govuk-frontend/dist/govuk/assets",
            ),
            dest: "assets",
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
  } satisfies ViteConfig
});
