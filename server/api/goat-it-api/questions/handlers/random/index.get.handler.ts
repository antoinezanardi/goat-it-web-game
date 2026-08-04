import { FIND_RANDOM_QUESTIONS_QUERY_DTO, QUESTION_DTO } from "@goat-it/schemas/question";
import type { H3Event } from "h3";
import { z } from "zod";

import type { Question } from "#shared/types/question.types";
import { createQuestionFromQuestionDto } from "#server/utils/goat-it-api/mappers/question/question.mappers";
import { createGoatItApiEndpoint, createGoatItApiFetchOptions, handleGoatItApiError } from "#server/utils/goat-it-api/helpers/goat-it-api.helpers";

async function getRandomQuestionsHandler(event: H3Event): Promise<Question[]> {
  const endpoint = createGoatItApiEndpoint("questions", { suffix: "random" });
  const fetchOptions = createGoatItApiFetchOptions(event);
  const rawQuery = getQuery(event);
  const query = FIND_RANDOM_QUESTIONS_QUERY_DTO.parse(rawQuery);

  try {
    const rawData = await $fetch(endpoint, { ...fetchOptions, query });
    const questions = z.array(QUESTION_DTO).parse(rawData);

    return questions.map(createQuestionFromQuestionDto);
  } catch(error: unknown) {
    handleGoatItApiError(error);
  }
}

export {
  getRandomQuestionsHandler,
};