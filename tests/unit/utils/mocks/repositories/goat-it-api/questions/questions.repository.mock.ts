import { vi } from "vitest";

import type { QuestionsRepositoryMock } from "~~/tests/unit/utils/mocks/repositories/goat-it-api/questions/questions.repository.mock.types";

function createQuestionsRepositoryMock(): QuestionsRepositoryMock {
  return {
    getRandom: vi.fn<QuestionsRepositoryMock["getRandom"]>(),
  };
}

export {
  createQuestionsRepositoryMock,
};