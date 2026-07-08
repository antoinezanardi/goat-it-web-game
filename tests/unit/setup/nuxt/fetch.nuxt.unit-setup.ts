import { beforeEach, vi } from "vitest";

import { createFetchMock } from "~~/tests/unit/utils/mocks/composables/nuxt/useFetch/useFetch.mock";
import type { FetchMock } from "~~/tests/unit/utils/mocks/composables/nuxt/useFetch/useFetch.mock";

let fetchMock: FetchMock = createFetchMock();

vi.stubGlobal("$fetch", fetchMock);

beforeEach(() => {
  fetchMock = createFetchMock();
  vi.stubGlobal("$fetch", fetchMock);
});