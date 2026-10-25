import { FetchError } from "ofetch";
import { describe, expect, it } from "vitest";

import { isConfirmedOfflineFetchError } from "@/composables/domain/useGameQuestionFeed/helpers/confirmed-offline-fetch-error/confirmed-offline-fetch-error.helpers";

function createFetchErrorWithoutResponse(): FetchError {
  return new FetchError("fetch failed");
}

function createFetchErrorWithResponse(): FetchError {
  const fetchError = new FetchError("fetch failed");
  fetchError.response = { status: 500 } as unknown as FetchError["response"];

  return fetchError;
}

describe(isConfirmedOfflineFetchError, () => {
  it("should return true when the browser is offline and the error has no HTTP response.", () => {
    expect(isConfirmedOfflineFetchError(createFetchErrorWithoutResponse(), false)).toBe(true);
  });

  it("should return false when the browser is online and the error has no HTTP response.", () => {
    expect(isConfirmedOfflineFetchError(createFetchErrorWithoutResponse(), true)).toBe(false);
  });

  it("should return false when the browser is offline and the error has an HTTP response.", () => {
    expect(isConfirmedOfflineFetchError(createFetchErrorWithResponse(), false)).toBe(false);
  });

  it("should return false when the browser is offline and the error is not a fetch error.", () => {
    expect(isConfirmedOfflineFetchError(new Error("boom"), false)).toBe(false);
  });
});