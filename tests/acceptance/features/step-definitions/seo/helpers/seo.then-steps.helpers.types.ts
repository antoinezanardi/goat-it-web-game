type SchemaOrgImageObject = {
  "@type"?: string | string[];
  "contentUrl"?: string;
  "height"?: number;
  "url"?: string;
  "width"?: number;
};

type SchemaOrgGraphNode = {
  "@id"?: string;
  "@type"?: string | string[];
  "contentUrl"?: string;
  "description"?: string;
  "email"?: string;
  "foundingDate"?: string;
  "inLanguage"?: string | string[];
  "logo"?: { "@id"?: string };
  "name"?: string;
  "primaryImageOfPage"?: SchemaOrgImageObject;
  "sameAs"?: string[];
  "slogan"?: string;
};

export type { SchemaOrgGraphNode };