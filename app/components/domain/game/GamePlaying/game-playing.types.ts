import type { Question } from "#shared/types/question.types";

type GamePlayingProps = {
  canGoBack: boolean;
  question: Question;
};

type GamePlayingEmits = {
  next: [];
  previous: [];
};

export type { GamePlayingEmits, GamePlayingProps };