import { vi, describe, it, expect, beforeEach } from "vitest";
import { ZodError } from "zod";
import { createFakeQuestionDto } from "@goat-it/schemas/testing/question";

import { createFakeH3Event } from "~~/tests/unit/utils/faketories/shared/h3/h3-event.faketory";

import { createQuestionFromQuestionDto } from "#server/utils/goat-it-api/mappers/question/question.mappers";
import { createGoatItApiEndpoint, createGoatItApiFetchOptions, handleGoatItApiError } from "#server/utils/goat-it-api/helpers/goat-it-api.helpers";
import { HttpStatusCode } from "#server/utils/http/http.enums";
import { getQuestionsByIdsHandler } from "#server/api/goat-it-api/questions/handlers/get-by-ids/index.get.handler";

vi.mock(import("#server/utils/goat-it-api/helpers/goat-it-api.helpers"));

describe("Server Goat It API Questions Get By Ids Handler", () => {
  const mockedEvent = createFakeH3Event();
  const validMongoId = "507f1f77bcf86cd799439011";
  const anotherValidMongoId = "507f1f77bcf86cd799439012";

  beforeEach(() => {
    vi.mocked(getQuery).mockReturnValue({ ids: validMongoId, limit: 10 });
    vi.mocked($fetch).mockResolvedValue([createFakeQuestionDto({ author: { role: "admin", name: "Test Admin" } })]);
    vi.mocked(createError).mockReturnValue(new Error("Bad request") as unknown as ReturnType<typeof createError>);
  });

  describe(getQuestionsByIdsHandler, () => {
    it("should create goat it api endpoint for questions when called.", async() => {
      await getQuestionsByIdsHandler(mockedEvent);

      expect(createGoatItApiEndpoint).toHaveBeenCalledExactlyOnceWith("questions");
    });

    it("should create goat it api fetch options with event when called.", async() => {
      await getQuestionsByIdsHandler(mockedEvent);

      expect(createGoatItApiFetchOptions).toHaveBeenCalledExactlyOnceWith(mockedEvent);
    });

    it("should read query from the event when called.", async() => {
      await getQuestionsByIdsHandler(mockedEvent);

      expect(getQuery).toHaveBeenCalledExactlyOnceWith(mockedEvent);
    });

    it("should get questions by ids with correct endpoint, fetch options and parsed query when called.", async() => {
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

      await getQuestionsByIdsHandler(mockedEvent);

      expect($fetch).toHaveBeenCalledExactlyOnceWith(
        expectedEndpoint,
        {
          ...expectedFetchOptions,
          method: "GET",
          query: { "sort-by": "createdAt", "sort-order": "desc", "limit": 0, "ids": [validMongoId, anotherValidMongoId] },
        },
      );
    });

    it("should force limit to zero when called.", async() => {
      const expectedEndpoint = "/questions";
      const expectedFetchOptions = {
        baseURL: "https://api.goat-it.com",
        headers: {
          "goat-it-api-key": "test-game-key",
        },
      };
      vi.mocked(createGoatItApiEndpoint).mockReturnValue(expectedEndpoint);
      vi.mocked(createGoatItApiFetchOptions).mockReturnValue(expectedFetchOptions);
      vi.mocked(getQuery).mockReturnValue({ ids: validMongoId, limit: 50 });

      await getQuestionsByIdsHandler(mockedEvent);

      expect($fetch).toHaveBeenCalledExactlyOnceWith(
        expectedEndpoint,
        {
          ...expectedFetchOptions,
          method: "GET",
          query: { "sort-by": "createdAt", "sort-order": "desc", "limit": 0, "ids": [validMongoId] },
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

      const result = await getQuestionsByIdsHandler(mockedEvent);

      expect(result).toStrictEqual(expectedQuestions);
    });

    it("should throw a bad request error when ids are missing.", async() => {
      vi.mocked(getQuery).mockReturnValue({});
      const badRequestError = new Error("Bad request") as unknown as ReturnType<typeof createError>;
      vi.mocked(createError).mockReturnValue(badRequestError);

      await expect(getQuestionsByIdsHandler(mockedEvent)).rejects.toBe(badRequestError);
    });

    it("should create a bad request error when ids are missing.", async() => {
      vi.mocked(getQuery).mockReturnValue({});

      try {
        await getQuestionsByIdsHandler(mockedEvent);
      } catch(error: unknown) {
        void error;
      }

      expect(createError).toHaveBeenCalledExactlyOnceWith(expect.objectContaining({
        statusCode: HttpStatusCode.BAD_REQUEST,
      }));
    });

    it("should throw a ZodError when ids are empty.", async() => {
      vi.mocked(getQuery).mockReturnValue({ ids: [] });

      await expect(getQuestionsByIdsHandler(mockedEvent)).rejects.toThrow(ZodError);
    });

    it("should throw ZodError when ids are empty.", async() => {
      vi.mocked(getQuery).mockReturnValue({ ids: [] });

      try {
        await getQuestionsByIdsHandler(mockedEvent);
      } catch(error: unknown) {
        void error;
      }

      expect(createError).not.toHaveBeenCalled();
    });

    it("should throw ZodError when an id is invalid.", async() => {
      vi.mocked(getQuery).mockReturnValue({ ids: ["not-a-valid-id"] });

      await expect(getQuestionsByIdsHandler(mockedEvent)).rejects.toThrow(ZodError);
    });

    it("should throw ZodError when ids contain duplicates.", async() => {
      vi.mocked(getQuery).mockReturnValue({ ids: [validMongoId, validMongoId] });

      await expect(getQuestionsByIdsHandler(mockedEvent)).rejects.toThrow(ZodError);
    });

    it("should throw ZodError when more than 100 ids are provided.", async() => {
      vi.mocked(getQuery).mockReturnValue({ ids: Array.from({ length: 101 }, () => validMongoId) });

      await expect(getQuestionsByIdsHandler(mockedEvent)).rejects.toThrow(ZodError);
    });

    it("should call handleGoatItApiError when $fetch throws an error.", async() => {
      const fetchError = new Error("Network error");
      vi.mocked($fetch).mockRejectedValue(fetchError);

      try {
        await getQuestionsByIdsHandler(mockedEvent);
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
        await getQuestionsByIdsHandler(mockedEvent);
      } catch(error: unknown) {
        void error;
      }

      expect(handleGoatItApiError).toHaveBeenCalledExactlyOnceWith(expect.any(ZodError));
    });
  });
});