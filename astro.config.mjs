import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";
import tailwind from "@astrojs/tailwind";
import identity from "./src/data/site-identity.json";

const siteUrl = identity.site_url.replace(/\/$/, "");
const articlesDir = fileURLToPath(new URL("./src/content/articles", import.meta.url));

function loadLiveArticles() {
  const now = new Date();
  if (!fs.existsSync(articlesDir)) return [];
  return fs
    .readdirSync(articlesDir)
    .filter((file) => file.endsWith(".md"))
    .map((file) => {
      const raw = fs.readFileSync(path.join(articlesDir, file), "utf8");
      const slug = file.replace(/\.md$/, "");
      const date = raw.match(/^date:\s*['"]?(\d{4}-\d{2}-\d{2})/m)?.[1];
      const status = raw.match(/^status:\s*['"]?(\w+)/m)?.[1] ?? "published";
      const isDraft = /^isDraft:\s*true/m.test(raw);
      const categorySlug = raw.match(/^categorySlug:\s*['"]?([a-z0-9-]+)/m)?.[1];
      return { slug, date, status, isDraft, categorySlug };
    })
    .filter((a) => a.status === "published" && !a.isDraft && a.date && new Date(a.date) <= now);
}

const liveArticles = loadLiveArticles();
const lastmodBySlug = new Map(liveArticles.map((a) => [a.slug, a.date]));
const lastmodByCategory = new Map();
for (const article of liveArticles) {
  if (!article.categorySlug || !article.date) continue;
  const prev = lastmodByCategory.get(article.categorySlug);
  if (!prev || article.date > prev) lastmodByCategory.set(article.categorySlug, article.date);
}
const latestArticleDate = liveArticles.reduce((max, a) => (a.date && a.date > max ? a.date : max), "");

export default defineConfig({
  site: siteUrl,
  trailingSlash: "always",
  output: "static",
  build: { assets: "assets" },
  integrations: [
    tailwind(),
    sitemap({
      filter: (page) => {
        if (
          page.includes("/mentions-legales") ||
          page.includes("/politique-de-confidentialite") ||
          page.includes("/contact")
        ) {
          return false;
        }
        const categoryMatch = page.match(/\/category\/([^/]+)\/?$/);
        if (categoryMatch && !lastmodByCategory.has(categoryMatch[1])) {
          return false;
        }
        return true;
      },
      serialize(item) {
        const pathname = new URL(item.url).pathname;
        const categoryMatch = pathname.match(/^\/category\/([^/]+)\/$/);
        if (categoryMatch) {
          const lastmod = lastmodByCategory.get(categoryMatch[1]);
          if (!lastmod) return undefined;
          item.lastmod = new Date(lastmod);
          return item;
        }
        const articleMatch = pathname.match(/^\/([^/]+)\/$/);
        if (articleMatch && lastmodBySlug.has(articleMatch[1])) {
          item.lastmod = new Date(lastmodBySlug.get(articleMatch[1]));
          return item;
        }
        if (pathname === "/" && latestArticleDate) {
          item.lastmod = new Date(latestArticleDate);
        }
        return item;
      },
    }),
  ],
});
