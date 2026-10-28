import {
  QUESTION_DTO,
  QUESTION_SOURCE_URLS_MAX_ITEMS,
  QUESTION_THEME_ASSIGNMENTS_MAX_ITEMS,
  QUESTION_THEME_ASSIGNMENTS_MIN_ITEMS,
  QUESTION_THEME_ASSIGNMENT_DTO,
} from "@goat-it/schemas/question";
import { z } from "zod";

import { QUESTION_THEME_SCHEMA } from "#shared/schemas/question-theme/question-theme.schemas";
import { SAFE_SOURCE_URL_SCHEMA } from "#shared/utils/helpers/question/source/question-source.constants";

function areSourceUrlsUnique(sourceUrls: readonly string[]): boolean {
  return new Set(sourceUrls).size === sourceUrls.length;
}

const QUESTION_SCHEMA = QUESTION_DTO.extend({
  themes: z.array(QUESTION_THEME_ASSIGNMENT_DTO.extend({ theme: QUESTION_THEME_SCHEMA }))
    .min(QUESTION_THEME_ASSIGNMENTS_MIN_ITEMS)
    .max(QUESTION_THEME_ASSIGNMENTS_MAX_ITEMS),
  sourceUrls: z.array(SAFE_SOURCE_URL_SCHEMA)
    .max(QUESTION_SOURCE_URLS_MAX_ITEMS)
    .refine(areSourceUrlsUnique),
  createdAt: QUESTION_DTO.shape.createdAt.transform(value => new Date(value)),
  updatedAt: QUESTION_DTO.shape.updatedAt.transform(value => new Date(value)),
});
const QUESTIONS_SCHEMA = z.array(QUESTION_SCHEMA);

export { QUESTION_SCHEMA, QUESTIONS_SCHEMA };