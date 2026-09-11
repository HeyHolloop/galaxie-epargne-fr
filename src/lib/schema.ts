type Org = {
  "@type": "Organization";
  "@id": string;
  name: string;
  url: string;
};

export function siteOrganization(siteTitle: string, siteUrl: string): Org {
  const url = siteUrl.replace(/\/$/, "");
  return {
    "@type": "Organization",
    "@id": `${url}/#organization`,
    name: siteTitle,
    url: `${url}/`,
  };
}

/** Force author/publisher = Organization (plus de Person / faux rédacteur). */
export function withOrgAuthor(schemaJson: unknown, siteTitle: string, siteUrl: string): unknown {
  const org = siteOrganization(siteTitle, siteUrl);
  if (!schemaJson || typeof schemaJson !== "object") return schemaJson;
  const next = { ...(schemaJson as Record<string, unknown>) };
  next.author = org;
  next.publisher = org;
  return next;
}
