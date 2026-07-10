import { vi, describe, it, expect, beforeEach } from "vitest";
import type { $Fetch } from "nitropack";

import { createFakeQuestion } from "~~/tests/unit/utils/faketories/question/question.entity.faketory";

import { questionsRepository } from "@/repositories/goat-it-api/questions/questions.repository";

const fakeQuery = {
  "sort-by": "createdAt" as const,
  "sort-order": "asc" as const,
  "limit": 20,
  "category": "trivia" as const,
  "cognitive-difficulty": "easy" as const,
  "author-role": "game" as const,
  "theme-ids": ["507f1f77bcf86cd799439011"],
};

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

      await repository.getRandom(fakeQuery);

      expect(fetchMock).toHaveBeenCalledExactlyOnceWith("/api/goat-it-api/questions/random", { query: fakeQuery });
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