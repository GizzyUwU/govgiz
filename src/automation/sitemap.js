import { SitemapStream, streamToPromise } from "sitemap"
import { writeFileSync, readdirSync, readFileSync } from "fs"
import path from "path"

const hostname = "https://gizzy.gay"
const routesDir = "./src/routes"
const postsDir = "./src/routes/blog/posts"

function walk(dir, base = "") {
  const entries = readdirSync(dir, { withFileTypes: true })
  let routes = []

  for (const entry of entries) {
    const full = path.join(dir, entry.name)

    if (entry.isDirectory()) {
      routes = routes.concat(walk(full, base + "/" + entry.name))
    }

    if (entry.isFile() && entry.name.endsWith(".tsx")) {
      if (entry.name.includes("[")) continue // skip dynamic routes

      let route = entry.name
        .replace(/\.tsx$/, "")
        .replace(/^index$/, "")

      route = base + (route ? "/" + route : "")

      // skip invalid routes with parentheses
      if (route.includes("(") || route.includes(")")) continue

      if (route === "") route = "/"

      routes.push(route)
    }
  }

  return routes
}

function getBlogData() {
  const files = readdirSync(postsDir)
  const posts = []
  const tags = new Set()

  for (const file of files) {
    if (!file.endsWith(".md")) continue

    const slug = file.replace(/\.md$/, "")
    posts.push(`/blog/${slug}`)

    const content = readFileSync(path.join(postsDir, file), "utf8")

    // match tags list in YAML frontmatter
    const tagMatch = content.match(/tags:\s*\n((\s*-\s*.*\n)+)/)

    if (tagMatch) {
      const tagLines = tagMatch[1]
        .split("\n")
        .map(l => l.trim())
        .filter(l => l.startsWith("-"))

      for (const line of tagLines) {
        let tag = line.replace("-", "").trim()
        
        if (!tag || tag === "--") continue
        const slugTag = tag.toLowerCase().replace(/\s+/g, "-")
        tags.add(`/tags/${slugTag}`)
      }
    }
  }

  return { posts, tags: [...tags] }
}

async function generate() {
  const smStream = new SitemapStream({ hostname })

  const routes = walk(routesDir)
  const { posts, tags } = getBlogData()

  const urls = [...routes, ...posts, ...tags]

  urls.forEach((url) => {
    smStream.write({
      url,
      changefreq: "weekly",
      priority: url === "/" ? 1.0 : 0.7
    })
  })

  smStream.end()

  const sitemap = await streamToPromise(smStream).then((sm) => sm.toString())

  writeFileSync("./public/sitemap.xml", sitemap)
  console.log("✅ Sitemap generated with", urls.length, "URLs")
}

generate()