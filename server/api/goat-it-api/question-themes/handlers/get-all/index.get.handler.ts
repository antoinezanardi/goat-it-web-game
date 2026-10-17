import { FIND_QUESTION_THEMES_QUERY_DTO, QUESTION_THEME_DTO } from "@goat-it/schemas/question-theme";
import type { H3Event } from "h3";

import type { QuestionTheme } from "#shared/types/question-theme.types";
import { createQuestionThemeFromQuestionThemeDto } from "#server/utils/goat-it-api/mappers/question-theme/question-theme.mappers";
import { clampFindQueryLimit } from "#server/utils/goat-it-api/helpers/find-query-limit.helpers";
import { createGoatItApiEndpoint, createGoatItApiFetchOptions } from "#server/utils/goat-it-api/helpers/goat-it-api.helpers";
import { parseAndMapGoatItApiResponse, validateGoatItApiQuery } from "#server/utils/goat-it-api/helpers/goat-it-api-validation.helpers";
import { throwGoatItApiError } from "#server/utils/goat-it-api/helpers/goat-it-api-error.helpers";
import { FIND_QUESTION_THEMES_QUERY_LIMIT_MAXIMUM } from "#shared/constants/goat-it-api.constants";
import { GoatItApiResourceNames } from "#server/utils/goat-it-api/goat-it-api.enums";

async function getQuestionThemesHandler(event: H3Event): Promise<QuestionTheme[]> {
  const endpoint = createGoatItApiEndpoint(GoatItApiResourceNames.QUESTION_THEMES);
  const fetchOptions = createGoatItApiFetchOptions(event, { method: "GET" });
  const parsedQuery = await validateGoatItApiQuery(event, FIND_QUESTION_THEMES_QUERY_DTO);
  const query = { ...parsedQuery, limit: clampFindQueryLimit(parsedQuery.limit, FIND_QUESTION_THEMES_QUERY_LIMIT_MAXIMUM) };

  try {
    const rawData = await $fetch(endpoint, { ...fetchOptions, query });

    return parseAndMapGoatItApiResponse(rawData, QUESTION_THEME_DTO, createQuestionThemeFromQuestionThemeDto);
  } catch(error: unknown) {
    throwGoatItApiError(error);
  }
}

export {
  getQuestionThemesHandler,
};