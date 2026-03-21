import { SitemapStream, streamToPromise } from "sitemap"
import { writeFileSync, readdirSync, readFileSync, statSync } from "fs"
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
      if (entry.name.includes("[")) continue

      let route = entry.name.replace(/\.tsx$/, "").replace(/^index$/, "")
      route = base + (route ? "/" + route : "")
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
    posts.push({
      url: `/blog/${slug}/`,
      lastmod: statSync(path.join(postsDir, file)).mtime.toISOString()
    })

    const content = readFileSync(path.join(postsDir, file), "utf8")
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
        tags.add(`/tags/${slugTag}/`)
      }
    }
  }

  return { posts, tags: [...tags] }
}

async function generate() {
  const smStream = new SitemapStream({ hostname })

  const routes = walk(routesDir)
  const { posts, tags } = getBlogData()

  let urls = [...routes.map(r => ({ url: r })), ...posts, ...tags.map(t => ({ url: t }))]

  urls = urls.map(u => ({ ...u, url: u.url === "/" ? "/" : u.url.replace(/\/?$/, "/") }))

  urls.forEach((entry) => {
    const sitemapEntry = {
      url: entry.url
    }

    if (entry.url === "/") {
      sitemapEntry.priority = 1.0
      sitemapEntry.changefreq = "weekly"
    } else {
      sitemapEntry.priority = 0.7
      sitemapEntry.changefreq = "weekly"
    }

    if (entry.lastmod) sitemapEntry.lastmod = entry.lastmod

    smStream.write(sitemapEntry)
  })

  smStream.end()

  const sitemap = await streamToPromise(smStream).then(sm => sm.toString())
  writeFileSync("./public/sitemap.xml", sitemap)
  console.log("✅ Sitemap generated with", urls.length, "URLs")
}

generate()