import type { z } from "zod";

type CreateGoatItApiEndpointOptions = {
  id?: string;
  suffix?: string;
};

type CreateGoatItApiFetchOptionsOverrides = {
  method?: "GET" | "POST";
};

type ProxyErrorData = {
  errorCode?: string;
  retryAfter?: string;
};

type UnrecognizedKeysIssue = z.core.$ZodIssueUnrecognizedKeys;

export type {
  CreateGoatItApiEndpointOptions,
  CreateGoatItApiFetchOptionsOverrides,
  ProxyErrorData,
  UnrecognizedKeysIssue,
};