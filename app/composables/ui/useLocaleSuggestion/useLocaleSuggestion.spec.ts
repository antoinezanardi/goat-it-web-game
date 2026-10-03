import { mockNuxtImport } from "@nuxt/test-utils/runtime";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { useCookieMockState } from "~~/tests/unit/setup/nuxt/composables/use-cookie.nuxt.unit-setup";
import { createUseI18nMock } from "~~/tests/unit/utils/mocks/composables/nuxt/useI18n/useI18n.mock";
import type { UseI18nMock } from "~~/tests/unit/utils/mocks/composables/nuxt/useI18n/useI18n.mock";
import { MOCKED_TOAST_ID } from "~~/tests/unit/utils/mocks/composables/nuxt/useToast/useToast.mock";
import { createUseAppToastMock } from "~~/tests/unit/utils/mocks/composables/ui/useAppToast/useAppToast.mock";
import type { UseAppToastMock } from "~~/tests/unit/utils/mocks/composables/ui/useAppToast/useAppToast.mock";

import type { useLocaleSuggestion as UseLocaleSuggestionType } from "@/composables/ui/useLocaleSuggestion/useLocaleSuggestion";
import type { Toast } from "#ui/composables";

let i18nMock: UseI18nMock;

let useAppToastMock: UseAppToastMock;

// Acceptable as import() form is required to mock a module from a factory with importOriginal
// oxlint-disable-next-line vitest/prefer-import-in-mock
vi.mock(import("#app/nuxt"), async importOriginal => {
  const actual = await importOriginal();

  return {
    ...actual,
    useNuxtApp: ((...arguments_: Parameters<typeof actual.useNuxtApp>) => ({
      ...actual.useNuxtApp(...arguments_),
      $i18n: i18nMock,
    })) as typeof actual.useNuxtApp,
  };
});

mockNuxtImport("useAppToast", () => (): UseAppToastMock => useAppToastMock);

let useLocaleSuggestion: typeof UseLocaleSuggestionType;

function stubNavigatorLanguages(languages: string[]): void {
  vi.stubGlobal("navigator", { languages });
}

function getAddedToastArguments(): Partial<Toast> | undefined {
  return vi.mocked(useAppToastMock.addInfoToast).mock.calls[0]?.[0];
}

function callOnClick(onClick: ((event: MouseEvent) => void) | ((event: MouseEvent) => void)[] | undefined): void {
  if (typeof onClick === "function") {
    onClick(new MouseEvent("click"));
  } else if (Array.isArray(onClick)) {
    onClick[0]?.(new MouseEvent("click"));
  }
}

