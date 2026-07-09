import { FIND_QUESTION_THEMES_QUERY_DTO, QUESTION_THEME_DTO } from "@goat-it/schemas/question-theme";
import type { H3Event } from "h3";
import { z } from "zod";

import type { QuestionTheme } from "#shared/types/question-theme.types";
import { createQuestionThemeFromQuestionThemeDto } from "#server/utils/goat-it-api/mappers/question-theme/question-theme.mappers";
import { createGoatItApiEndpoint, createGoatItApiFetchOptions, handleGoatItApiError } from "#server/utils/goat-it-api/helpers/goat-it-api.helpers";
import { FIND_QUERY_UNBOUNDED_LIMIT } from "#server/utils/goat-it-api/goat-it-api.constants";

async function getQuestionThemesHandler(event: H3Event): Promise<QuestionTheme[]> {
  const config = useRuntimeConfig(event);
  const endpoint = createGoatItApiEndpoint("question-themes");
  const fetchOptions = createGoatItApiFetchOptions(config.goatItApi);
  const rawQuery = getQuery(event);
  const query = FIND_QUESTION_THEMES_QUERY_DTO.parse({
    ...rawQuery,
    limit: FIND_QUERY_UNBOUNDED_LIMIT,
  });

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