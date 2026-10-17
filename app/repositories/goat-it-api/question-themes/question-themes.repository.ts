import type { FindQuestionThemesQueryDto } from "@goat-it/schemas/question-theme";
import type { $Fetch } from "nitropack";

import { GOAT_IT_API_CLIENT_REQUEST_TIMEOUT_IN_MS } from "#shared/constants/goat-it-api.constants";

type QuestionThemesRepository = (fetch: $Fetch) => {
  getAll: (query?: FindQuestionThemesQueryDto) => Promise<QuestionTheme[]>;
};

export const questionThemesRepository: QuestionThemesRepository = (fetch: $Fetch) => ({
  async getAll(query?: FindQuestionThemesQueryDto): Promise<QuestionTheme[]> {
    return fetch<QuestionTheme[]>("/api/goat-it-api/question-themes", { query, timeout: GOAT_IT_API_CLIENT_REQUEST_TIMEOUT_IN_MS });
  },
});

export type {
  QuestionThemesRepository,
};