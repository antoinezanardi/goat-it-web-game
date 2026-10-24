import { vi, describe, it, expect, beforeEach } from "vitest";
import { ZodError } from "zod";
import { FIND_RANDOM_QUESTIONS_BODY_DTO, FIND_RANDOM_QUESTIONS_BODY_LIMIT_DEFAULT, QUESTION_DTO } from "@goat-it/schemas/question";
import { createFakeFindRandomQuestionsBodyDto, createFakeQuestionDto } from "@goat-it/schemas/testing/question";

import { createFakeH3Event } from "~~/tests/unit/utils/faketories/shared/h3/h3-event.faketory";
import { createFakeQuestion } from "~~/tests/unit/utils/faketories/question/question.entity.faketory";

import { createQuestionFromQuestionDto } from "#server/utils/goat-it-api/mappers/question/question.mappers";
import { createGoatItApiEndpoint } from "#server/utils/goat-it-api/helpers/goat-it-api-endpoint/goat-it-api-endpoint.helpers";
import { createGoatItApiFetchOptions } from "#server/utils/goat-it-api/helpers/goat-it-api-fetch-options/goat-it-api-fetch-options.helpers";
import { parseAndMapGoatItApiResponse, validateGoatItApiBody } from "#server/utils/goat-it-api/helpers/goat-it-api-validation/goat-it-api-validation.helpers";
import { throwGoatItApiError } from "#server/utils/goat-it-api/helpers/goat-it-api-error/goat-it-api-error.helpers";
import { HttpStatusCode } from "#server/utils/http/http.enums";
import { getRandomQuestionsHandler } from "#server/api/goat-it-api/questions/handlers/search/random/index.post.handler";

vi.mock(import("#server/utils/goat-it-api/helpers/goat-it-api-endpoint/goat-it-api-endpoint.helpers"));
vi.mock(import("#server/utils/goat-it-api/helpers/goat-it-api-fetch-options/goat-it-api-fetch-options.helpers"));
vi.mock(import("#server/utils/goat-it-api/helpers/goat-it-api-validation/goat-it-api-validation.helpers"));
vi.mock(import("#server/utils/goat-it-api/helpers/goat-it-api-error/goat-it-api-error.helpers"));

describe("Server Goat It API Questions Search Random Post Handler", () => {
  const mockedEvent = createFakeH3Event();

  beforeEach(() => {
    vi.mocked(validateGoatItApiBody).mockResolvedValue({ limit: FIND_RANDOM_QUESTIONS_BODY_LIMIT_DEFAULT });
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

    it("should create goat it api fetch options with the post method when called.", async() => {
      await getRandomQuestionsHandler(mockedEvent);

      expect(createGoatItApiFetchOptions).toHaveBeenCalledExactlyOnceWith(mockedEvent, { method: "POST" });
    });

    it("should validate the body through the goat it api body validator when called.", async() => {
      await getRandomQuestionsHandler(mockedEvent);

      expect(validateGoatItApiBody).toHaveBeenCalledExactlyOnceWith(mockedEvent, FIND_RANDOM_QUESTIONS_BODY_DTO);
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
      vi.mocked(validateGoatItApiBody).mockResolvedValue(expectedBody);

      await getRandomQuestionsHandler(mockedEvent);

      expect($fetch).toHaveBeenCalledExactlyOnceWith(expectedEndpoint, { ...expectedFetchOptions, method: "POST", body: expectedBody });
    });

    it("should parse and map the fetched data with the question dto and mapper when called.", async() => {
      const rawData = [createFakeQuestionDto()];
      vi.mocked($fetch).mockResolvedValue(rawData);

      await getRandomQuestionsHandler(mockedEvent);

      expect(parseAndMapGoatItApiResponse).toHaveBeenCalledExactlyOnceWith(rawData, QUESTION_DTO, createQuestionFromQuestionDto);
    });

    it("should return the parsed and mapped questions when called.", async() => {
      const expectedQuestions = [
        createFakeQuestion(),
        createFakeQuestion(),
      ];
      vi.mocked(parseAndMapGoatItApiResponse).mockReturnValue(expectedQuestions);

      const result = await getRandomQuestionsHandler(mockedEvent);

      expect(result).toStrictEqual(expectedQuestions);
    });

    it("should reject with a bad request error when the body validator rejects the body.", async() => {
      vi.mocked(validateGoatItApiBody).mockRejectedValue(Object.assign(new Error("Validation Error"), { statusCode: HttpStatusCode.BAD_REQUEST }));

      await expect(getRandomQuestionsHandler(mockedEvent)).rejects.toMatchObject({ statusCode: HttpStatusCode.BAD_REQUEST });
    });

    it("should call throwGoatItApiError when $fetch throws an error.", async() => {
      const fetchError = new Error("Network error");
      vi.mocked($fetch).mockRejectedValue(fetchError);

      try {
        await getRandomQuestionsHandler(mockedEvent);
      } catch(error: unknown) {
        void error;
      }

      expect(throwGoatItApiError).toHaveBeenCalledExactlyOnceWith(fetchError);
    });

    it("should call throwGoatItApiError with the zod error when parsing the fetched data fails.", async() => {
      const zodError = new ZodError([]);
      vi.mocked(parseAndMapGoatItApiResponse).mockImplementation(() => {
        throw zodError;
      });

      try {
        await getRandomQuestionsHandler(mockedEvent);
      } catch(error: unknown) {
        void error;
      }

      expect(throwGoatItApiError).toHaveBeenCalledExactlyOnceWith(zodError);
    });
  });
});