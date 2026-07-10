import type { FindQuestionThemesQueryDto } from "@goat-it/schemas/question-theme";
import type { $Fetch } from "nitropack";

type QuestionThemesRepository = (fetch: $Fetch) => {
  getAll: (query?: FindQuestionThemesQueryDto) => Promise<QuestionTheme[]>;
};

export const questionThemesRepository: QuestionThemesRepository = (fetch: $Fetch) => ({
  async getAll(query?: FindQuestionThemesQueryDto): Promise<QuestionTheme[]> {
    return fetch<QuestionTheme[]>("/api/goat-it-api/question-themes", { query });
  },
});

export type {
  QuestionThemesRepository,
};