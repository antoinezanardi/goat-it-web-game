import type { ToMock } from "~~/tests/unit/utils/types/mock.types";

import type { QuestionsRepository } from "~/repositories/goat-it-api/questions/questions.repository";

type QuestionsRepositoryMock = ToMock<ReturnType<QuestionsRepository>>;

export type {
  QuestionsRepositoryMock,
};