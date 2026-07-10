import { vi, beforeEach } from "vitest";

import { createQuestionThemesRepositoryMock } from "~~/tests/unit/utils/mocks/repositories/goat-it-api/questionThemesRepository/question-themes-repository.mock";
import type { QuestionThemesRepositoryMock } from "~~/tests/unit/utils/mocks/repositories/goat-it-api/questionThemesRepository/question-themes-repository.mock";

let questionThemesRepositoryMock: QuestionThemesRepositoryMock = createQuestionThemesRepositoryMock();

vi.mock("@/repositories/goat-it-api/question-themes/question-themes.repository", () => ({
  questionThemesRepository: vi.fn<() => QuestionThemesRepositoryMock>(() => questionThemesRepositoryMock),
}));

beforeEach(() => {
  questionThemesRepositoryMock = createQuestionThemesRepositoryMock();
});