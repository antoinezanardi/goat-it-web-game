import type { GoatItApiResourceNames } from "#server/utils/goat-it-api/goat-it-api.enums";
import type { CreateGoatItApiEndpointOptions } from "#server/utils/goat-it-api/goat-it-api.types";
import { isNonEmptyString } from "#shared/utils/helpers/string/string.helpers";

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

export { createGoatItApiEndpoint };