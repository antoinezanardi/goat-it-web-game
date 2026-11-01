import { describe, expect, it } from "vitest";

import { resolveSiteEnvironment } from "#shared/utils/helpers/site/site-environment.helpers.ts";

describe(resolveSiteEnvironment, () => {
  it("should return the trimmed configured site environment when provided.", () => {
    expect(resolveSiteEnvironment({ NUXT_SITE_ENV: "  staging  ", NODE_ENV: "production" })).toBe("staging");
  });

  it("should return production when NODE_ENV is production and no site environment is configured.", () => {
    expect(resolveSiteEnvironment({ NODE_ENV: "production" })).toBe("production");
  });

  it("should return development when NODE_ENV is not production and no site environment is configured.", () => {
    expect(resolveSiteEnvironment({ NODE_ENV: "development" })).toBe("development");
  });

  it("should return development when no environment variable is configured.", () => {
    expect(resolveSiteEnvironment({})).toBe("development");
  });

  it("should fall back to NODE_ENV when the site environment is blank.", () => {
    expect(resolveSiteEnvironment({ NUXT_SITE_ENV: "   ", NODE_ENV: "production" })).toBe("production");
  });
});