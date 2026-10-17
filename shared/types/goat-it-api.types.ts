import type { ValueOf } from "type-fest";

import type { GOAT_IT_API_PROXY_ERROR_CODES } from "#shared/constants/goat-it-api.constants";

type GoatItApiProxyErrorCode = ValueOf<typeof GOAT_IT_API_PROXY_ERROR_CODES>;

export type { GoatItApiProxyErrorCode };