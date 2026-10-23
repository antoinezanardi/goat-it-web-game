import { vi } from "vitest";

import type { ToMock } from "~~/tests/unit/utils/types/mock.types";

import type { QuestionsRepository } from "@/repositories/goat-it-api/questions/questions.repository";

type QuestionsRepositoryMock = ToMock<ReturnType<QuestionsRepository>>;

/**
 * Creates a mock implementation of the `questionsRepository` for unit testing purposes.
 * Can only be used from unit tests setup functions.
 */
function createQuestionsRepositoryMock(): QuestionsRepositoryMock {
  return {
    getByIds: vi.fn<QuestionsRepositoryMock["getByIds"]>(),
    getRandom: vi.fn<QuestionsRepositoryMock["getRandom"]>(),
  };
}

export type { QuestionsRepositoryMock };

export { createQuestionsRepositoryMock };