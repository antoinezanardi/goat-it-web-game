import type { ArrayValues } from "type-fest";

import type { VALID_HTTP_METHODS } from "#acceptance/features/support/constants/http.constants.ts";

type HttpMethod = ArrayValues<typeof VALID_HTTP_METHODS>;

export type { HttpMethod };