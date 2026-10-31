import { describe, expect, it } from "vitest";

import { buildSentryInitConfig } from "#shared/utils/helpers/sentry/configuration/build-sentry-init-config.helpers";

const DEFAULT_CONFIGURATION = {
  enabled: true,
  dsn: "https://public@o123.ingest.us.sentry.io/456",
  environment: "production",
} as const;

describe(buildSentryInitConfig, () => {
  it("should return undefined when error tracking is disabled.", () => {
    expect(buildSentryInitConfig({ ...DEFAULT_CONFIGURATION, enabled: false })).toBeUndefined();
  });

  it("should return undefined when the environment label is missing.", () => {
    expect(buildSentryInitConfig({ ...DEFAULT_CONFIGURATION, environment: undefined })).toBeUndefined();
  });

  it("should return undefined when the dsn is blank.", () => {
    expect(buildSentryInitConfig({ ...DEFAULT_CONFIGURATION, dsn: "   " })).toBeUndefined();
  });

  it("should trim the dsn when the dsn has surrounding whitespace.", () => {
    const config = buildSentryInitConfig({ ...DEFAULT_CONFIGURATION, dsn: "  https://public@o123.ingest.us.sentry.io/456  " });

    expect(config?.dsn).toBe("https://public@o123.ingest.us.sentry.io/456");
  });

  it("should disable every privacy-sensitive collection category when building the options.", () => {
    const config = buildSentryInitConfig(DEFAULT_CONFIGURATION);

    expect(config?.dataCollection).toStrictEqual({
      userInfo: false,
      cookies: false,
      httpHeaders: false,
      urlQueryParams: false,
      httpBodies: [],
      stackFrameVariables: false,
    });
  });

  it("should keep the environment label when building the options.", () => {
    const config = buildSentryInitConfig({ ...DEFAULT_CONFIGURATION, environment: "staging" });

    expect(config?.environment).toBe("staging");
  });

  it("should keep the ignore error patterns when building the options.", () => {
    const config = buildSentryInitConfig(DEFAULT_CONFIGURATION);

    expect(config?.ignoreErrors).toStrictEqual(["AbortError", "The operation was aborted"]);
  });

  it("should keep the denied url patterns when building the options.", () => {
    const config = buildSentryInitConfig(DEFAULT_CONFIGURATION);

    expect(config?.denyUrls).toStrictEqual([/^chrome-extension:\/\//u, /^moz-extension:\/\//u]);
  });
});