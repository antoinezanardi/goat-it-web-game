import { QUESTION_THEME_DTO } from "@goat-it/schemas/question-theme";
import { z } from "zod";

const QUESTION_THEME_SCHEMA = QUESTION_THEME_DTO.extend({
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
});
const QUESTION_THEMES_SCHEMA = z.array(QUESTION_THEME_SCHEMA);

export { QUESTION_THEME_SCHEMA, QUESTION_THEMES_SCHEMA };