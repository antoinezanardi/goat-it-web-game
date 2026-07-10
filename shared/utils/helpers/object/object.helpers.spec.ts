import { describe, expect, it } from "vitest";

import { isRecord } from "#shared/utils/helpers/object/object.helpers";

describe("Object Helpers", () => {
  describe(isRecord, () => {
    it("should return true when input is a plain object.", () => {
      expect(isRecord({ key: "value" })).toBe(true);
    });

    it.each([
      { input: null, label: "null" },
      { input: ["a", "b"], label: "an array" },
      { input: "string", label: "a string" },
      { input: undefined, label: "undefined" },
      { input: 42, label: "a number" },
    ])("should return false when input is $label.", ({ input }) => {
      expect(isRecord(input)).toBe(false);
    });
  });
});