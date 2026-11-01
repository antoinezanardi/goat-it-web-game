import { describe, expect, it } from "vitest";

import { isSentryEnabled } from "#shared/utils/helpers/sentry/configuration/is-sentry-enabled.helpers";

describe(isSentryEnabled, () => {
  it.each<{ description: string; isDevelopment: boolean; disabled: boolean; expected: boolean }>([
    { description: "a deployed build with tracking enabled", isDevelopment: false, disabled: false, expected: true },
    { description: "a development build with tracking enabled", isDevelopment: true, disabled: false, expected: false },
    { description: "a deployed build with tracking disabled", isDevelopment: false, disabled: true, expected: false },
    { description: "a development build with tracking disabled", isDevelopment: true, disabled: true, expected: false },
  ])("should return $expected when the build is $description.", ({ isDevelopment, disabled, expected }) => {
    expect(isSentryEnabled({ isDevelopment, disabled })).toBe(expected);
  });
});