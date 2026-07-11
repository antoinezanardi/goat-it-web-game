import { vi, describe, it, expect, beforeEach } from "vitest";
import type { $Fetch } from "nitropack";

import { createFakeFindQuestionsQueryDto } from "~~/tests/unit/utils/faketories/question/find-questions-query.dto.faketory";
import { createFakeQuestion } from "~~/tests/unit/utils/faketories/question/question.entity.faketory";

import { questionsRepository } from "@/repositories/goat-it-api/questions/questions.repository";

describe(questionsRepository, () => {
  let fetchMock: ReturnType<typeof vi.fn<$Fetch>>;

  beforeEach(() => {
    fetchMock = vi.fn<$Fetch>();
  });

  it("should return the repository object when called.", () => {
    const repository = questionsRepository(fetchMock as $Fetch);

    expect(repository).toStrictEqual({
      getRandom: expect.any(Function) as () => Promise<Question[]>,
    });
  });

  describe("getRandom", () => {
    it("should call fetch with the correct endpoint and undefined query when called without params.", async() => {
      const repository = questionsRepository(fetchMock as $Fetch);
      fetchMock.mockResolvedValue([]);

      await repository.getRandom();

      expect(fetchMock).toHaveBeenCalledExactlyOnceWith("/api/goat-it-api/questions/random", { query: undefined });
    });

    it("should call fetch with the correct endpoint and query when called with query params.", async() => {
      const repository = questionsRepository(fetchMock as $Fetch);
      fetchMock.mockResolvedValue([]);
      const query = createFakeFindQuestionsQueryDto({
        "sort-by": "createdAt",
        "sort-order": "asc",
        "limit": 20,
      });

      await repository.getRandom(query);

      expect(fetchMock).toHaveBeenCalledExactlyOnceWith("/api/goat-it-api/questions/random", { query });
    });

    it("should return questions from fetch when called.", async() => {
      const fakeQuestions: Question[] = [
        createFakeQuestion(),
        createFakeQuestion(),
      ];
      const repository = questionsRepository(fetchMock as $Fetch);
      fetchMock.mockResolvedValue(fakeQuestions);

      const result = await repository.getRandom();

      expect(result).toStrictEqual(fakeQuestions);
    });
  });
});