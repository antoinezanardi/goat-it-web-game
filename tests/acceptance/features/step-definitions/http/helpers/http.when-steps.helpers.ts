import { url } from "@nuxt/test-utils/e2e";
import type { APIRequestContext, APIResponse } from "@playwright/test";

import type { HttpMethod } from "#acceptance/features/support/types/http.types.ts";

type HttpRequestSender = (request: APIRequestContext, requestUrl: string) => Promise<APIResponse>;

const HTTP_REQUEST_BY_METHOD: Readonly<Record<HttpMethod, HttpRequestSender>> = {
  DELETE: async(request, requestUrl) => request.delete(requestUrl),
  GET: async(request, requestUrl) => request.get(requestUrl),
  HEAD: async(request, requestUrl) => request.head(requestUrl),
  PATCH: async(request, requestUrl) => request.patch(requestUrl),
  POST: async(request, requestUrl) => request.post(requestUrl),
  PUT: async(request, requestUrl) => request.put(requestUrl),
};

async function sendHttpRequest(request: APIRequestContext, method: HttpMethod, route: string): Promise<APIResponse> {
  return HTTP_REQUEST_BY_METHOD[method](request, url(route));
}

export { sendHttpRequest };