import { vi, describe, it, expect, beforeEach } from "vitest";
import type { $Fetch } from "nitropack";
import { createFakeFindRandomQuestionsBodyDto } from "@goat-it/schemas/testing/question";

import { createFakeQuestion } from "~~/tests/unit/utils/faketories/question/question.entity.faketory";

import { questionsRepository } from "@/repositories/goat-it-api/questions/questions.repository";
import type { GoatItApiRequestOptions } from "@/repositories/goat-it-api/goat-it-api.types";

describe(questionsRepository, () => {
  let fetchMock: ReturnType<typeof vi.fn<$Fetch>>;

  beforeEach(() => {
    fetchMock = vi.fn<$Fetch>();
  });

  it("should return the repository object when called.", () => {
    const repository = questionsRepository(fetchMock as $Fetch);

    expect(repository).toStrictEqual({
      getByIds: expect.any(Function) as () => Promise<Question[]>,
      getRandom: expect.any(Function) as () => Promise<Question[]>,
    });
  });

  describe("getByIds", () => {
    it("should call fetch with the correct endpoint and query when called with ids.", async() => {
      const repository = questionsRepository(fetchMock as $Fetch);
      fetchMock.mockResolvedValue([]);
      const ids = ["507f1f77bcf86cd799439011", "507f1f77bcf86cd799439012"];

      await repository.getByIds(ids);

      expect(fetchMock).toHaveBeenCalledExactlyOnceWith("/api/goat-it-api/questions", { query: { ids, limit: 100 } });
    });

    it("should return questions from fetch when called.", async() => {
      const fakeQuestions: Question[] = [
        createFakeQuestion(),
        createFakeQuestion(),
      ];
      const repository = questionsRepository(fetchMock as $Fetch);
      fetchMock.mockResolvedValue(fakeQuestions);

      const result = await repository.getByIds(["507f1f77bcf86cd799439011"]);

      expect(result).toStrictEqual(fakeQuestions);
    });

    it("should forward the request options signal to fetch when called with options.", async() => {
      const repository = questionsRepository(fetchMock as $Fetch);
      fetchMock.mockResolvedValue([]);
      const ids = ["507f1f77bcf86cd799439011"];
      const options: GoatItApiRequestOptions = { signal: new AbortController().signal };

      await repository.getByIds(ids, options);

      expect(fetchMock).toHaveBeenCalledExactlyOnceWith("/api/goat-it-api/questions", { ...options, query: { ids, limit: 100 } });
    });

    it("should not pass a signal to fetch when called without options.", async() => {
      const repository = questionsRepository(fetchMock as $Fetch);
      fetchMock.mockResolvedValue([]);

      await repository.getByIds(["507f1f77bcf86cd799439011"]);

      expect(fetchMock.mock.calls[0]?.[1]).not.toHaveProperty("signal");
    });
  });

  describe("getRandom", () => {
    it("should call fetch with the correct endpoint and undefined body when called without params.", async() => {
      const repository = questionsRepository(fetchMock as $Fetch);
      fetchMock.mockResolvedValue([]);

      await repository.getRandom();

      expect(fetchMock).toHaveBeenCalledExactlyOnceWith("/api/goat-it-api/questions/search/random", { method: "POST", body: undefined });
    });

    it("should call fetch with the correct endpoint and body when called with body params.", async() => {
      const repository = questionsRepository(fetchMock as $Fetch);
      fetchMock.mockResolvedValue([]);
      const body = createFakeFindRandomQuestionsBodyDto({
        limit: 20,
      });

      await repository.getRandom(body);

      expect(fetchMock).toHaveBeenCalledExactlyOnceWith("/api/goat-it-api/questions/search/random", { method: "POST", body });
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

    it("should forward the request options signal to fetch when called with options.", async() => {
      const repository = questionsRepository(fetchMock as $Fetch);
      fetchMock.mockResolvedValue([]);
      const body = createFakeFindRandomQuestionsBodyDto({ limit: 20 });
      const options: GoatItApiRequestOptions = { signal: new AbortController().signal };

      await repository.getRandom(body, options);

      expect(fetchMock).toHaveBeenCalledExactlyOnceWith("/api/goat-it-api/questions/search/random", { ...options, method: "POST", body });
    });

    it("should not pass a signal to fetch when called without options.", async() => {
      const repository = questionsRepository(fetchMock as $Fetch);
      fetchMock.mockResolvedValue([]);

      await repository.getRandom();

      expect(fetchMock.mock.calls[0]?.[1]).not.toHaveProperty("signal");
    });
  });
});