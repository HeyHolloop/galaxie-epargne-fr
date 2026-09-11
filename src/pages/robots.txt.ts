import type { APIRoute } from "astro";
import { SITE_URL } from "../config";

const AI_BOTS = [
  "Amazonbot",
  "Applebot-Extended",
  "Bytespider",
  "CCBot",
  "ClaudeBot",
  "Google-Extended",
  "GPTBot",
  "meta-externalagent",
];

export const GET: APIRoute = () => {
  const lines = [
    "User-agent: *",
    "Content-Signal: search=yes,ai-train=no,use=reference",
    "Allow: /",
    "Disallow: /mentions-legales/",
    "Disallow: /politique-de-confidentialite/",
    "Disallow: /contact/",
    "",
    ...AI_BOTS.flatMap((bot) => [`User-agent: ${bot}`, "Disallow: /", ""]),
    `Sitemap: ${SITE_URL}/sitemap-index.xml`,
    "",
  ];
  return new Response(lines.join("\n"), {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
};
