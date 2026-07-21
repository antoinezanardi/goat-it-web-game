import { FIVE_QUESTION_THEMES_FIXTURE_SET } from "#acceptance/features/support/fixtures/question-theme/sets/five-question-themes.fixture-set.ts";
import { SIXTY_QUESTION_THEMES_FIXTURE_SET } from "#acceptance/features/support/fixtures/question-theme/sets/sixty-question-themes.fixture-set.ts";
import { TWO_ENGLISH_ONLY_QUESTION_THEMES_FIXTURE_SET } from "#acceptance/features/support/fixtures/question-theme/sets/two-english-only-question-themes.fixture-set.ts";
import { FIVE_QUESTIONS_FIXTURE_SET } from "#acceptance/features/support/fixtures/question/sets/five-questions.fixture-set.ts";
import { SIXTY_QUESTIONS_FIXTURE_SET } from "#acceptance/features/support/fixtures/question/sets/sixty-questions.fixture-set.ts";
import { TWO_ENGLISH_ONLY_QUESTIONS_FIXTURE_SET } from "#acceptance/features/support/fixtures/question/sets/two-english-only-questions.fixture-set.ts";
import type { FixtureRegistry } from "#acceptance/features/support/fixtures/fixture.types.ts";

const FIXTURE_REGISTRY: FixtureRegistry = {
  "question-theme": {
    "five-question-themes": {
      data: FIVE_QUESTION_THEMES_FIXTURE_SET,
    },
    "sixty-question-themes": {
      data: SIXTY_QUESTION_THEMES_FIXTURE_SET,
    },
    "two-english-only-question-themes": {
      data: TWO_ENGLISH_ONLY_QUESTION_THEMES_FIXTURE_SET,
    },
  },
  "question": {
    "five-questions": {
      data: FIVE_QUESTIONS_FIXTURE_SET,
      dependencies: [["question-theme", "five-question-themes"]],
    },
    "sixty-questions": {
      data: SIXTY_QUESTIONS_FIXTURE_SET,
      dependencies: [["question-theme", "sixty-question-themes"]],
    },
    "two-english-only-questions": {
      data: TWO_ENGLISH_ONLY_QUESTIONS_FIXTURE_SET,
      dependencies: [["question-theme", "two-english-only-question-themes"]],
    },
  },
};

export {
  FIXTURE_REGISTRY,
};