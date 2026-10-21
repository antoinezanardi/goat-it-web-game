import type { DataTable } from "@cucumber/cucumber";
import { Then } from "@cucumber/cucumber";
import { expect } from "@playwright/test";

import { validateDataTableAndGetRows } from "#acceptance/features/support/helpers/datatable.helpers.ts";
import type { GoatItWorld } from "#acceptance/features/support/types/world.types.ts";
import {
  collectSchemaOrgGraphNodes,
  fetchSitemapXml,
  findSchemaOrgGraphNodeByType,
  hasSchemaOrgGraphType,
} from "#acceptance/features/step-definitions/seo/helpers/seo.then-steps.helpers.ts";

import { SEO_META_TAG_ROW_SCHEMA } from "./datatables/seo.datatables.schemas.ts";

const HTTP_STATUS_OK = 200;

const HTTP_STATUS_NOT_FOUND = 404;

const SOCIAL_IMAGE_HEIGHT = 600;

const SOCIAL_IMAGE_WIDTH = 1200;

Then(
  /^the following meta tags should be present:$/u,
  async function(this: GoatItWorld, dataTable: DataTable): Promise<void> {
    const rows = validateDataTableAndGetRows(dataTable, SEO_META_TAG_ROW_SCHEMA);

    for (const row of rows) {
      const selector = `head meta[${row.type}="${row.key}"]`;
      // Acceptable as each meta tag assertion must be awaited sequentially to verify its content
      // oxlint-disable-next-line eslint/no-await-in-loop
      await expect(this.page.locator(selector)).toHaveAttribute("content", row.content);
    }
  },
);

Then(
  /^the meta tag with property "(?<property>[^"]*)" should be present$/u,
  async function(this: GoatItWorld, property: string): Promise<void> {
    await expect(this.page.locator(`head meta[property="${property}"], head meta[name="${property}"]`)).toBeAttached();
  },
);

Then(
  /^the robots.txt response should not reference the sitemap$/u,
  async function(this: GoatItWorld): Promise<void> {
    const content = await this.page.locator("body").textContent() ?? "";

    expect(content).not.toMatch(/^\s*Sitemap:/imu);
  },
);

Then(
  /^the home response should expose a non-indexable X-Robots-Tag$/u,
  async function(this: GoatItWorld): Promise<void> {
    const response = await this.page.request.get(new URL(this.page.url()).origin);
    const robotsHeader = response.headers()["x-robots-tag"];

    expect(robotsHeader).toContain("noindex");
  },
);

Then(
  /^the robots.txt response should disallow crawling$/u,
  async function(this: GoatItWorld): Promise<void> {
    const content = await this.page.locator("body").textContent() ?? "";
    const wildcardGroup = content.split(/\n\s*\n/u).find(group => group.includes("User-agent: *"));
    const wildcardDirectives = wildcardGroup?.split("\n").map(line => line.trim()) ?? [];

    expect(wildcardGroup).toBeDefined();
    expect(wildcardDirectives).toContain("Disallow: /");
    expect(wildcardDirectives).not.toContain("Allow: /");
  },
);

Then(
  /^the robots.txt response should allow crawling$/u,
  async function(this: GoatItWorld): Promise<void> {
    const content = await this.page.locator("body").textContent() ?? "";
    const wildcardGroup = content.split(/\n\s*\n/u).find(group => group.includes("User-agent: *"));
    const wildcardDirectives = wildcardGroup?.split("\n").map(line => line.trim()) ?? [];

    expect(wildcardGroup).toBeDefined();
    expect(wildcardDirectives).toContain("Allow: /");
    expect(wildcardDirectives).not.toContain("Disallow: /");
  },
);

Then(
  /^the sitemap.xml should not be served$/u,
  async function(this: GoatItWorld): Promise<void> {
    const baseUrl = new URL(this.page.url()).origin;
    const response = await this.page.request.get(`${baseUrl}/sitemap.xml`);

    expect(response.status()).toBe(HTTP_STATUS_NOT_FOUND);
  },
);

Then(
  /^the sitemap.xml should contain the route "(?<route>[^"]*)"$/u,
  async function(this: GoatItWorld, route: string): Promise<void> {
    const content = await fetchSitemapXml(this.page);

    const routePattern = route === "/" ? /<loc>https?:\/\/[^<]+\/?<\/loc>/u : new RegExp(`<loc>https?://[^<]*${route.replaceAll(/[.*+?^${}()|[\]\\]/gu, String.raw`\$&`)}</loc>`, "u");

    expect(content).toMatch(routePattern);
  },
);

Then(
  /^the sitemap.xml should contain exactly the expected routes$/u,
  async function(this: GoatItWorld): Promise<void> {
    const expectedRoutes = ["/", "/game", "/rules"];
    const content = await fetchSitemapXml(this.page);

    const locMatches = content.match(/<loc>[^<]*<\/loc>/gu) ?? [];

    expect(locMatches.length).toBe(expectedRoutes.length);

    for (const locMatch of locMatches) {
      const url = locMatch.replaceAll(/<\/?loc>/gu, "");
      const isMatchingExpected = expectedRoutes.some(route => url.endsWith(route) || url.endsWith(`${route}/`));

      expect(isMatchingExpected).toBe(true);
    }
  },
);

