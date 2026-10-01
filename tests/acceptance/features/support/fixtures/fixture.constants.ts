import { FIVE_QUESTION_THEMES_FIXTURE_SET } from "#acceptance/features/support/fixtures/question-theme/sets/five-question-themes.fixture-set.ts";
import { SINGLE_QUESTION_THEMES_FIXTURE_SET } from "#acceptance/features/support/fixtures/question-theme/sets/single-question-themes.fixture-set.ts";
import { SIXTY_QUESTION_THEMES_FIXTURE_SET } from "#acceptance/features/support/fixtures/question-theme/sets/sixty-question-themes.fixture-set.ts";
import { TWO_ENGLISH_ONLY_QUESTION_THEMES_FIXTURE_SET } from "#acceptance/features/support/fixtures/question-theme/sets/two-english-only-question-themes.fixture-set.ts";
import { FIVE_ACTIVE_QUESTIONS_FIXTURE_SET } from "#acceptance/features/support/fixtures/question/sets/five-active-questions.fixture-set.ts";
import { SINGLE_ADULT_CONTENT_QUESTION_FIXTURE_SET } from "#acceptance/features/support/fixtures/question/sets/single-adult-content-question.fixture-set.ts";
import { SINGLE_MULTI_THEMES_QUESTION_FIXTURE_SET } from "#acceptance/features/support/fixtures/question/sets/single-multi-themes-question.fixture-set.ts";
import { SINGLE_NO_CONTEXT_QUESTION_FIXTURE_SET } from "#acceptance/features/support/fixtures/question/sets/single-no-context-question.fixture-set.ts";
import { SINGLE_QUESTION_FIXTURE_SET } from "#acceptance/features/support/fixtures/question/sets/single-question.fixture-set.ts";
import { SINGLE_TRANSLATABLE_QUESTION_FIXTURE_SET } from "#acceptance/features/support/fixtures/question/sets/single-translatable-question.fixture-set.ts";
import { SIXTY_QUESTIONS_FIXTURE_SET } from "#acceptance/features/support/fixtures/question/sets/sixty-questions.fixture-set.ts";
import { TWO_ENGLISH_ONLY_QUESTIONS_FIXTURE_SET } from "#acceptance/features/support/fixtures/question/sets/two-english-only-questions.fixture-set.ts";
import { GAME_SETTINGS_ADULT_CONTENT_ENABLED_COOKIE_FIXTURE_SET } from "#acceptance/features/support/fixtures/cookie/sets/game-settings-adult-content-enabled.fixture-set.ts";
import { GAME_SETTINGS_CORRUPT_COOKIE_FIXTURE_SET } from "#acceptance/features/support/fixtures/cookie/sets/game-settings-corrupt.fixture-set.ts";
import type { CookieFixtureRegistry, FixtureDomain, FixtureRegistry } from "#acceptance/features/support/fixtures/fixture.types.ts";

const DOMAIN_TO_COLLECTION_MAP: Record<FixtureDomain, string> = {
  "question": "questions",
  "question-theme": "question_themes",
} as const;

const FIXTURE_REGISTRY: FixtureRegistry = {
  "question-theme": {
    "single-question-themes": {
      data: SINGLE_QUESTION_THEMES_FIXTURE_SET,
    },
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
    "single-question": {
      data: SINGLE_QUESTION_FIXTURE_SET,
      dependencies: [["question-theme", "single-question-themes"]],
    },
    "single-translatable-question": {
      data: SINGLE_TRANSLATABLE_QUESTION_FIXTURE_SET,
      dependencies: [["question-theme", "five-question-themes"]],
    },
    "single-no-context-question": {
      data: SINGLE_NO_CONTEXT_QUESTION_FIXTURE_SET,
      dependencies: [["question-theme", "single-question-themes"]],
    },
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
    "single-multi-themes-question": {
      data: SINGLE_MULTI_THEMES_QUESTION_FIXTURE_SET,
      dependencies: [["question-theme", "five-question-themes"]],
    },
    "single-adult-content-question": {
      data: SINGLE_ADULT_CONTENT_QUESTION_FIXTURE_SET,
      dependencies: [["question-theme", "five-question-themes"]],
    },
  },
} as const;

const COOKIE_FIXTURE_REGISTRY: CookieFixtureRegistry = {
  "game-settings-adult-content-enabled": GAME_SETTINGS_ADULT_CONTENT_ENABLED_COOKIE_FIXTURE_SET,
  "game-settings-corrupt": GAME_SETTINGS_CORRUPT_COOKIE_FIXTURE_SET,
} as const;

export {
  COOKIE_FIXTURE_REGISTRY,
  DOMAIN_TO_COLLECTION_MAP,
  FIXTURE_REGISTRY,
};