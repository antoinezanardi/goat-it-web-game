import type { DataTable } from "@cucumber/cucumber";
import type { ZodType } from "zod";
import { z } from "zod";

/**
 * Creates a Zod schema that coerces an empty string to `undefined` and validates non-empty strings.
 * Used to handle optional DataTable columns where empty cells should be treated as undefined.
 * Only used in acceptance tests.
 *
 * @returns A Zod schema that transforms empty/non-string values to undefined.
 */
function zCoerceOptionalString(): ZodType<string | undefined> {
  return z.optional(z.preprocess((value: unknown): string | undefined => (typeof value !== "string" || value === "" ? undefined : value), z.string().optional()));
}

/**
 * Validates a Cucumber DataTable against a Zod schema and returns all parsed rows.
 * Throws if the table has no data rows or if any row fails schema validation.
 * Only used in acceptance tests.
 *
 * @param dataTable - The Cucumber DataTable to validate.
 * @param schema - The Zod schema each row must conform to.
 * @returns An array of validated, typed rows.
 */
function validateDataTableAndGetRows<T>(dataTable: DataTable, schema: ZodType<T>): T[] {
  const rows = dataTable.hashes();

  if (rows.length === 0) {
    throw new Error("DataTable must contain at least one data row.");
  }

  const parsedRows = schema.array().safeParse(rows);

  if (!parsedRows.success) {
    throw new Error(`Invalid DataTable:\n${parsedRows.error.message}`);
  }
  return parsedRows.data;
}

/**
 * Validates a Cucumber DataTable and returns only the first parsed row.
 * Useful when a step expects exactly one row of data (e.g. a single entity's attributes).
 * Only used in acceptance tests.
 *
 * @param dataTable - The Cucumber DataTable to validate.
 * @param schema - The Zod schema the row must conform to.
 * @returns The first validated, typed row.
 */
function validateDataTableAndGetFirstRow<T>(dataTable: DataTable, schema: ZodType<T>): T {
  const [firstRow] = validateDataTableAndGetRows(dataTable, schema);

  // Acceptable as validateDataTableAndGetRows guarantees at least one element in the returned array
  // oxlint-disable-next-line typescript/no-unsafe-type-assertion
  return firstRow as T;
}

export { validateDataTableAndGetFirstRow, validateDataTableAndGetRows, zCoerceOptionalString };