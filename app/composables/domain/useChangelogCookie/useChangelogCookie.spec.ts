import { beforeEach, describe, expect, it } from "vitest";

import { useCookieMockState } from "~~/tests/unit/setup/nuxt/composables/use-cookie.nuxt.unit-setup";

import { CHANGELOG_STATE_COOKIE_OPTIONS } from "~/composables/domain/useChangelogCookie/use-changelog-cookie.constants";
import type { useChangelogCookie as UseChangelogCookieType } from "~/composables/domain/useChangelogCookie/useChangelogCookie";
import { CookieNames } from "#shared/enums/cookie.enums";

let useChangelogCookie: typeof UseChangelogCookieType;

describe("useChangelogCookie", () => {
  beforeEach(async() => {
    useCookieMockState.capturedName.current = undefined;
    useCookieMockState.capturedOptions.current = undefined;
    useCookieMockState.cookieRef.value = null;
    ({ useChangelogCookie } = await import("~/composables/domain/useChangelogCookie/useChangelogCookie"));
  });

  describe("cookie registration", () => {
    it("should read the changelog state cookie by name when called.", () => {
      useChangelogCookie();

      expect(useCookieMockState.capturedName.current).toBe(CookieNames.CHANGELOG_STATE);
    });

    it("should read the changelog state cookie with the shared cookie options when called.", () => {
      useChangelogCookie();

      expect(useCookieMockState.capturedOptions.current).toStrictEqual(CHANGELOG_STATE_COOKIE_OPTIONS);
    });
  });

  describe("readChangelogState", () => {
    it("should return the parsed state when the cookie holds a valid state.", () => {
      useCookieMockState.cookieRef.value = { lastSeenVersion: "1.9.0", lastNotifiedVersion: "1.9.0" };
      const { readChangelogState } = useChangelogCookie();

      expect(readChangelogState()).toStrictEqual({ lastSeenVersion: "1.9.0", lastNotifiedVersion: "1.9.0" });
    });

    it("should return undefined when the cookie is missing.", () => {
      const { readChangelogState } = useChangelogCookie();

      expect(readChangelogState()).toBeUndefined();
    });

    it("should return undefined when the cookie holds an empty object.", () => {
      useCookieMockState.cookieRef.value = {};
      const { readChangelogState } = useChangelogCookie();

      expect(readChangelogState()).toBeUndefined();
    });

    it("should return undefined when a version field is empty.", () => {
      useCookieMockState.cookieRef.value = { lastSeenVersion: "", lastNotifiedVersion: "1.9.0" };
      const { readChangelogState } = useChangelogCookie();

      expect(readChangelogState()).toBeUndefined();
    });

    it.each<{ value: string | boolean | number | undefined }>([
      { value: undefined },
      { value: true },
      { value: "not-json" },
      { value: 42 },
    ])("should return undefined when the cookie holds $value.", ({ value }) => {
      useCookieMockState.cookieRef.value = value;
      const { readChangelogState } = useChangelogCookie();

      expect(readChangelogState()).toBeUndefined();
    });
  });

  describe("writeChangelogState", () => {
    it("should assign the state to the cookie when called.", () => {
      const { writeChangelogState } = useChangelogCookie();

      writeChangelogState({ lastSeenVersion: "1.9.0", lastNotifiedVersion: "1.8.0" });

      expect(useCookieMockState.cookieRef.value).toStrictEqual({ lastSeenVersion: "1.9.0", lastNotifiedVersion: "1.8.0" });
    });
  });
});