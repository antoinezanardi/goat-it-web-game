import { describe, expect, it } from "vitest";

import { getSourceDomain } from "~/composables/domain/question/helpers/question.helpers";

describe(getSourceDomain, () => {
  it("should extract the hostname when a full HTTPS URL is provided.", () => {
    expect(getSourceDomain("https://en.wikipedia.org/wiki/Goat")).toBe("en.wikipedia.org");
  });

  it("should strip the www. prefix when the URL starts with www.", () => {
    expect(getSourceDomain("https://www.britannica.com/topic/goat")).toBe("britannica.com");
  });

  it("should return the raw input when the URL is malformed.", () => {
    expect(getSourceDomain("not a url")).toBe("not a url");
  });
});