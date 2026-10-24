import { getValidatedQuery, readValidatedBody } from "h3";
import { z } from "zod";
import type { H3Event } from "h3";

import type { UnrecognizedKeysIssue } from "#server/utils/goat-it-api/goat-it-api.types";
import { HttpStatusCode } from "#server/utils/http/http.enums";
import { GOAT_IT_API_PROXY_ERROR_CODES } from "#shared/constants/goat-it-api.constants";
import { isRecord } from "#shared/utils/helpers/object/object.helpers";

function isUnrecognizedKeysIssue(issue: z.core.$ZodIssue): issue is UnrecognizedKeysIssue {
  return issue.code === "unrecognized_keys";
}

function getDescendant(target: unknown, path: readonly PropertyKey[]): unknown {
  let current = target;

  for (const segment of path) {
    if (Array.isArray(current)) {
      current = current[Number(segment)];
    } else if (isRecord(current)) {
      current = current[String(segment)];
    } else {
      return undefined;
    }
  }
  return current;
}

/**
 * Removes the keys reported by `unrecognized_keys` issues from a structured clone of the upstream payload.
 */
function stripUnrecognizedKeys(rawData: unknown, issues: UnrecognizedKeysIssue[]): unknown {
  const strippedData = structuredClone(rawData);

  for (const issue of issues) {
    const target = getDescendant(strippedData, issue.path);

    if (isRecord(target)) {
      for (const key of issue.keys) {
        Reflect.deleteProperty(target, key);
      }
    }
  }
  return strippedData;
}

function formatStrippedPaths(issues: UnrecognizedKeysIssue[]): string {
  return issues.map(issue => [...issue.path, ...issue.keys].map(String).join(".")).join(", ");
}

/**
 * Validates an upstream array payload against a DTO schema and maps every item to its domain type.
 *
 * Additive upstream fields are tolerated: when every issue is `unrecognized_keys`, those keys are stripped from a structured clone,
 * the payload is re-parsed, and the removed paths are logged. Any other contract drift is rethrown.
 *
 * @throws When the payload does not match the schema for any reason besides unknown keys.
 */
function parseAndMapGoatItApiResponse<Dto, Domain>(
  rawData: unknown,
  dtoSchema: z.ZodType<Dto>,
  mapper: (dto: Dto) => Domain,
): Domain[] {
  const responseSchema = z.array(dtoSchema);
  const parseResult = responseSchema.safeParse(rawData);

  if (parseResult.success) {
    return parseResult.data.map(mapper);
  }

  const unrecognizedKeysIssues = parseResult.error.issues.filter(isUnrecognizedKeysIssue);

  if (unrecognizedKeysIssues.length !== parseResult.error.issues.length) {
    throw parseResult.error;
  }

  const mappedResult = responseSchema.parse(stripUnrecognizedKeys(rawData, unrecognizedKeysIssues)).map(mapper);

  console.error(`Goat It API response had unrecognized keys removed: ${formatStrippedPaths(unrecognizedKeysIssues)}`);

  return mappedResult;
}

function isBadRequestError(error: unknown): boolean {
  return isRecord(error) && error.statusCode === HttpStatusCode.BAD_REQUEST;
}

/**
 * Validates the incoming query string against a schema and returns the parsed value.
 *
 * Validation failures become a 400 proxy error carrying `errorCode: "invalid-request"`, so the client never sees Zod details.
 *
 * @throws When the query is invalid; also rethrows unrelated request-reading failures.
 */
async function validateGoatItApiQuery<Query>(event: H3Event, schema: z.ZodType<Query>): Promise<Query> {
  try {
    return await getValidatedQuery(event, rawQuery => schema.parse(rawQuery));
  } catch(error: unknown) {
    if (!isBadRequestError(error)) {
      throw error;
    }
    throw createError({
      statusCode: HttpStatusCode.BAD_REQUEST,
      statusMessage: "Validation Error",
      data: { errorCode: GOAT_IT_API_PROXY_ERROR_CODES.INVALID_REQUEST },
    });
  }
}

/**
 * Validates the incoming JSON body against a schema and returns the parsed value.
 *
 * Validation failures become a 400 proxy error carrying `errorCode: "invalid-request"`, so the client never sees Zod details.
 *
 * @throws When the body is invalid; also rethrows unrelated request-reading failures.
 */
async function validateGoatItApiBody<Body>(event: H3Event, schema: z.ZodType<Body>): Promise<Body> {
  try {
    return await readValidatedBody(event, rawBody => schema.parse(rawBody));
  } catch(error: unknown) {
    if (!isBadRequestError(error)) {
      throw error;
    }
    throw createError({
      statusCode: HttpStatusCode.BAD_REQUEST,
      statusMessage: "Validation Error",
      data: { errorCode: GOAT_IT_API_PROXY_ERROR_CODES.INVALID_REQUEST },
    });
  }
}

export {
  parseAndMapGoatItApiResponse,
  stripUnrecognizedKeys,
  validateGoatItApiBody,
  validateGoatItApiQuery,
};