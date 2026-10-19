import { describe, expect, it } from "vitest";

import { filterSafeSourceUrls, getSourceDomain } from "#shared/utils/helpers/question/source/question-source.helpers";

const JAVASCRIPT_SOURCE_URL = "javascript:alert(1)";

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

describe(filterSafeSourceUrls, () => {
  it.each<{ url: string; expected: string[]; description: string }>([
    { url: "https://en.wikipedia.org/wiki/Goat", expected: ["https://en.wikipedia.org/wiki/Goat"], description: "an https URL" },
    { url: "https:en.wikipedia.org/wiki/Goat", expected: [], description: "an https URL without slashes" },
    { url: "https:/en.wikipedia.org/wiki/Goat", expected: [], description: "an https URL with a single slash" },
    { url: "http://en.wikipedia.org/wiki/Goat", expected: [], description: "an http URL" },
    { url: JAVASCRIPT_SOURCE_URL, expected: [], description: "a javascript URL" },
    { url: "data:text/html,<script>alert(1)</script>", expected: [], description: "a data URL" },
    { url: "not a url", expected: [], description: "a malformed URL" },
  ])("should return $expected when the source URL is $description.", ({ url, expected }) => {
    expect(filterSafeSourceUrls([url])).toStrictEqual(expected);
  });

  it("should preserve the order of safe source URLs when several are provided.", () => {
    expect(filterSafeSourceUrls(["https://a.test", JAVASCRIPT_SOURCE_URL, "https://b.test"])).toStrictEqual(["https://a.test", "https://b.test"]);
  });
});