import type { AsyncResult } from "#shared/types/async-result.types";
import type { Question } from "#shared/types/question.types";

/**
 * Page state of the game route, resolved in this precedence order:
 * `error`, `no-matching-filters-questions`, `loading`, `game-over`, then `playing`.
 *
 * - `loading`: no question is playable yet and no terminal flag is set.
 * - `playing`: a playable question is displayed.
 * - `game-over`: the buffer is exhausted on the last question.
 * - `error`: the last batch failed and no playable question remains.
 * - `no-matching-filters-questions`: the last batch came back empty because narrowing filters match no question.
 */
type GamePageState = "loading" | "playing" | "game-over" | "error" | "no-matching-filters-questions";

/**
 * Public contract of the game page orchestrator returned by `useGame`.
 */
type UseGame = {
  /** False on the first question. */
  canGoToPreviousQuestion: ComputedRef<boolean>;
  /** Position of the displayed question inside `questions`. */
  currentIndex: Ref<number>;
  /** Question at `currentIndex`, `undefined` once it points past the buffer. */
  currentQuestion: ComputedRef<Question | undefined>;
  /** True while either the feed or the translation fetch is in flight. */
  isFetchingQuestions: ComputedRef<boolean>;
  /** True while the locale-change translation fetch is in flight. */
  isTranslating: ComputedRef<boolean>;
  /** Store-owned buffer; change it through feed and store actions only. */
  questions: Ref<Question[]>;
  /** Delegates to `useGameSettingsSync`; restarts the feed only when the fetch filters changed. */
  syncQuestionsWithGameSettings: () => Promise<AsyncResult<void>>;
  /** No-op at game over. */
  advanceToNextQuestion: () => void;
  /** No-op at index 0. */
  goToPreviousQuestion: () => void;
  /** Marks the current filters applied and starts the first fetch. */
  initialize: () => Promise<void>;
  /** Backs the reset action of the no-matching-filters screen. */
  resetFilters: () => Promise<void>;
  /** Delegates to the feed retry after a failed batch. */
  retryQuestionFetch: () => Promise<void>;
  /** Derived from the feed flags, the pending state, and the current index. */
  gameState: ComputedRef<GamePageState>;
};

export type { GamePageState, UseGame };