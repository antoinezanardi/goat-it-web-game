import { mockNuxtImport } from "@nuxt/test-utils/runtime";
import { beforeEach } from "vitest";

import { createUseGameMock } from "~~/tests/unit/utils/mocks/composables/domain/useGame/useGame.mock";
import type { MockHolder } from "~~/tests/unit/utils/types/mock.types";
import type { UseGameMock } from "~~/tests/unit/utils/mocks/composables/domain/useGame/useGame.mock";

const useGameMock: MockHolder<UseGameMock> = { instance: createUseGameMock() };

// Acceptable as mock factory return type is inferred from createUseGameMock
// oxlint-disable-next-line typescript/explicit-function-return-type
mockNuxtImport("useGame", () => () => useGameMock.instance);

beforeEach(() => {
  useGameMock.instance = createUseGameMock();
});

export { useGameMock };