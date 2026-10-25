import { QUESTION_THEME_DTO } from "@goat-it/schemas/question-theme";
import { z } from "zod";

const QUESTION_THEME_SCHEMA = QUESTION_THEME_DTO.extend({
  createdAt: QUESTION_THEME_DTO.shape.createdAt.transform(value => new Date(value)),
  updatedAt: QUESTION_THEME_DTO.shape.updatedAt.transform(value => new Date(value)),
});
const QUESTION_THEMES_SCHEMA = z.array(QUESTION_THEME_SCHEMA);

export { QUESTION_THEME_SCHEMA, QUESTION_THEMES_SCHEMA };