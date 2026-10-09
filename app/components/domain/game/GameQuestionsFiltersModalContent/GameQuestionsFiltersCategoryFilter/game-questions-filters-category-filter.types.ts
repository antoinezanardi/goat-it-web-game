import type { QuestionCategory } from "@goat-it/schemas/question";

type GameQuestionsFiltersCategoryFilterProps = {
  modelValue: QuestionCategory[];
};

type GameQuestionsFiltersCategoryFilterEmits = {
  "update:modelValue": [value: QuestionCategory[]];
};

export type { GameQuestionsFiltersCategoryFilterEmits, GameQuestionsFiltersCategoryFilterProps };