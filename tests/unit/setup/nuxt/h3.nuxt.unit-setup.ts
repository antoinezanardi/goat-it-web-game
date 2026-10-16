import { beforeEach, vi } from "vitest";

import { createGetQueryMock, createGetRouterParamMock, createReadBodyMock, createGetValidatedQueryMock, createReadValidatedBodyMock } from "~~/tests/unit/utils/mocks/composables/nuxt/h3/h3.mock";
import type { GetQueryMock, GetRouterParamMock, ReadBodyMock, GetValidatedQueryMock, ReadValidatedBodyMock } from "~~/tests/unit/utils/mocks/composables/nuxt/h3/h3.mock";

let getQueryMock: GetQueryMock = createGetQueryMock();
let getRouterParameterMock: GetRouterParamMock = createGetRouterParamMock();
let readBodyMock: ReadBodyMock = createReadBodyMock();
let getValidatedQueryMock: GetValidatedQueryMock = createGetValidatedQueryMock(getQueryMock);
let readValidatedBodyMock: ReadValidatedBodyMock = createReadValidatedBodyMock(readBodyMock);

vi.stubGlobal("getQuery", getQueryMock);
vi.stubGlobal("getRouterParam", getRouterParameterMock);
vi.stubGlobal("readBody", readBodyMock);
vi.stubGlobal("getValidatedQuery", getValidatedQueryMock);
vi.stubGlobal("readValidatedBody", readValidatedBodyMock);

beforeEach(() => {
  getQueryMock = createGetQueryMock();
  getRouterParameterMock = createGetRouterParamMock();
  readBodyMock = createReadBodyMock();
  getValidatedQueryMock = createGetValidatedQueryMock(getQueryMock);
  readValidatedBodyMock = createReadValidatedBodyMock(readBodyMock);
  vi.stubGlobal("getQuery", getQueryMock);
  vi.stubGlobal("getRouterParam", getRouterParameterMock);
  vi.stubGlobal("readBody", readBodyMock);
  vi.stubGlobal("getValidatedQuery", getValidatedQueryMock);
  vi.stubGlobal("readValidatedBody", readValidatedBodyMock);
});