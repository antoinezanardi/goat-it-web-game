import { vi, beforeEach } from "vitest";

import { createQuestionsRepositoryMock } from "~~/tests/unit/utils/mocks/repositories/goat-it-api/questions/questions.repository.mock";
import type { QuestionsRepositoryMock } from "~~/tests/unit/utils/mocks/repositories/goat-it-api/questions/questions.repository.mock.types";

let questionsRepositoryMock: QuestionsRepositoryMock = createQuestionsRepositoryMock();

vi.mock("@/repositories/goat-it-api/questions/questions.repository", () => ({
  questionsRepository: vi.fn<() => QuestionsRepositoryMock>(() => questionsRepositoryMock),
}));

beforeEach(() => {
  questionsRepositoryMock = createQuestionsRepositoryMock();
});