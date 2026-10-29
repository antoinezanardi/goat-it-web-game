import { describe, expect, it } from "vitest";

import { buildSentryInitConfig } from "#shared/utils/helpers/sentry/configuration/build-sentry-init-config.helpers";

const DEFAULT_CONFIGURATION = {
  enabled: true,
  dsn: "https://public@o123.ingest.us.sentry.io/456",
  environment: "production",
  release: "",
};

describe(buildSentryInitConfig, () => {
  it("should return undefined when error tracking is disabled.", () => {
    expect(buildSentryInitConfig({ ...DEFAULT_CONFIGURATION, enabled: false })).toBeUndefined();
  });

  it("should return undefined when the dsn is blank.", () => {
    expect(buildSentryInitConfig({ ...DEFAULT_CONFIGURATION, dsn: "   " })).toBeUndefined();
  });

  it("should trim the dsn when the dsn has surrounding whitespace.", () => {
    const config = buildSentryInitConfig({ ...DEFAULT_CONFIGURATION, dsn: "  https://public@o123.ingest.us.sentry.io/456  " });

    expect(config?.dsn).toBe("https://public@o123.ingest.us.sentry.io/456");
  });

  it("should omit the release when the release is blank.", () => {
    const config = buildSentryInitConfig(DEFAULT_CONFIGURATION);

    expect(config).not.toHaveProperty("release");
  });

  it("should include the release when the release is configured.", () => {
    const config = buildSentryInitConfig({ ...DEFAULT_CONFIGURATION, release: "abc123" });

    expect(config?.release).toBe("abc123");
  });

  it("should disable identity and body collection when building the options.", () => {
    const config = buildSentryInitConfig(DEFAULT_CONFIGURATION);

    expect(config?.dataCollection).toStrictEqual({
      userInfo: false,
      httpBodies: [],
      httpHeaders: { deny: ["forwarded", "-ip", "remote-", "via", "-user"] },
      cookies: { deny: ["forwarded", "-ip", "remote-", "via", "-user"] },
      urlQueryParams: { deny: ["forwarded", "-ip", "remote-", "via", "-user"] },
    });
  });

  it("should keep the environment label when building the options.", () => {
    const config = buildSentryInitConfig({ ...DEFAULT_CONFIGURATION, environment: "staging" });

    expect(config?.environment).toBe("staging");
  });
});