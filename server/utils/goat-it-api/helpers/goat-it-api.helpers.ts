import { getCookie, getValidatedQuery, readValidatedBody } from "h3";
import { z } from "zod";
import type { Locale } from "@goat-it/schemas/shared/locale";
import type { H3Event } from "h3";

import { GOAT_IT_API_REQUEST_RETRY_COUNT, GOAT_IT_API_REQUEST_RETRY_DELAY_IN_MS, GOAT_IT_API_REQUEST_TIMEOUT_IN_MS } from "#server/utils/goat-it-api/goat-it-api.constants";
import { getRuntimeConfig } from "#server/utils/runtime-config/helpers/runtime-config.helpers";
import type { GoatItApiResourceNames } from "#server/utils/goat-it-api/goat-it-api.enums";
import { GoatItApiHeaderNames } from "#server/utils/goat-it-api/goat-it-api.enums";
import type { CreateGoatItApiEndpointOptions, CreateGoatItApiFetchOptionsOptions } from "#server/utils/goat-it-api/goat-it-api.types";
import { HttpStatusCode } from "#server/utils/http/http.enums";
import { CookieNames } from "#shared/enums/cookie.enums";
import { isNonEmptyString } from "#shared/utils/helpers/string/string.helpers";
import { isRecord } from "#shared/utils/helpers/object/object.helpers";
import { resolveCookieLocale } from "#shared/utils/helpers/locale/locale.helpers";

function encodePathSegment(segment: string): string {
  return segment.split("/").map(part => encodeURIComponent(part)).join("/");
}

function createGoatItApiEndpoint(resourceName: GoatItApiResourceNames, options?: CreateGoatItApiEndpointOptions): string {
  let endpoint = `/${resourceName}`;

  if (isNonEmptyString(options?.id)) {
    endpoint += `/${encodePathSegment(options.id)}`;
  } else if (isNonEmptyString(options?.suffix)) {
    endpoint += `/${encodePathSegment(options.suffix)}`;
  }
  return endpoint;
}

function extractLocaleFromEvent(event: H3Event, defaultLocale: Locale): Locale {
  return resolveCookieLocale(getCookie(event, CookieNames.I18N_REDIRECTED), defaultLocale);
}

function createGoatItApiAbortSignal(event: H3Event): AbortSignal {
  const disconnectController = new AbortController();

  event.node.res.on("close", () => {
    if (!event.node.res.writableEnded) {
      disconnectController.abort();
    }
  });

  return AbortSignal.any([disconnectController.signal, AbortSignal.timeout(GOAT_IT_API_REQUEST_TIMEOUT_IN_MS)]);
}

function createGoatItApiFetchOptions(event: H3Event, options?: CreateGoatItApiFetchOptionsOptions): Parameters<typeof $fetch>[1] {
  const config = getRuntimeConfig(event);
  const method = options?.method ?? "GET";

  return {
    baseURL: config.goatItApi.baseUrl,
    headers: {
      [GoatItApiHeaderNames.API_KEY]: config.goatItApi.gameKey,
      [GoatItApiHeaderNames.ACCEPT_LANGUAGE]: extractLocaleFromEvent(event, config.public.defaultLocale),
    },
    redirect: "error",
    retry: method === "POST" ? 0 : GOAT_IT_API_REQUEST_RETRY_COUNT,
    retryDelay: GOAT_IT_API_REQUEST_RETRY_DELAY_IN_MS,
    signal: createGoatItApiAbortSignal(event),
  };
}

type UnrecognizedKeysIssue = z.core.$ZodIssueUnrecognizedKeys;

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
      data: { errorCode: "invalid-request" },
    });
  }
}

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
      data: { errorCode: "invalid-request" },
    });
  }
}

export {
  createGoatItApiEndpoint,
  createGoatItApiFetchOptions,
  extractLocaleFromEvent,
  parseAndMapGoatItApiResponse,
  stripUnrecognizedKeys,
  validateGoatItApiBody,
  validateGoatItApiQuery,
};