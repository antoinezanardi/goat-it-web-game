import { describe, expect, it } from "vitest";

import { isRecord } from "#shared/utils/helpers/object/object.helpers";

describe("Object Helpers", () => {
  describe(isRecord, () => {
    it("should return true when input is a plain object.", () => {
      expect(isRecord({ key: "value" })).toBe(true);
    });

    it("should return false when input is null.", () => {
      expect(isRecord(null)).toBe(false);
    });

    it("should return false when input is an array.", () => {
      expect(isRecord(["a", "b"])).toBe(false);
    });

    it("should return false when input is a string.", () => {
      expect(isRecord("string")).toBe(false);
    });

    it("should return false when input is undefined.", () => {
      expect(isRecord(undefined)).toBe(false);
    });

    it("should return false when input is a number.", () => {
      expect(isRecord(42)).toBe(false);
    });
  });
});