import { vi } from "vitest";
import type { Mock } from "vitest";
import { ref } from "vue";
import type { Ref } from "vue";

type UseAsyncDataMockOptions = {
  watch?: unknown[];
  default?: () => unknown;
};

type UseAsyncDataMockResult = {
  data: Ref<unknown>;
  status: Ref<string>;
};

type UseAsyncDataMockSignature = (
  key: unknown,
  fetcher: (...arguments_: unknown[]) => unknown,
  options?: UseAsyncDataMockOptions,
) => UseAsyncDataMockResult;

type UseAsyncDataMock = Mock<UseAsyncDataMockSignature>;

function createUseAsyncDataMock(): UseAsyncDataMock {
  return vi.fn<UseAsyncDataMockSignature>().mockReturnValue({
    data: ref<unknown>(undefined),
    status: ref("success"),
  });
}

export type {
  UseAsyncDataMock,
  UseAsyncDataMockOptions,
  UseAsyncDataMockResult,
  UseAsyncDataMockSignature,
};

export { createUseAsyncDataMock };