import { FetchError } from "ofetch";
import { H3Error } from "h3";
import { describe, it, expect } from "vitest";

import type { SharedRuntimeConfig } from "#build/types/runtime-config";
import { createGoatItApiEndpoint, createGoatItApiFetchOptions, handleGoatItApiError } from "#server/utils/goat-it-api/helpers/goat-it-api.helpers";

function getThrowableError(function_: () => void): H3Error {
  try {
    function_();
  } catch(error: unknown) {
    return error as H3Error;
  }

  throw new Error("Expected function to throw");
}

describe("Goat It API Helpers", () => {
  describe(createGoatItApiEndpoint, () => {
    it("should create the correct endpoint for a given resource name when called.", () => {
      const resourceName = "question-themes";
      const expectedEndpoint = "/question-themes";
      const endpoint = createGoatItApiEndpoint(resourceName);

      expect(endpoint).toBe(expectedEndpoint);
    });

    it("should create the correct endpoint with id for a given resource name when called.", () => {
      const resourceName = "question-themes";
      const id = "abc123";
      const expectedEndpoint = "/question-themes/abc123";
      const endpoint = createGoatItApiEndpoint(resourceName, { id });

      expect(endpoint).toBe(expectedEndpoint);
    });

    it("should create the correct endpoint with suffix for a given resource name when called.", () => {
      const resourceName = "questions";
      const suffix = "random";
      const expectedEndpoint = "/questions/random";
      const endpoint = createGoatItApiEndpoint(resourceName, { suffix });

      expect(endpoint).toBe(expectedEndpoint);
    });

    it("should create the correct endpoint without id when empty string id is provided.", () => {
      const resourceName = "question-themes";
      const expectedEndpoint = "/question-themes";
      const endpoint = createGoatItApiEndpoint(resourceName, { id: "" });

      expect(endpoint).toBe(expectedEndpoint);
    });

    it("should create the correct endpoint without suffix when empty string suffix is provided.", () => {
      const resourceName = "questions";
      const expectedEndpoint = "/questions";
      const endpoint = createGoatItApiEndpoint(resourceName, { suffix: "" });

      expect(endpoint).toBe(expectedEndpoint);
    });
  });

  describe(createGoatItApiFetchOptions, () => {
    it("should create the correct fetch options for a given Goat It API runtime config when called.", () => {
      const goatItApiRuntimeConfig: SharedRuntimeConfig["goatItApi"] = {
        baseUrl: "https://api.example.com",
        adminKey: "unused-admin-key",
        gameKey: "secret-game-key",
      };
      const expectedFetchOptions: Parameters<typeof $fetch>[1] = {
        baseURL: goatItApiRuntimeConfig.baseUrl,
        headers: {
          "goat-it-api-key": goatItApiRuntimeConfig.gameKey,
        },
      };
      const fetchOptions = createGoatItApiFetchOptions(goatItApiRuntimeConfig);

      expect(fetchOptions).toStrictEqual<Parameters<typeof $fetch>[1]>(expectedFetchOptions);
    });
  });

  describe(handleGoatItApiError, () => {
    describe("when error is a FetchError with valid ApiResponseExceptionDto data", () => {
      it("should throw H3Error when called.", () => {
        const fetchError = new FetchError("Conflict");
        fetchError.data = {
          statusCode: 409,
          message: "Question theme is referenced by live questions",
          error: "Conflict",
          errorCode: "questionThemeReferencedByLiveQuestions",
        };

        expect(() => handleGoatItApiError(fetchError)).toThrow(H3Error);
      });

      it("should throw H3Error with status code from the parsed API error when called.", () => {
        const fetchError = new FetchError("Conflict");
        fetchError.data = {
          statusCode: 409,
          message: "Question theme is referenced by live questions",
          error: "Conflict",
          errorCode: "questionThemeReferencedByLiveQuestions",
        };
        const error = getThrowableError(() => handleGoatItApiError(fetchError));

        expect(error.statusCode).toBe(409);
      });

      it("should throw H3Error with message from the parsed API error when called.", () => {
        const fetchError = new FetchError("Conflict");
        fetchError.data = {
          statusCode: 409,
          message: "Question theme is referenced by live questions",
          error: "Conflict",
          errorCode: "questionThemeReferencedByLiveQuestions",
        };

        expect(() => handleGoatItApiError(fetchError)).toThrow("Question theme is referenced by live questions");
      });

      it("should throw H3Error with error code in data from the parsed API error when called.", () => {
        const fetchError = new FetchError("Conflict");
        fetchError.data = {
          statusCode: 409,
          message: "Question theme is referenced by live questions",
          error: "Conflict",
          errorCode: "questionThemeReferencedByLiveQuestions",
        };
        const error = getThrowableError(() => handleGoatItApiError(fetchError));

        expect(error.data).toStrictEqual({ errorCode: "questionThemeReferencedByLiveQuestions" });
      });
    });

    describe("when error is a FetchError with valid ApiResponseExceptionDto data but no errorCode", () => {
      it("should throw H3Error when called.", () => {
        const fetchError = new FetchError("Bad Request");
        fetchError.data = {
          statusCode: 400,
          message: "The request could not be understood",
          error: "Bad Request",
        };

        expect(() => handleGoatItApiError(fetchError)).toThrow(H3Error);
      });

      it("should throw H3Error with status code from the parsed API error when called.", () => {
        const fetchError = new FetchError("Bad Request");
        fetchError.data = {
          statusCode: 400,
          message: "The request could not be understood",
          error: "Bad Request",
        };
        const error = getThrowableError(() => handleGoatItApiError(fetchError));

        expect(error.statusCode).toBe(400);
      });

      it("should throw H3Error with message from the parsed API error when called.", () => {
        const fetchError = new FetchError("Bad Request");
        fetchError.data = {
          statusCode: 400,
          message: "The request could not be understood",
          error: "Bad Request",
        };

        expect(() => handleGoatItApiError(fetchError)).toThrow("The request could not be understood");
      });

      it("should throw H3Error with undefined error code in data when called.", () => {
        const fetchError = new FetchError("Bad Request");
        fetchError.data = {
          statusCode: 400,
          message: "The request could not be understood",
          error: "Bad Request",
        };
        const error = getThrowableError(() => handleGoatItApiError(fetchError));

        expect(error.data).toStrictEqual({ errorCode: undefined });
      });
    });

    describe("when error is a FetchError with invalid data that does not match ApiResponseExceptionDto", () => {
      it("should throw H3Error when called.", () => {
        const fetchError = new FetchError("Unknown error");
        fetchError.data = { unexpected: "shape" };

        expect(() => handleGoatItApiError(fetchError)).toThrow(H3Error);
      });

      it("should throw H3Error with 500 status code when called.", () => {
        const fetchError = new FetchError("Unknown error");
        fetchError.data = { unexpected: "shape" };
        const error = getThrowableError(() => handleGoatItApiError(fetchError));

        expect(error.statusCode).toBe(500);
      });

      it("should throw H3Error with internal server error message when called.", () => {
        const fetchError = new FetchError("Unknown error");
        fetchError.data = { unexpected: "shape" };

        expect(() => handleGoatItApiError(fetchError)).toThrow("Internal server error");
      });
    });

    it("should re-throw the original error when error is not a FetchError.", () => {
      const originalError = new Error("Some other error");

      expect(() => handleGoatItApiError(originalError)).toThrow(originalError);
    });
  });
});