describe("useLocaleSuggestion", () => {
  beforeEach(async() => {
    i18nMock = createUseI18nMock();
    useAppToastMock = createUseAppToastMock();
    useCookieMockState.capturedName.current = undefined;
    useCookieMockState.capturedOptions.current = undefined;
    useCookieMockState.cookieRef.value = null;
    ({ useLocaleSuggestion } = await import("@/composables/ui/useLocaleSuggestion/useLocaleSuggestion"));
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("should read the i18n_redirected cookie by name when invoked.", async() => {
    await useLocaleSuggestion();

    expect(useCookieMockState.capturedName.current).toBe("i18n_redirected");
  });

  it("should persist cookie options when reading the i18n_redirected cookie.", async() => {
    await useLocaleSuggestion();

    expect(useCookieMockState.capturedOptions.current).toStrictEqual({ path: "/", maxAge: 34_560_000, sameSite: "lax" });
  });

  it.each<{ cookieValue: string; description: string }>([
    { cookieValue: "fr", description: "a valid locale" },
    { cookieValue: "en", description: "the current locale" },
  ])("should not add a toast when the i18n_redirected cookie holds $description.", async({ cookieValue }) => {
    useCookieMockState.cookieRef.value = cookieValue;

    await useLocaleSuggestion();

    expect(useAppToastMock.addInfoToast).not.toHaveBeenCalled();
  });

  it("should proceed to the suggestion flow when the i18n_redirected cookie holds an invalid locale.", async() => {
    useCookieMockState.cookieRef.value = "FR";
    stubNavigatorLanguages(["fr-FR", "fr"]);

    await useLocaleSuggestion();

    expect(useAppToastMock.addInfoToast).toHaveBeenCalledExactlyOnceWith(expect.objectContaining({ title: "common.localeSuggestion.title" }));
  });

  it("should add an info toast proposing the suggested locale when browser languages differ from the current locale.", async() => {
    stubNavigatorLanguages(["fr-FR", "fr"]);

    await useLocaleSuggestion();

    expect(useAppToastMock.addInfoToast).toHaveBeenCalledExactlyOnceWith({
      "title": "common.localeSuggestion.title",
      "description": "common.localeSuggestion.description",
      "type": "background",
      "duration": 0,
      "icon": "i-lucide-languages",
      "actions": [
        {
          label: "common.localeSuggestion.accept",
          size: "md",
          color: "primary",
          leadingIcon: "i-lucide-languages",
          onClick: expect.any(Function) as () => void,
        },
        { label: "common.localeSuggestion.decline", color: "neutral", onClick: expect.any(Function) as () => void },
      ],
      "onUpdate:open": expect.any(Function) as (open: boolean) => void,
    });
  });

  it("should load the suggested locale messages before adding the toast when browser languages differ from the current locale.", async() => {
    stubNavigatorLanguages(["fr-FR", "fr"]);

    await useLocaleSuggestion();

    expect(i18nMock.loadLocaleMessages).toHaveBeenCalledExactlyOnceWith("fr");
  });

  it("should render the toast title in the suggested locale when adding the suggestion toast.", async() => {
    stubNavigatorLanguages(["fr-FR", "fr"]);

    await useLocaleSuggestion();

    expect(i18nMock.t).toHaveBeenNthCalledWith(1, "common.localeSuggestion.title", {}, { locale: "fr" });
  });

  it("should not add a toast when no browser language matches a supported locale.", async() => {
    stubNavigatorLanguages(["ja-JP", "ja"]);

    await useLocaleSuggestion();

    expect(useAppToastMock.addInfoToast).not.toHaveBeenCalled();
  });

  it("should not add a toast when the suggested locale equals the current locale.", async() => {
    stubNavigatorLanguages(["en-US"]);

    await useLocaleSuggestion();

    expect(useAppToastMock.addInfoToast).not.toHaveBeenCalled();
  });

  it("should switch the locale to the suggested one when the accept action is clicked.", async() => {
    stubNavigatorLanguages(["fr-FR", "fr"]);
    await useLocaleSuggestion();

    callOnClick(getAddedToastArguments()?.actions?.[0]?.onClick);

    expect(i18nMock.setLocale).toHaveBeenCalledExactlyOnceWith("fr");
  });

  it.each<{ action: "accept" | "decline"; actionIndex: number; expectedCookieValue: string; localeKind: string }>([
    { action: "accept", actionIndex: 0, expectedCookieValue: "fr", localeKind: "suggested" },
    { action: "decline", actionIndex: 1, expectedCookieValue: "en", localeKind: "current" },
  ])("should persist the $localeKind locale to the cookie when the $action action is clicked.", async({ actionIndex, expectedCookieValue }) => {
    stubNavigatorLanguages(["fr-FR", "fr"]);
    await useLocaleSuggestion();

    callOnClick(getAddedToastArguments()?.actions?.[actionIndex]?.onClick);

    expect(useCookieMockState.cookieRef.value).toBe(expectedCookieValue);
  });

  it.each<{ action: "accept" | "decline"; actionIndex: number }>([
    { action: "accept", actionIndex: 0 },
    { action: "decline", actionIndex: 1 },
  ])("should close the toast when the $action action is clicked.", async({ actionIndex }) => {
    stubNavigatorLanguages(["fr-FR", "fr"]);
    await useLocaleSuggestion();

    callOnClick(getAddedToastArguments()?.actions?.[actionIndex]?.onClick);

    expect(useAppToastMock.removeToast).toHaveBeenCalledExactlyOnceWith(MOCKED_TOAST_ID);
  });

  it.each<{ action: string; condition: string; expectedCookieValue: string | null; open: boolean }>([
    { action: "persist the current locale to the cookie", condition: "the toast is closed without answering", expectedCookieValue: "en", open: false },
    { action: "keep the cookie untouched", condition: "the toast open update emits while open", expectedCookieValue: null, open: true },
  ])("should $action when $condition.", async({ expectedCookieValue, open }) => {
    stubNavigatorLanguages(["fr-FR", "fr"]);
    await useLocaleSuggestion();

    getAddedToastArguments()?.["onUpdate:open"]?.(open);

    expect(useCookieMockState.cookieRef.value).toBe(expectedCookieValue);
  });

  it("should not overwrite the cookie when the toast is closed after the accept action was clicked.", async() => {
    stubNavigatorLanguages(["fr-FR", "fr"]);
    await useLocaleSuggestion();
    const toastArguments = getAddedToastArguments();

    callOnClick(toastArguments?.actions?.[0]?.onClick);
    toastArguments?.["onUpdate:open"]?.(false);

    expect(useCookieMockState.cookieRef.value).toBe("fr");
  });
});