import { FIVE_QUESTION_THEMES_FIXTURE_SET } from "#acceptance/features/support/fixtures/question-theme/sets/five-question-themes.fixture-set.ts";
import { SIXTY_QUESTION_THEMES_FIXTURE_SET } from "#acceptance/features/support/fixtures/question-theme/sets/sixty-question-themes.fixture-set.ts";
import { TWO_ENGLISH_ONLY_QUESTION_THEMES_FIXTURE_SET } from "#acceptance/features/support/fixtures/question-theme/sets/two-english-only-question-themes.fixture-set.ts";
import { FIVE_ACTIVE_QUESTIONS_FIXTURE_SET } from "#acceptance/features/support/fixtures/question/sets/five-active-questions.fixture-set.ts";
import { SIXTY_QUESTIONS_FIXTURE_SET } from "#acceptance/features/support/fixtures/question/sets/sixty-questions.fixture-set.ts";
import { TWO_ENGLISH_ONLY_QUESTIONS_FIXTURE_SET } from "#acceptance/features/support/fixtures/question/sets/two-english-only-questions.fixture-set.ts";
import type { FixtureDomain, FixtureRegistry } from "#acceptance/features/support/fixtures/fixture.types.ts";

const DOMAIN_TO_COLLECTION_MAP: Record<FixtureDomain, string> = {
  "question": "questions",
  "question-theme": "question_themes",
} as const;

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
    "five-active-questions": {
      data: FIVE_ACTIVE_QUESTIONS_FIXTURE_SET,
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
} as const;

export {
  DOMAIN_TO_COLLECTION_MAP,
  FIXTURE_REGISTRY,
};