import { vi, describe, it, expect, beforeEach } from "vitest";
import { ZodError } from "zod";
import { createFakeQuestionDto } from "@goat-it/schemas/testing/question";

import { createFakeH3Event } from "~~/tests/unit/utils/faketories/shared/h3/h3-event.faketory";

import { createQuestionFromQuestionDto } from "#server/utils/goat-it-api/mappers/question/question.mappers";
import { createGoatItApiEndpoint, createGoatItApiFetchOptions, handleGoatItApiError } from "#server/utils/goat-it-api/helpers/goat-it-api.helpers";
import { findQuestionsHandler } from "#server/api/goat-it-api/questions/handlers/find/index.get.handler";

vi.mock(import("#server/utils/goat-it-api/helpers/goat-it-api.helpers"));

describe("Server Goat It API Questions Find Handler", () => {
  const mockedEvent = createFakeH3Event();
  const validMongoId = "507f1f77bcf86cd799439011";
  const anotherValidMongoId = "507f1f77bcf86cd799439012";

  beforeEach(() => {
    vi.mocked(getQuery).mockReturnValue({ ids: validMongoId, limit: 10 });
    vi.mocked($fetch).mockResolvedValue([createFakeQuestionDto({ author: { role: "admin", name: "Test Admin" } })]);
  });

  describe(findQuestionsHandler, () => {
    it("should create goat it api endpoint for questions when called.", async() => {
      await findQuestionsHandler(mockedEvent);

      expect(createGoatItApiEndpoint).toHaveBeenCalledExactlyOnceWith("questions");
    });

    it("should create goat it api fetch options with event when called.", async() => {
      await findQuestionsHandler(mockedEvent);

      expect(createGoatItApiFetchOptions).toHaveBeenCalledExactlyOnceWith(mockedEvent);
    });

    it("should read query from the event when called.", async() => {
      await findQuestionsHandler(mockedEvent);

      expect(getQuery).toHaveBeenCalledExactlyOnceWith(mockedEvent);
    });

    it("should fetch questions with the correct endpoint, fetch options and parsed query when called.", async() => {
      const expectedEndpoint = "/questions";
      const expectedFetchOptions = {
        baseURL: "https://api.goat-it.com",
        headers: {
          "goat-it-api-key": "test-game-key",
        },
      };
      vi.mocked(createGoatItApiEndpoint).mockReturnValue(expectedEndpoint);
      vi.mocked(createGoatItApiFetchOptions).mockReturnValue(expectedFetchOptions);
      vi.mocked(getQuery).mockReturnValue({ ids: [validMongoId, anotherValidMongoId], limit: 10 });

      await findQuestionsHandler(mockedEvent);

      expect($fetch).toHaveBeenCalledExactlyOnceWith(
        expectedEndpoint,
        {
          ...expectedFetchOptions,
          method: "GET",
          query: { "sort-by": "createdAt", "sort-order": "desc", "limit": 10, "ids": [validMongoId, anotherValidMongoId] },
        },
      );
    });

    it("should forward the parsed query with schema defaults when no limit is provided.", async() => {
      const expectedEndpoint = "/questions";
      const expectedFetchOptions = {
        baseURL: "https://api.goat-it.com",
        headers: {
          "goat-it-api-key": "test-game-key",
        },
      };
      vi.mocked(createGoatItApiEndpoint).mockReturnValue(expectedEndpoint);
      vi.mocked(createGoatItApiFetchOptions).mockReturnValue(expectedFetchOptions);
      vi.mocked(getQuery).mockReturnValue({ ids: validMongoId });

      await findQuestionsHandler(mockedEvent);

      expect($fetch).toHaveBeenCalledExactlyOnceWith(
        expectedEndpoint,
        {
          ...expectedFetchOptions,
          method: "GET",
          query: { "sort-by": "createdAt", "sort-order": "desc", "limit": 50, "ids": [validMongoId] },
        },
      );
    });

    it("should return mapped questions when called.", async() => {
      const fakeQuestions = [
        createFakeQuestionDto({ author: { role: "admin", name: "Test Admin" } }),
        createFakeQuestionDto({ author: { role: "admin", name: "Test Admin" } }),
      ];
      vi.mocked($fetch).mockResolvedValue(fakeQuestions);
      const expectedQuestions = fakeQuestions.map(createQuestionFromQuestionDto);

      const result = await findQuestionsHandler(mockedEvent);

      expect(result).toStrictEqual(expectedQuestions);
    });

    it("should throw a ZodError when ids are empty.", async() => {
      vi.mocked(getQuery).mockReturnValue({ ids: [] });

      await expect(findQuestionsHandler(mockedEvent)).rejects.toThrow(ZodError);
    });

    it("should throw ZodError when an id is invalid.", async() => {
      vi.mocked(getQuery).mockReturnValue({ ids: ["not-a-valid-id"] });

      await expect(findQuestionsHandler(mockedEvent)).rejects.toThrow(ZodError);
    });

    it("should throw ZodError when ids contain duplicates.", async() => {
      vi.mocked(getQuery).mockReturnValue({ ids: [validMongoId, validMongoId] });

      await expect(findQuestionsHandler(mockedEvent)).rejects.toThrow(ZodError);
    });

    it("should throw ZodError when more than 100 ids are provided.", async() => {
      vi.mocked(getQuery).mockReturnValue({ ids: Array.from({ length: 101 }, () => validMongoId) });

      await expect(findQuestionsHandler(mockedEvent)).rejects.toThrow(ZodError);
    });

    it("should call handleGoatItApiError when $fetch throws an error.", async() => {
      const fetchError = new Error("Network error");
      vi.mocked($fetch).mockRejectedValue(fetchError);

      try {
        await findQuestionsHandler(mockedEvent);
      } catch(error: unknown) {
        void error;
      }

      expect(handleGoatItApiError).toHaveBeenCalledExactlyOnceWith(fetchError);
    });

    it("should call handleGoatItApiError with zod error when the fetched data is invalid.", async() => {
      vi.mocked($fetch).mockResolvedValue([
        {
          id: "invalid-id",
          name: "Invalid Question",
        },
      ]);

      try {
        await findQuestionsHandler(mockedEvent);
      } catch(error: unknown) {
        void error;
      }

      expect(handleGoatItApiError).toHaveBeenCalledExactlyOnceWith(expect.any(ZodError));
    });
  });
});