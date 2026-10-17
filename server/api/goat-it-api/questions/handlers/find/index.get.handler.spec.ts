import { vi, describe, it, expect, beforeEach } from "vitest";
import { ZodError } from "zod";
import { FIND_QUESTIONS_QUERY_DTO, QUESTION_DTO } from "@goat-it/schemas/question";
import { createFakeQuestionDto } from "@goat-it/schemas/testing/question";

import { createFakeH3Event } from "~~/tests/unit/utils/faketories/shared/h3/h3-event.faketory";
import { createFakeQuestion } from "~~/tests/unit/utils/faketories/question/question.entity.faketory";

import { createQuestionFromQuestionDto } from "#server/utils/goat-it-api/mappers/question/question.mappers";
import { createGoatItApiEndpoint, createGoatItApiFetchOptions } from "#server/utils/goat-it-api/helpers/goat-it-api.helpers";
import { parseAndMapGoatItApiResponse, validateGoatItApiQuery } from "#server/utils/goat-it-api/helpers/goat-it-api-validation.helpers";
import { throwGoatItApiError } from "#server/utils/goat-it-api/helpers/goat-it-api-error.helpers";
import { HttpStatusCode } from "#server/utils/http/http.enums";
import { findQuestionsHandler } from "#server/api/goat-it-api/questions/handlers/find/index.get.handler";

vi.mock(import("#server/utils/goat-it-api/helpers/goat-it-api.helpers"));
vi.mock(import("#server/utils/goat-it-api/helpers/goat-it-api-validation.helpers"));
vi.mock(import("#server/utils/goat-it-api/helpers/goat-it-api-error.helpers"));

describe("Server Goat It API Questions Find Get Handler", () => {
  const mockedEvent = createFakeH3Event();
  const validMongoId = "507f1f77bcf86cd799439011";
  const anotherValidMongoId = "507f1f77bcf86cd799439012";

  beforeEach(() => {
    vi.mocked(validateGoatItApiQuery).mockResolvedValue({ "sort-by": "createdAt", "sort-order": "desc", "ids": [validMongoId], "limit": 10 });
    vi.mocked($fetch).mockResolvedValue([createFakeQuestionDto({ author: { role: "admin", name: "Test Admin" } })]);
  });

  describe(findQuestionsHandler, () => {
    it("should create goat it api endpoint for questions when called.", async() => {
      await findQuestionsHandler(mockedEvent);

      expect(createGoatItApiEndpoint).toHaveBeenCalledExactlyOnceWith("questions");
    });

    it("should create goat it api fetch options with the get method when called.", async() => {
      await findQuestionsHandler(mockedEvent);

      expect(createGoatItApiFetchOptions).toHaveBeenCalledExactlyOnceWith(mockedEvent, { method: "GET" });
    });

    it("should validate the query through the goat it api query validator when called.", async() => {
      await findQuestionsHandler(mockedEvent);

      expect(validateGoatItApiQuery).toHaveBeenCalledExactlyOnceWith(mockedEvent, FIND_QUESTIONS_QUERY_DTO);
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
      vi.mocked(validateGoatItApiQuery).mockResolvedValue({ "sort-by": "createdAt", "sort-order": "desc", "ids": [validMongoId, anotherValidMongoId], "limit": 10 });

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
      vi.mocked(validateGoatItApiQuery).mockResolvedValue({ "sort-by": "createdAt", "sort-order": "desc", "ids": [validMongoId], "limit": 50 });

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

    it.each<{ providedLimit: number; expectedLimit: number }>([
      { providedLimit: 0, expectedLimit: 100 },
      { providedLimit: 5000, expectedLimit: 100 },
      { providedLimit: 25, expectedLimit: 25 },
      { providedLimit: 100, expectedLimit: 100 },
    ])("should clamp the forwarded limit to $expectedLimit when the provided limit is $providedLimit.", async({ providedLimit, expectedLimit }) => {
      const expectedEndpoint = "/questions";
      const expectedFetchOptions = {
        baseURL: "https://api.goat-it.com",
        headers: {
          "goat-it-api-key": "test-game-key",
        },
      };
      vi.mocked(createGoatItApiEndpoint).mockReturnValue(expectedEndpoint);
      vi.mocked(createGoatItApiFetchOptions).mockReturnValue(expectedFetchOptions);
      vi.mocked(validateGoatItApiQuery).mockResolvedValue({ "sort-by": "createdAt", "sort-order": "desc", "ids": [validMongoId], "limit": providedLimit });

      await findQuestionsHandler(mockedEvent);

      expect($fetch).toHaveBeenCalledExactlyOnceWith(
        expectedEndpoint,
        {
          ...expectedFetchOptions,
          method: "GET",
          query: { "sort-by": "createdAt", "sort-order": "desc", "limit": expectedLimit, "ids": [validMongoId] },
        },
      );
    });

    it("should parse and map the fetched data with the question dto and mapper when called.", async() => {
      const rawData = [createFakeQuestionDto()];
      vi.mocked($fetch).mockResolvedValue(rawData);

      await findQuestionsHandler(mockedEvent);

      expect(parseAndMapGoatItApiResponse).toHaveBeenCalledExactlyOnceWith(rawData, QUESTION_DTO, createQuestionFromQuestionDto);
    });

    it("should return the parsed and mapped questions when called.", async() => {
      const expectedQuestions = [
        createFakeQuestion(),
        createFakeQuestion(),
      ];
      vi.mocked(parseAndMapGoatItApiResponse).mockReturnValue(expectedQuestions);

      const result = await findQuestionsHandler(mockedEvent);

      expect(result).toStrictEqual(expectedQuestions);
    });

    it("should reject with a bad request error when the query validator rejects the query.", async() => {
      vi.mocked(validateGoatItApiQuery).mockRejectedValue(Object.assign(new Error("Validation Error"), { statusCode: HttpStatusCode.BAD_REQUEST }));

      await expect(findQuestionsHandler(mockedEvent)).rejects.toMatchObject({ statusCode: HttpStatusCode.BAD_REQUEST });
    });

    it("should call throwGoatItApiError when $fetch throws an error.", async() => {
      const fetchError = new Error("Network error");
      vi.mocked($fetch).mockRejectedValue(fetchError);

      try {
        await findQuestionsHandler(mockedEvent);
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
        await findQuestionsHandler(mockedEvent);
      } catch(error: unknown) {
        void error;
      }

      expect(throwGoatItApiError).toHaveBeenCalledExactlyOnceWith(zodError);
    });
  });
});