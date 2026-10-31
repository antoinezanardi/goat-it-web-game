import { FetchError } from "ofetch";
import { describe, expect, it } from "vitest";

import { isConfirmedOfflineFetchError } from "@/composables/domain/useGameQuestionFeed/helpers/confirmed-offline-fetch-error/confirmed-offline-fetch-error.helpers";

type ConfirmedOfflineFetchErrorCase = {
  condition: string;
  createError: () => unknown;
  isOnline: boolean;
  expected: boolean;
};

function createFetchErrorWithoutResponse(): FetchError {
  return new FetchError("fetch failed");
}

function createFetchErrorWithResponse(): FetchError {
  const fetchError = new FetchError("fetch failed");
  fetchError.response = { status: 500 } as unknown as FetchError["response"];

  return fetchError;
}

describe(isConfirmedOfflineFetchError, () => {
  it.each<ConfirmedOfflineFetchErrorCase>([
    {
      condition: "the browser is offline and the error has no HTTP response",
      createError: createFetchErrorWithoutResponse,
      isOnline: false,
      expected: true,
    },
    {
      condition: "the browser is online and the error has no HTTP response",
      createError: createFetchErrorWithoutResponse,
      isOnline: true,
      expected: false,
    },
    {
      condition: "the browser is offline and the error has an HTTP response",
      createError: createFetchErrorWithResponse,
      isOnline: false,
      expected: false,
    },
    {
      condition: "the browser is offline and the error is not a fetch error",
      createError: (): Error => new Error("boom"),
      isOnline: false,
      expected: false,
    },
  ])("should return $expected when $condition.", ({ createError, isOnline, expected }) => {
    expect(isConfirmedOfflineFetchError(createError(), isOnline)).toBe(expected);
  });
});