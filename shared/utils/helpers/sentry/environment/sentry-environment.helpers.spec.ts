import { describe, expect, it } from "vitest";

import { resolveSentryEnvironment } from "#shared/utils/helpers/sentry/environment/sentry-environment.helpers";

describe(resolveSentryEnvironment, () => {
  it.each<{ description: string; siteEnvironment: string; expectedEnvironment: string | undefined }>([
    { description: "the production environment", siteEnvironment: "production", expectedEnvironment: "production" },
    { description: "the staging environment", siteEnvironment: "staging", expectedEnvironment: "staging" },
    { description: "the development environment", siteEnvironment: "development", expectedEnvironment: undefined },
    { description: "the test environment", siteEnvironment: "test", expectedEnvironment: undefined },
    { description: "an unsupported environment", siteEnvironment: "preview", expectedEnvironment: undefined },
  ])("should return the expected label when the site environment is $description.", ({ siteEnvironment, expectedEnvironment }) => {
    expect(resolveSentryEnvironment(siteEnvironment)).toBe(expectedEnvironment);
  });
});