import { FIND_RANDOM_QUESTIONS_BODY_EXCLUDED_IDS_MAXIMUM } from "@goat-it/schemas/question";
import { describe, expect, it } from "vitest";

import { createFakeQuestion } from "~~/tests/unit/utils/faketories/question/question.entity.faketory";

import { buildExcludedQuestionIds } from "@/composables/domain/useGameQuestionFeed/helpers/game-excluded-ids/game-excluded-ids.helpers";
import { GAME_EXCLUDED_IDS_MAXIMUM } from "@/composables/domain/useGameQuestionFeed/use-game-question-feed.constants";

describe(buildExcludedQuestionIds, () => {
  it("should return an empty array when there are no questions.", () => {
    const excludedIds = buildExcludedQuestionIds([], GAME_EXCLUDED_IDS_MAXIMUM);

    expect(excludedIds).toStrictEqual([]);
  });

  it("should return the most recent question ids first when called.", () => {
    const questions = [
      createFakeQuestion({ id: "first" }),
      createFakeQuestion({ id: "second" }),
      createFakeQuestion({ id: "third" }),
    ];

    const excludedIds = buildExcludedQuestionIds(questions, GAME_EXCLUDED_IDS_MAXIMUM);

    expect(excludedIds).toStrictEqual(["third", "second", "first"]);
  });

  it("should cap the excluded ids to the maximum when more than the maximum questions are provided.", () => {
    const questions = Array.from({ length: GAME_EXCLUDED_IDS_MAXIMUM + 5 }, (_unused, index) => createFakeQuestion({ id: `question-${index}` }));

    const excludedIds = buildExcludedQuestionIds(questions, GAME_EXCLUDED_IDS_MAXIMUM);

    expect(excludedIds).toStrictEqual(questions.slice(-GAME_EXCLUDED_IDS_MAXIMUM).toReversed().map(question => question.id));
  });

  it("should keep the most recent unique ids when the questions contain duplicates.", () => {
    const questions = [
      createFakeQuestion({ id: "first" }),
      createFakeQuestion({ id: "second" }),
      createFakeQuestion({ id: "first" }),
    ];

    const excludedIds = buildExcludedQuestionIds(questions, GAME_EXCLUDED_IDS_MAXIMUM);

    expect(excludedIds).toStrictEqual(["first", "second"]);
  });

  it("should keep the excluded ids maximum within the upstream schema maximum when compared.", () => {
    expect(GAME_EXCLUDED_IDS_MAXIMUM).toBeLessThanOrEqual(FIND_RANDOM_QUESTIONS_BODY_EXCLUDED_IDS_MAXIMUM);
  });
});