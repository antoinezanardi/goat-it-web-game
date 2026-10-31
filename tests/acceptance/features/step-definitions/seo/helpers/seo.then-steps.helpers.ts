import type { Page } from "@playwright/test";

import type { SchemaOrgGraphNode } from "#acceptance/features/step-definitions/seo/helpers/seo.then-steps.helpers.types.ts";

async function collectSchemaOrgGraphNodes(page: Page): Promise<SchemaOrgGraphNode[]> {
  const scriptLocator = page.locator("script[type=\"application/ld+json\"]");
  const scriptCount = await scriptLocator.count();
  const graphNodes: SchemaOrgGraphNode[] = [];

  for (let index = 0; index < scriptCount; index++) {
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

function hasSchemaOrgGraphType(graphNode: SchemaOrgGraphNode, graphType: string): boolean {
  const rawGraphTypes = graphNode["@type"] ?? [];
  const graphTypes = Array.isArray(rawGraphTypes) ? rawGraphTypes : [rawGraphTypes];

  return graphTypes.includes(graphType);
}

function findSchemaOrgGraphNodeByType(graphNodes: SchemaOrgGraphNode[], graphType: string): SchemaOrgGraphNode | undefined {
  return graphNodes.find(graphNode => hasSchemaOrgGraphType(graphNode, graphType));
}

async function fetchSitemapXml(page: Page): Promise<string> {
  const baseUrl = new URL(page.url()).origin;
  const response = await page.request.get(`${baseUrl}/sitemap.xml`);

  return response.text();
}

export {
  collectSchemaOrgGraphNodes,
  fetchSitemapXml,
  findSchemaOrgGraphNodeByType,
  hasSchemaOrgGraphType,
};