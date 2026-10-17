import { FIND_RANDOM_QUESTIONS_BODY_DTO, QUESTION_DTO } from "@goat-it/schemas/question";
import type { H3Event } from "h3";

import type { Question } from "#shared/types/question.types";
import { createQuestionFromQuestionDto } from "#server/utils/goat-it-api/mappers/question/question.mappers";
import { createGoatItApiEndpoint, createGoatItApiFetchOptions } from "#server/utils/goat-it-api/helpers/goat-it-api.helpers";
import { parseAndMapGoatItApiResponse, validateGoatItApiBody } from "#server/utils/goat-it-api/helpers/goat-it-api-validation.helpers";
import { throwGoatItApiError } from "#server/utils/goat-it-api/helpers/goat-it-api-error.helpers";
import { GOAT_IT_API_SEARCH_RANDOM_SUFFIX } from "#server/utils/goat-it-api/goat-it-api.constants";
import { GoatItApiResourceNames } from "#server/utils/goat-it-api/goat-it-api.enums";

async function getRandomQuestionsHandler(event: H3Event): Promise<Question[]> {
  const endpoint = createGoatItApiEndpoint(GoatItApiResourceNames.QUESTIONS, { suffix: GOAT_IT_API_SEARCH_RANDOM_SUFFIX });
  const fetchOptions = createGoatItApiFetchOptions(event, { method: "POST" });
  const body = await validateGoatItApiBody(event, FIND_RANDOM_QUESTIONS_BODY_DTO);

  try {
    const rawData = await $fetch(endpoint, { ...fetchOptions, method: "POST", body });

    return parseAndMapGoatItApiResponse(rawData, QUESTION_DTO, createQuestionFromQuestionDto);
  } catch(error: unknown) {
    throwGoatItApiError(error);
  }
}

export {
  getRandomQuestionsHandler,
};