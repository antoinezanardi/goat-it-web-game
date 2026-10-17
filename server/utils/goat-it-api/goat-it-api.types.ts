type CreateGoatItApiEndpointOptions = {
  id?: string;
  suffix?: string;
};

type CreateGoatItApiFetchOptionsOverrides = {
  method?: "GET" | "POST";
};

export type {
  CreateGoatItApiEndpointOptions,
  CreateGoatItApiFetchOptionsOverrides,
};