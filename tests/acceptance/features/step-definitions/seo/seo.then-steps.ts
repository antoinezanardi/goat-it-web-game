import type { DataTable } from "@cucumber/cucumber";
import { Then } from "@cucumber/cucumber";
import { expect } from "@playwright/test";

import { validateDataTableAndGetRows } from "#acceptance/features/support/helpers/datatable.helpers.ts";
import type { GoatItWorld } from "#acceptance/features/support/types/world.types.ts";

import { SEO_META_TAG_ROW_SCHEMA } from "./datatables/seo.datatables.schemas.ts";

Then(
  /^the following meta tags should be present:$/u,
  async function(this: GoatItWorld, dataTable: DataTable): Promise<void> {
    const rows = validateDataTableAndGetRows(dataTable, SEO_META_TAG_ROW_SCHEMA);

    for (const row of rows) {
      // Acceptable as each meta tag assertion must be awaited sequentially to verify its content
      // oxlint-disable-next-line eslint/no-await-in-loop
      await expect(this.page.locator(row.type === "name" ? `head meta[name="${row.key}"]` : `head meta[property="${row.key}"]`)).toHaveAttribute("content", row.content);
    }
  },
);

Then(
  /^the meta tag with property "(?<property>[^"]*)" should be present$/u,
  async function(this: GoatItWorld, property: string): Promise<void> {
    await expect(this.page.locator(`head meta[property="${property}"]`)).toBeAttached();
  },
);

Then(
  /^the robots.txt response should reference the sitemap$/u,
  async function(this: GoatItWorld): Promise<void> {
    const content = await this.page.locator("body").textContent();

    expect(content).toContain("Sitemap:");
  },
);

Then(
  /^the sitemap.xml should contain the route "(?<route>[^"]*)"$/u,
  async function(this: GoatItWorld, route: string): Promise<void> {
    const baseUrl = new URL(this.page.url()).origin;
    const response = await this.page.request.get(`${baseUrl}/sitemap.xml`);
    const content = await response.text();

    const routePattern = route === "/" ? /<loc>https?:\/\/[^<]+\/?<\/loc>/u : new RegExp(`<loc>https?://[^<]*${route.replaceAll(/[.*+?^${}()|[\]\\]/gu, String.raw`\$&`)}</loc>`, "u");

    expect(content).toMatch(routePattern);
  },
);

Then(
  /^the sitemap.xml should contain exactly the expected routes$/u,
  async function(this: GoatItWorld): Promise<void> {
    const expectedRoutes = ["/", "/game"];
    const baseUrl = new URL(this.page.url()).origin;
    const response = await this.page.request.get(`${baseUrl}/sitemap.xml`);
    const content = await response.text();

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
  /^the sitemap.xml should contain hreflang alternates for all 6 locales$/u,
  async function(this: GoatItWorld): Promise<void> {
    const baseUrl = new URL(this.page.url()).origin;
    const response = await this.page.request.get(`${baseUrl}/sitemap.xml`);
    const content = await response.text();
    const localeCodes = ["fr", "en", "de", "es", "it", "pt"];

    for (const locale of localeCodes) {
      expect(content).toContain(`hreflang="${locale}"`);
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
    const scriptLocator = this.page.locator("script[type=\"application/ld+json\"]");
    const scriptCount = await scriptLocator.count();

    const allGraphTypes: string[] = [];

    for (let index = 0; index < scriptCount; index++) {
      // Acceptable as each JSON-LD script must be parsed and validated sequentially
      // oxlint-disable-next-line eslint/no-await-in-loop
      const jsonContent = await scriptLocator.nth(index).textContent();

      if (jsonContent === null) {
        throw new Error(`Expected JSON-LD script at index ${index} to have text content.`);
      }

      // Acceptable as JSON.parse returns any and the schema.org script shape is validated at runtime
      // oxlint-disable-next-line typescript/no-unsafe-type-assertion
      const parsed = JSON.parse(jsonContent) as { "@graph"?: { "@type"?: string | string[] }[] };

      const graphTypes = (parsed["@graph"] ?? []).flatMap(node => node["@type"] ?? []);

      allGraphTypes.push(...graphTypes);
    }

    expect(allGraphTypes).toContain("WebSite");
    expect(allGraphTypes).toContain("WebPage");
  },
);