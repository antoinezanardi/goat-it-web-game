import type { Page } from "@playwright/test";

/**
 * Checks whether the first visible table on the page contains at least one row
 * whose cell texts include all the specified expected values (exact equality per cell).
 * Only used in acceptance tests.
 *
 * @param page - The Playwright page instance.
 * @param expectedAttributes - A record of attribute values to match against table cells. Undefined values are skipped.
 * @returns Whether a matching row was found.
 */
async function doesTableContainRowMatchingAttributes(page: Page, expectedAttributes: Record<string, string | undefined>): Promise<boolean> {
  const table = page.getByRole("table");
  const rows = table.getByRole("row");
  const rowCount = await rows.count();

  for (let rowIndex = 0; rowIndex < rowCount; rowIndex++) {
    const currentRow = rows.nth(rowIndex);
    const cells = currentRow.getByRole("cell");
    const cellCount = await cells.count();
    const cellTexts: string[] = [];

    for (let cellIndex = 0; cellIndex < cellCount; cellIndex++) {
      // Acceptable as Playwright locators require sequential evaluation to read each cell's text
      // oxlint-disable-next-line unicorn/prefer-dom-node-text-content
      const text = await cells.nth(cellIndex).innerText();

      cellTexts.push(text.trim());
    }

    const doAllMatch = Object.values(expectedAttributes).every(value => {
      if (value === undefined) {
        return true;
      }
      return cellTexts.some(cell => cell === value);
    });

    if (doAllMatch) {
      return true;
    }
  }
  return false;
}

export { doesTableContainRowMatchingAttributes };