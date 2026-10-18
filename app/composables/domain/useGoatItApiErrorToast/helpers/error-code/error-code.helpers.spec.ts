import { FetchError } from "ofetch";
import { describe, expect, it } from "vitest";

import { extractErrorCode } from "@/composables/domain/useGoatItApiErrorToast/helpers/error-code/error-code.helpers";

type ExtractErrorCodeUndefinedCase = {
  condition: string;
  createError: () => unknown;
};

describe(extractErrorCode, () => {
  it("should return the error code when error is a FetchError with a valid string errorCode.", () => {
    const fetchError = new FetchError("Conflict");
    fetchError.data = { data: { errorCode: "someErrorCode" } };

    expect(extractErrorCode(fetchError)).toBe("someErrorCode");
  });

  it.each<ExtractErrorCodeUndefinedCase>([
    {
      condition: "error is not a FetchError",
      createError: (): unknown => ({ data: { data: { errorCode: "shouldNotBeExtracted" } } }),
    },
    {
      condition: "error is a FetchError with no data",
      createError: (): FetchError => new FetchError("Server Error"),
    },
    {
      condition: "error is a FetchError with non-object nested data",
      createError: (): FetchError => {
        const fetchError = new FetchError("Server Error");
        fetchError.data = { data: "not-an-object" };

        return fetchError;
      },
    },
    {
      condition: "error is a FetchError with null nested data",
      createError: (): FetchError => {
        const fetchError = new FetchError("Server Error");
        fetchError.data = { data: null };

        return fetchError;
      },
    },
    {
      condition: "error is a FetchError with non-string errorCode",
      createError: (): FetchError => {
        const fetchError = new FetchError("Server Error");
        fetchError.data = { data: { errorCode: 123 } };

        return fetchError;
      },
    },
    {
      condition: "error is a FetchError with no errorCode property",
      createError: (): FetchError => {
        const fetchError = new FetchError("Server Error");
        fetchError.data = { data: {} };

        return fetchError;
      },
    },
  ])("should return undefined when $condition.", ({ createError }) => {
    expect(extractErrorCode(createError())).toBeUndefined();
  });
});