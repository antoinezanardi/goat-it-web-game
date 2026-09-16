import { beforeEach, describe, expect, it } from "vitest";

import { useCookieMockState } from "~~/tests/unit/setup/nuxt/composables/use-cookie.nuxt.unit-setup";

import type { useLocaleCookie as UseLocaleCookieType } from "~/composables/core/useLocaleCookie/useLocaleCookie";

let useLocaleCookie: typeof UseLocaleCookieType;

describe("useLocaleCookie", () => {
  beforeEach(async() => {
    useCookieMockState.capturedName.current = undefined;
    useCookieMockState.capturedOptions.current = undefined;
    // Acceptable as useCookie<string | null> requires null as the initial value for the cookie guard
    // oxlint-disable-next-line unicorn/no-null
    useCookieMockState.cookieRef.value = null;
    ({ useLocaleCookie } = await import("~/composables/core/useLocaleCookie/useLocaleCookie"));
  });

  it("should read the i18n_redirected cookie by name when called.", () => {
    useLocaleCookie();

    expect(useCookieMockState.capturedName.current).toBe("i18n_redirected");
  });

  it("should read the i18n_redirected cookie with the locale cookie options when called.", () => {
    useLocaleCookie();

    expect(useCookieMockState.capturedOptions.current).toStrictEqual({ path: "/", maxAge: 31_536_000, sameSite: "lax" });
  });

  it("should return the cookie reference when called.", () => {
    const cookie = useLocaleCookie();

    expect(cookie).toBe(useCookieMockState.cookieRef);
  });
});