Then(
  /^the canonical link should point to the current page$/u,
  async function(this: GoatItWorld): Promise<void> {
    const canonicalLocator = this.page.locator("head link[rel=\"canonical\"]");

    await expect(canonicalLocator).toBeAttached();

    const canonicalHref = await canonicalLocator.getAttribute("href");
    const currentUrl = this.page.url();

    expect(canonicalHref).toBeTruthy();

    if (canonicalHref === null) {
      throw new Error("Expected the canonical link to have an href attribute.");
    }

    const canonicalPath = new URL(canonicalHref).pathname;
    const currentPath = new URL(currentUrl).pathname;

    expect(canonicalPath).toBe(currentPath);
  },
);

Then(
  /^the page should contain schema.org WebPage and WebSite structured data$/u,
  async function(this: GoatItWorld): Promise<void> {
    const graphNodes = await collectSchemaOrgGraphNodes(this.page);
    const webSiteNode = findSchemaOrgGraphNodeByType(graphNodes, "WebSite");
    const webPageNode = findSchemaOrgGraphNodeByType(graphNodes, "WebPage");

    if (webSiteNode === undefined || webPageNode === undefined) {
      throw new Error("Expected the schema.org graph to contain WebSite and WebPage nodes.");
    }

    expect(webSiteNode.description).toBe("Goat It is a deduction game based on unusual facts. Ask the Game Master your questions, " +
      "investigate, and find the answer.");
    expect(webSiteNode.inLanguage).toBe("en-US");
    expect(webPageNode.inLanguage).toBe("en");
    expect(webPageNode.primaryImageOfPage?.contentUrl).toMatch(/\/og-image\.png$/u);
    expect(webPageNode.primaryImageOfPage?.width).toBe(SOCIAL_IMAGE_WIDTH);
    expect(webPageNode.primaryImageOfPage?.height).toBe(SOCIAL_IMAGE_HEIGHT);
  },
);

Then(
  /^the page should contain the schema.org Organization identity$/u,
  async function(this: GoatItWorld): Promise<void> {
    const graphNodes = await collectSchemaOrgGraphNodes(this.page);
    const organizationNode = findSchemaOrgGraphNodeByType(graphNodes, "Organization");

    if (organizationNode === undefined) {
      throw new Error("Expected the schema.org graph to contain an Organization node.");
    }

    expect(organizationNode.name).toBe("Goat It");
    expect(organizationNode.description).toBe("Goat It is a deduction game based on unusual facts. Ask the Game Master your questions, " +
      "investigate, and find the answer.");
    expect(organizationNode.email).toBe("antoine.zanardi@epitech.eu");
    expect(organizationNode.foundingDate).toBe("2025-10-11");
    expect(organizationNode.slogan).toBe("The game where the answer is guessed");
    expect(organizationNode.sameAs).toContain("https://github.com/antoinezanardi/goat-it-web-game");

    const organizationLogoId = organizationNode.logo?.["@id"];

    if (organizationLogoId === undefined) {
      throw new Error("Expected the schema.org Organization node to reference a logo.");
    }

    const organizationLogoNode = graphNodes.find(graphNode => graphNode["@id"] === organizationLogoId);

    if (organizationLogoNode === undefined) {
      throw new Error("Expected the schema.org Organization logo to reference an existing graph node.");
    }

    expect(hasSchemaOrgGraphType(organizationLogoNode, "ImageObject")).toBe(true);
    expect(organizationLogoNode.contentUrl?.endsWith("/pwa/pwa-512x512.png")).toBe(true);
  },
);

Then(
  /^the schema.org graph should contain a logo image pointing to the PWA icon$/u,
  async function(this: GoatItWorld): Promise<void> {
    const graphNodes = await collectSchemaOrgGraphNodes(this.page);
    const logoImageNode = graphNodes.find(graphNode => hasSchemaOrgGraphType(graphNode, "ImageObject") && graphNode.contentUrl?.endsWith("/pwa/pwa-512x512.png") === true);

    expect(logoImageNode).toBeDefined();
  },
);

Then(
  /^the og:image should return a valid PNG image$/u,
  async function(this: GoatItWorld): Promise<void> {
    const metaLocator = this.page.locator("head meta[property=\"og:image\"]");

    await expect(metaLocator).toBeAttached();

    const ogImageUrl = await metaLocator.getAttribute("content");

    if (ogImageUrl === null) {
      throw new Error("Expected og:image meta tag to have a content attribute.");
    }

    const ogImagePath = new URL(ogImageUrl, this.page.url()).pathname;
    const localOgImageUrl = new URL(ogImagePath, this.page.url());

    const response = await this.page.request.get(localOgImageUrl.toString());

    expect(response.status()).toBe(HTTP_STATUS_OK);
    expect(response.headers()["content-type"]).toContain("image/png");
  },
);

Then(
  /^the html lang attribute should be "(?<language>[^"]*)"$/u,
  async function(this: GoatItWorld, language: string): Promise<void> {
    await expect(this.page.locator("html")).toHaveAttribute("lang", language);
  },
);