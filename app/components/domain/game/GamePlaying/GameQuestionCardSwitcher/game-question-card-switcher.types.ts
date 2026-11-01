import type { Question } from "#shared/types/question.types";
import type { GameNavigationDirection } from "@/utils/domain/game/game-navigation.types";

type GameQuestionCardSwitcherProps = {
  currentIndex: number;
  pendingDirection?: GameNavigationDirection;
  questions: Question[];
};

type GameQuestionCardSwitcherEmits = {
  complete: [];
  staged: [];
};

export type { GameQuestionCardSwitcherEmits, GameQuestionCardSwitcherProps };