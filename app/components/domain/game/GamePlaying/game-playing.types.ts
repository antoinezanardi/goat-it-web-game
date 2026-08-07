import type { Question } from "#shared/types/question.types";

type GamePlayingProps = {
  question: Question;
};

type GamePlayingEmits = {
  next: [];
};

export type { GamePlayingEmits, GamePlayingProps };