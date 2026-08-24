import { vi, describe, it, expect, beforeEach } from "vitest";
import { ZodError } from "zod";
import { FIND_RANDOM_QUESTIONS_BODY_LIMIT_DEFAULT } from "@goat-it/schemas/question";
import { createFakeFindRandomQuestionsBodyDto, createFakeQuestionDto } from "@goat-it/schemas/testing/question";

import { createFakeH3Event } from "~~/tests/unit/utils/faketories/shared/h3/h3-event.faketory";

import { createQuestionFromQuestionDto } from "#server/utils/goat-it-api/mappers/question/question.mappers";
import { createGoatItApiEndpoint, createGoatItApiFetchOptions, handleGoatItApiError } from "#server/utils/goat-it-api/helpers/goat-it-api.helpers";
import { getRandomQuestionsHandler } from "#server/api/goat-it-api/questions/handlers/search/random/index.post.handler";

vi.mock(import("#server/utils/goat-it-api/helpers/goat-it-api.helpers"));

describe("Server Goat It API Questions Search Random Post Handler", () => {
  const mockedEvent = createFakeH3Event();

  beforeEach(() => {
    vi.mocked(readBody).mockResolvedValue({});
    vi.mocked($fetch).mockResolvedValue([
      createFakeQuestionDto({ author: { role: "admin", name: "Test Admin" } }),
      createFakeQuestionDto({ author: { role: "admin", name: "Test Admin" } }),
      createFakeQuestionDto({ author: { role: "admin", name: "Test Admin" } }),
    ]);
  });

  describe(getRandomQuestionsHandler, () => {
    it("should create goat it api endpoint with search/random suffix when called.", async() => {
      await getRandomQuestionsHandler(mockedEvent);

      expect(createGoatItApiEndpoint).toHaveBeenCalledExactlyOnceWith("questions", { suffix: "search/random" });
    });

    it("should create goat it api fetch options with event when called.", async() => {
      await getRandomQuestionsHandler(mockedEvent);

      expect(createGoatItApiFetchOptions).toHaveBeenCalledExactlyOnceWith(mockedEvent);
    });

    it("should read body from the event when called.", async() => {
      await getRandomQuestionsHandler(mockedEvent);

      expect(readBody).toHaveBeenCalledExactlyOnceWith(mockedEvent);
    });

    it("should post random questions to goat it api with correct endpoint, fetch options and body when called.", async() => {
      const expectedEndpoint = "/questions/search/random";
      const expectedFetchOptions = {
        baseURL: "https://api.goat-it.com",
        headers: {
          "goat-it-api-key": "test-game-key",
        },
      };
      vi.mocked(createGoatItApiEndpoint).mockReturnValue(expectedEndpoint);
      vi.mocked(createGoatItApiFetchOptions).mockReturnValue(expectedFetchOptions);
      await getRandomQuestionsHandler(mockedEvent);

      expect($fetch).toHaveBeenCalledExactlyOnceWith(expectedEndpoint, { ...expectedFetchOptions, method: "POST", body: { limit: FIND_RANDOM_QUESTIONS_BODY_LIMIT_DEFAULT } });
    });

    it("should post random questions with body parameters forwarded when called with excluded ids.", async() => {
      const expectedEndpoint = "/questions/search/random";
      const expectedFetchOptions = {
        baseURL: "https://api.goat-it.com",
        headers: {
          "goat-it-api-key": "test-game-key",
        },
      };
      vi.mocked(createGoatItApiEndpoint).mockReturnValue(expectedEndpoint);
      vi.mocked(createGoatItApiFetchOptions).mockReturnValue(expectedFetchOptions);
      const expectedBody = createFakeFindRandomQuestionsBodyDto({
        excludedIds: ["60af924f4f1a2563f8e8b456", "60af924f4f1a2563f8e8b457"],
      });
      vi.mocked(readBody).mockResolvedValue(expectedBody);

      await getRandomQuestionsHandler(mockedEvent);

      expect($fetch).toHaveBeenCalledExactlyOnceWith(expectedEndpoint, { ...expectedFetchOptions, method: "POST", body: expectedBody });
    });

    it("should return mapped questions when called.", async() => {
      const fakeQuestions = [
        createFakeQuestionDto({ author: { role: "admin", name: "Test Admin" } }),
        createFakeQuestionDto({ author: { role: "admin", name: "Test Admin" } }),
        createFakeQuestionDto({ author: { role: "admin", name: "Test Admin" } }),
      ];
      vi.mocked($fetch).mockResolvedValue(fakeQuestions);
      const expectedQuestions = fakeQuestions.map(createQuestionFromQuestionDto);
      const result = await getRandomQuestionsHandler(mockedEvent);

      expect(result).toStrictEqual(expectedQuestions);
    });

    it("should throw ZodError when body is invalid.", async() => {
      vi.mocked(readBody).mockResolvedValue({ limit: "not-a-number" });

      await expect(getRandomQuestionsHandler(mockedEvent)).rejects.toThrow(ZodError);
    });

    it("should call handleGoatItApiError when $fetch throws an error.", async() => {
      const fetchError = new Error("Network error");
      vi.mocked($fetch).mockRejectedValue(fetchError);

      try {
        await getRandomQuestionsHandler(mockedEvent);
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
        await getRandomQuestionsHandler(mockedEvent);
      } catch(error: unknown) {
        void error;
      }

      expect(handleGoatItApiError).toHaveBeenCalledExactlyOnceWith(expect.any(ZodError));
    });
  });
});