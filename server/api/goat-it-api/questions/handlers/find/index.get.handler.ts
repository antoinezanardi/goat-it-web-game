import { FIND_QUESTIONS_QUERY_DTO, QUESTION_DTO } from "@goat-it/schemas/question";
import type { H3Event } from "h3";

import type { Question } from "#shared/types/question.types";
import { FIND_QUESTIONS_QUERY_LIMIT_MAXIMUM } from "#shared/constants/goat-it-api.constants";
import { createQuestionFromQuestionDto } from "#server/utils/goat-it-api/mappers/question/question.mappers";
import { clampFindQueryLimit } from "#server/utils/goat-it-api/helpers/find-query-limit.helpers";
import { createGoatItApiEndpoint, createGoatItApiFetchOptions, parseAndMapGoatItApiResponse, throwGoatItApiError } from "#server/utils/goat-it-api/helpers/goat-it-api.helpers";
import { GoatItApiResourceNames } from "#server/utils/goat-it-api/goat-it-api.enums";

async function findQuestionsHandler(event: H3Event): Promise<Question[]> {
  const endpoint = createGoatItApiEndpoint(GoatItApiResourceNames.QUESTIONS);
  const fetchOptions = createGoatItApiFetchOptions(event);
  const parsedQuery = await getValidatedQuery(event, rawQuery => FIND_QUESTIONS_QUERY_DTO.parse(rawQuery));
  const query = { ...parsedQuery, limit: clampFindQueryLimit(parsedQuery.limit, FIND_QUESTIONS_QUERY_LIMIT_MAXIMUM) };

  try {
    const rawData = await $fetch(endpoint, { ...fetchOptions, method: "GET", query });

    return parseAndMapGoatItApiResponse(rawData, QUESTION_DTO, createQuestionFromQuestionDto);
  } catch(error: unknown) {
    throwGoatItApiError(error);
  }
}

export {
  findQuestionsHandler,
};