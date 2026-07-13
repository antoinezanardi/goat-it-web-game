import { vi, describe, it, expect, beforeEach } from "vitest";
import { ZodError } from "zod";

import { createFakeQuestionDto } from "~~/tests/unit/utils/faketories/question/question.dto.faketory";
import { createFakeH3Event } from "~~/tests/unit/utils/faketories/shared/h3/h3-event.faketory";

import { createQuestionFromQuestionDto } from "#server/utils/goat-it-api/mappers/question/question.mappers";
import { createGoatItApiEndpoint, createGoatItApiFetchOptions, handleGoatItApiError } from "#server/utils/goat-it-api/helpers/goat-it-api.helpers";
import { getRandomQuestionsHandler } from "#server/api/goat-it-api/questions/handlers/random/index.get.handler";

vi.mock(import("#server/utils/goat-it-api/helpers/goat-it-api.helpers"));

describe("Server Goat It API Questions Random Handler", () => {
  const mockedEvent = createFakeH3Event();

  beforeEach(() => {
    vi.mocked($fetch).mockResolvedValue([
      createFakeQuestionDto({ author: { role: "admin", name: "Test Admin" } }),
      createFakeQuestionDto({ author: { role: "admin", name: "Test Admin" } }),
      createFakeQuestionDto({ author: { role: "admin", name: "Test Admin" } }),
    ]);
  });

  describe(getRandomQuestionsHandler, () => {
    it("should create goat it api endpoint with random suffix when called.", async() => {
      await getRandomQuestionsHandler(mockedEvent);

      expect(createGoatItApiEndpoint).toHaveBeenCalledExactlyOnceWith("questions", { suffix: "random" });
    });

    it("should create goat it api fetch options with event when called.", async() => {
      await getRandomQuestionsHandler(mockedEvent);

      expect(createGoatItApiFetchOptions).toHaveBeenCalledExactlyOnceWith(mockedEvent);
    });

    it("should fetch random questions from goat it api with correct endpoint and fetch options when called.", async() => {
      const expectedEndpoint = "/questions/random";
      const expectedFetchOptions = {
        baseURL: "https://api.goat-it.com",
        headers: {
          "goat-it-api-key": "test-game-key",
        },
      };
      vi.mocked(createGoatItApiEndpoint).mockReturnValue(expectedEndpoint);
      vi.mocked(createGoatItApiFetchOptions).mockReturnValue(expectedFetchOptions);
      await getRandomQuestionsHandler(mockedEvent);

      expect($fetch).toHaveBeenCalledExactlyOnceWith(expectedEndpoint, expectedFetchOptions);
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