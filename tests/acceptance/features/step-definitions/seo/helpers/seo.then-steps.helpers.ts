import type { Page } from "@playwright/test";

async function fetchSitemapXml(page: Page): Promise<string> {
  const baseUrl = new URL(page.url()).origin;
  const response = await page.request.get(`${baseUrl}/sitemap.xml`);

  return response.text();
}

export {
  fetchSitemapXml,
};