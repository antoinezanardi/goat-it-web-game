import type { ValueOf } from "type-fest";

import type { GOAT_IT_API_PROXY_ERROR_CODES } from "#shared/constants/goat-it-api.constants";

/**
 * Machine-readable error code returned by the proxy, derived from the shared error-code map.
 */
type GoatItApiProxyErrorCode = ValueOf<typeof GOAT_IT_API_PROXY_ERROR_CODES>;

export type { GoatItApiProxyErrorCode };