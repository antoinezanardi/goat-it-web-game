import { FIND_QUESTION_THEMES_QUERY_DTO, QUESTION_THEME_DTO } from "@goat-it/schemas/question-theme";
import type { H3Event } from "h3";
import { z } from "zod";

import type { QuestionTheme } from "#shared/types/question-theme.types";
import { createQuestionThemeFromQuestionThemeDto } from "#server/utils/goat-it-api/mappers/question-theme/question-theme.mappers";
import { clampFindQueryLimit } from "#server/utils/goat-it-api/helpers/find-query-limit.helpers";
import { createGoatItApiEndpoint, createGoatItApiFetchOptions, handleGoatItApiError } from "#server/utils/goat-it-api/helpers/goat-it-api.helpers";
import { FIND_QUESTION_THEMES_QUERY_LIMIT_MAXIMUM } from "#shared/constants/goat-it-api.constants";

async function getQuestionThemesHandler(event: H3Event): Promise<QuestionTheme[]> {
  const endpoint = createGoatItApiEndpoint("question-themes");
  const fetchOptions = createGoatItApiFetchOptions(event);
  const parsedQuery = await getValidatedQuery(event, rawQuery => FIND_QUESTION_THEMES_QUERY_DTO.parse(rawQuery));
  const query = { ...parsedQuery, limit: clampFindQueryLimit(parsedQuery.limit, FIND_QUESTION_THEMES_QUERY_LIMIT_MAXIMUM) };

  try {
    const rawData = await $fetch(endpoint, { ...fetchOptions, query });
    const questionThemes = z.array(QUESTION_THEME_DTO).parse(rawData);

    return questionThemes.map(createQuestionThemeFromQuestionThemeDto);
  } catch(error: unknown) {
    handleGoatItApiError(error);
  }
}

export {
  getQuestionThemesHandler,
};