import { describe, it, expect } from "vitest";

import { isNonEmptyString } from "#shared/utils/helpers/string/string.helpers";

describe("String Helpers", () => {
  describe(isNonEmptyString, () => {
    it.each([
      { input: "hello", expected: true, description: "a non-empty string" },
      { input: "", expected: false, description: "an empty string" },
      { input: undefined, expected: false, description: "undefined" },
    ])("should return $expected when input is $description.", ({ input, expected }) => {
      expect(isNonEmptyString(input)).toBe(expected);
    });
  });
});