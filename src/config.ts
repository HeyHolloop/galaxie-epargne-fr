import identity from "./data/site-identity.json";

export const SITE_TITLE = identity.site_title;
export const SITE_URL = identity.site_url.replace(/\/$/, "");
export const SITE_DESCRIPTION = identity.site_description;

const id = identity as typeof identity & {
  ui_strings?: Record<string, string>;
  persona?: { name?: string; role?: string; avatar?: string; bio?: string };
};

const uiDefaults: Record<string, string> = {
  readMore: "Lire l’article",
  publishedBy: "Par",
  alsoRead: "À lire également",
  aboutAuthor: "À propos",
  latestArticles: "Dernières publications",
  mostReadArticles: "Les plus lus",
  recentArticles: "Derniers articles",
  home: "Accueil",
  about: "À propos",
  contact: "Contact",
  categories: "Rubriques",
  legalNotice: "Mentions légales",
  privacyPolicy: "Politique de confidentialité",
  discover: "Découvrir",
  newContentComing: "Le contenu arrive bientôt.",
  breadcrumbAria: "Fil d’Ariane",
  masthead: "La rédaction",
};

function buildUi(raw: Record<string, string> | undefined): Record<string, string> {
  const ui: Record<string, string> = {};
  for (const key of Object.keys(uiDefaults)) {
    ui[key] = raw?.[key] || uiDefaults[key];
  }
  return ui;
}

export const SITE_CONFIG = {
  locale: identity.locale,
  contact_email: identity.contact_email,
  legal: identity.legal,
  editionLine: identity.edition_line,
  ui: buildUi(id.ui_strings),
  author: {
    name: identity.author?.name || id.persona?.name || "La rédaction",
    role: identity.author?.role || id.persona?.role || "Rédaction",
    avatar: identity.author?.avatar || id.persona?.avatar || "",
    bio: identity.author?.bio || id.persona?.bio || "",
  },
  hero: identity.hero,
  tools: identity.tools,
  homeSeo: {
    title: identity.home_seo.title,
    description: identity.home_seo.description,
    ogTitle: identity.home_seo.og_title,
    ogDescription: identity.home_seo.og_description,
    twitterTitle: identity.home_seo.twitter_title,
    twitterDescription: identity.home_seo.twitter_description,
    schemaDescription: identity.home_seo.schema_description,
  },
};

export type Rubrique = {
  label: string;
  slug: string;
  description: string;
  hero_title?: string;
  seo_intro?: string;
  question?: string;
  cta?: string;
  links?: string[];
};

export const CATEGORIES: Rubrique[] = identity.categories || [];
export const SOCLE: Rubrique = identity.socle;
export const RUBRIQUES: Rubrique[] = [...CATEGORIES, SOCLE];
