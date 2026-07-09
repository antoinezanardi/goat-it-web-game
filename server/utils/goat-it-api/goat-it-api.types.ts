import type { TupleToUnion } from "type-fest";

import type { GOAT_IT_API_RESOURCE_NAMES } from "#server/utils/goat-it-api/goat-it-api.constants";

type CreateGoatItApiEndpointOptions = {
  id?: string;
  suffix?: string;
};

type GoatItApiResourceName = TupleToUnion<typeof GOAT_IT_API_RESOURCE_NAMES>;

export type {
  CreateGoatItApiEndpointOptions,
  GoatItApiResourceName,
};