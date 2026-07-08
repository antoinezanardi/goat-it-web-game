import { beforeEach, vi } from "vitest";

import { createGetQueryMock, createGetRouterParamMock, createReadBodyMock } from "~~/tests/unit/utils/mocks/composables/nuxt/h3/h3.mock";
import type { GetQueryMock, GetRouterParamMock, ReadBodyMock } from "~~/tests/unit/utils/mocks/composables/nuxt/h3/h3.mock";

let getQueryMock: GetQueryMock = createGetQueryMock();
let getRouterParameterMock: GetRouterParamMock = createGetRouterParamMock();
let readBodyMock: ReadBodyMock = createReadBodyMock();

vi.stubGlobal("getQuery", getQueryMock);
vi.stubGlobal("getRouterParam", getRouterParameterMock);
vi.stubGlobal("readBody", readBodyMock);

beforeEach(() => {
  getQueryMock = createGetQueryMock();
  getRouterParameterMock = createGetRouterParamMock();
  readBodyMock = createReadBodyMock();
  vi.stubGlobal("getQuery", getQueryMock);
  vi.stubGlobal("getRouterParam", getRouterParameterMock);
  vi.stubGlobal("readBody", readBodyMock);
});