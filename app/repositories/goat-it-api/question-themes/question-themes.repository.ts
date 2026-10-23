import type { FindQuestionThemesQueryDto } from "@goat-it/schemas/question-theme";
import type { $Fetch } from "nitropack";

import { GOAT_IT_API_PROXY_PATH_PREFIX } from "#shared/constants/goat-it-api.constants";
import type { GoatItApiRequestOptions } from "@/repositories/goat-it-api/goat-it-api.types";

type QuestionThemesRepository = (fetch: $Fetch) => {
  getAll: (query?: FindQuestionThemesQueryDto, options?: GoatItApiRequestOptions) => Promise<QuestionTheme[]>;
};

export const questionThemesRepository: QuestionThemesRepository = (fetch: $Fetch) => ({
  async getAll(query?: FindQuestionThemesQueryDto, options?: GoatItApiRequestOptions): Promise<QuestionTheme[]> {
    return fetch<QuestionTheme[]>(`${GOAT_IT_API_PROXY_PATH_PREFIX}question-themes`, { ...options, query });
  },
});

export type {
  QuestionThemesRepository,
};