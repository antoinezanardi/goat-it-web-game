import { FIND_QUESTIONS_QUERY_DTO, QUESTION_DTO } from "@goat-it/schemas/question";
import type { H3Event } from "h3";
import { z } from "zod";

import type { Question } from "#shared/types/question.types";
import { createQuestionFromQuestionDto } from "#server/utils/goat-it-api/mappers/question/question.mappers";
import { createGoatItApiEndpoint, createGoatItApiFetchOptions, handleGoatItApiError } from "#server/utils/goat-it-api/helpers/goat-it-api.helpers";
import { HttpStatusCode } from "#server/utils/http/http.enums";

async function getQuestionsByIdsHandler(event: H3Event): Promise<Question[]> {
  const endpoint = createGoatItApiEndpoint("questions");
  const fetchOptions = createGoatItApiFetchOptions(event);
  const rawQuery = getQuery(event);
  const parsedQuery = FIND_QUESTIONS_QUERY_DTO.parse(rawQuery);

  if (!parsedQuery.ids || parsedQuery.ids.length === 0) {
    throw createError({
      statusCode: HttpStatusCode.BAD_REQUEST,
      statusMessage: "At least one question ID is required",
    });
  }

  try {
    const rawData = await $fetch(endpoint, { ...fetchOptions, method: "GET", query: { ...parsedQuery, limit: 0 } });
    const questions = z.array(QUESTION_DTO).parse(rawData);

    return questions.map(createQuestionFromQuestionDto);
  } catch(error: unknown) {
    handleGoatItApiError(error);
  }
}

export {
  getQuestionsByIdsHandler,
};