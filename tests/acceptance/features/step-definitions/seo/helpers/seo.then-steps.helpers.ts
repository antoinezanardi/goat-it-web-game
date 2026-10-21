import type { Page } from "@playwright/test";

import type { SchemaOrgGraphNode } from "#acceptance/features/step-definitions/seo/helpers/seo.then-steps.helpers.types.ts";

async function collectSchemaOrgGraphNodes(page: Page): Promise<SchemaOrgGraphNode[]> {
  const scriptLocator = page.locator("script[type=\"application/ld+json\"]");
  const scriptCount = await scriptLocator.count();
  const graphNodes: SchemaOrgGraphNode[] = [];

  for (let index = 0; index < scriptCount; index++) {
    // Acceptable as each JSON-LD script must be parsed and validated sequentially
    // oxlint-disable-next-line eslint/no-await-in-loop
    const jsonContent = await scriptLocator.nth(index).textContent();

    if (jsonContent === null) {
      throw new Error(`Expected JSON-LD script at index ${index} to have text content.`);
    }

    // Acceptable as JSON.parse returns any and the schema.org graph shape is validated by the assertions
    // oxlint-disable-next-line typescript/no-unsafe-type-assertion
    const parsed = JSON.parse(jsonContent) as { "@graph"?: SchemaOrgGraphNode[] };

    graphNodes.push(...parsed["@graph"] ?? []);
  }
  return graphNodes;
}

function collectSchemaOrgGraphTypes(graphNodes: SchemaOrgGraphNode[]): string[] {
  return graphNodes.flatMap(graphNode => graphNode["@type"] ?? []);
}

async function fetchSitemapXml(page: Page): Promise<string> {
  const baseUrl = new URL(page.url()).origin;
  const response = await page.request.get(`${baseUrl}/sitemap.xml`);

  return response.text();
}

export {
  collectSchemaOrgGraphNodes,
  collectSchemaOrgGraphTypes,
  fetchSitemapXml,
};