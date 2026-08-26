import { mockNuxtImport } from "@nuxt/test-utils/runtime";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { createUseCookieMockState } from "~~/tests/unit/utils/mocks/composables/nuxt/useCookie/useCookie.mock";
import { MOCKED_TOAST_ID } from "~~/tests/unit/utils/mocks/composables/nuxt/useToast/useToast.mock";
import type { UseCookieMockState } from "~~/tests/unit/utils/mocks/composables/nuxt/useCookie/useCookie.mock";

import type { useLocaleSuggestion as UseLocaleSuggestionType } from "@/composables/ui/useLocaleSuggestion/useLocaleSuggestion";
import type { Toast } from "#ui/composables";

type I18nStub = {
  t: ReturnType<typeof vi.fn>;
  locale: { value: string };
  setLocale: ReturnType<typeof vi.fn>;
  loadLocaleMessages: ReturnType<typeof vi.fn>;
};

const i18nStub: I18nStub = {
  t: vi.fn<(key: string) => string>((key: string) => key),
  locale: { value: "en" },
  setLocale: vi.fn<() => void>(),
  loadLocaleMessages: vi.fn<() => undefined>(() => undefined),
};

const useNuxtAppMock = (): { $i18n: I18nStub } => ({ $i18n: i18nStub });

// Acceptable as import() form is required to mock a module from a factory with importOriginal
// oxlint-disable-next-line vitest/prefer-import-in-mock
vi.mock(import("#app/nuxt"), async importOriginal => {
  const actual = await importOriginal();

  return { ...actual, useNuxtApp: useNuxtAppMock as unknown as typeof actual.useNuxtApp };
});

// Acceptable as the composable returns CookieRef<string | null> and null is the required initial state
// oxlint-disable-next-line unicorn/no-null
const useCookieMockState: UseCookieMockState<string | null> = createUseCookieMockState<string | null>(null);

mockNuxtImport("useCookie", () => (name: string, options?: Record<string, unknown>): { value: string | null } => {
  useCookieMockState.capturedName.current = name;
  useCookieMockState.capturedOptions.current = options;

  return useCookieMockState.cookieRef;
});

let useLocaleSuggestion: typeof UseLocaleSuggestionType;

function stubNavigatorLanguages(languages: string[]): void {
  vi.stubGlobal("navigator", { languages });
}

function getAddedToastArguments(): Partial<Toast> | undefined {
  return vi.mocked(useToast().add).mock.calls[0]?.[0];
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

    expect(useCookieMockState.capturedOptions.current).toStrictEqual({ path: "/", maxAge: 31_536_000, sameSite: "lax" });
  });

  it("should not add a toast when the i18n_redirected cookie holds a valid locale.", async() => {
    useCookieMockState.cookieRef.value = "fr";

    await useLocaleSuggestion();

    expect(useToast().add).not.toHaveBeenCalled();
  });

  it("should not add a toast when the i18n_redirected cookie holds the current locale.", async() => {
    useCookieMockState.cookieRef.value = "en";

    await useLocaleSuggestion();

    expect(useToast().add).not.toHaveBeenCalled();
  });

  it("should proceed to the suggestion flow when the i18n_redirected cookie holds an invalid locale.", async() => {
    useCookieMockState.cookieRef.value = "FR";
    stubNavigatorLanguages(["fr-FR", "fr"]);

    await useLocaleSuggestion();

    expect(useToast().add).toHaveBeenCalledExactlyOnceWith(expect.objectContaining({ title: "common.localeSuggestion.title" }));
  });

  it("should add a sticky background toast proposing the suggested locale when browser languages differ from the current locale.", async() => {
    stubNavigatorLanguages(["fr-FR", "fr"]);

    await useLocaleSuggestion();

    expect(useToast().add).toHaveBeenCalledExactlyOnceWith({
      "title": "common.localeSuggestion.title",
      "description": "common.localeSuggestion.description",
      "type": "background",
      "duration": 0,
      "data-nosnippet": "true",
      "actions": [
        { label: "common.localeSuggestion.accept", onClick: expect.any(Function) as () => void },
        { label: "common.localeSuggestion.decline", onClick: expect.any(Function) as () => void },
      ],
      "onUpdate:open": expect.any(Function) as (open: boolean) => void,
    });
  });

  it("should load the suggested locale messages before adding the toast when browser languages differ from the current locale.", async() => {
    stubNavigatorLanguages(["fr-FR", "fr"]);

    await useLocaleSuggestion();

    expect(i18nStub.loadLocaleMessages).toHaveBeenCalledExactlyOnceWith("fr");
  });

  it("should render the toast title in the suggested locale when adding the suggestion toast.", async() => {
    stubNavigatorLanguages(["fr-FR", "fr"]);

    await useLocaleSuggestion();

    expect(i18nStub.t).toHaveBeenNthCalledWith(1, "common.localeSuggestion.title", {}, { locale: "fr" });
  });

  it("should not add a toast when no browser language matches a supported locale.", async() => {
    stubNavigatorLanguages(["ja-JP", "ja"]);

    await useLocaleSuggestion();

    expect(useToast().add).not.toHaveBeenCalled();
  });

  it("should not add a toast when the suggested locale equals the current locale.", async() => {
    stubNavigatorLanguages(["en-US"]);

    await useLocaleSuggestion();

    expect(useToast().add).not.toHaveBeenCalled();
  });

  it("should switch the locale to the suggested one when the accept action is clicked.", async() => {
    stubNavigatorLanguages(["fr-FR", "fr"]);
    await useLocaleSuggestion();

    callOnClick(getAddedToastArguments()?.actions?.[0]?.onClick);

    expect(i18nStub.setLocale).toHaveBeenCalledExactlyOnceWith("fr");
  });

  it("should persist the suggested locale to the cookie when the accept action is clicked.", async() => {
    stubNavigatorLanguages(["fr-FR", "fr"]);
    await useLocaleSuggestion();

    callOnClick(getAddedToastArguments()?.actions?.[0]?.onClick);

    expect(useCookieMockState.cookieRef.value).toBe("fr");
  });

  it("should close the toast when the accept action is clicked.", async() => {
    stubNavigatorLanguages(["fr-FR", "fr"]);
    await useLocaleSuggestion();

    callOnClick(getAddedToastArguments()?.actions?.[0]?.onClick);

    expect(useToast().remove).toHaveBeenCalledExactlyOnceWith(MOCKED_TOAST_ID);
  });

  it("should persist the current locale to the cookie when the decline action is clicked.", async() => {
    stubNavigatorLanguages(["fr-FR", "fr"]);
    await useLocaleSuggestion();

    callOnClick(getAddedToastArguments()?.actions?.[1]?.onClick);

    expect(useCookieMockState.cookieRef.value).toBe("en");
  });

  it("should close the toast when the decline action is clicked.", async() => {
    stubNavigatorLanguages(["fr-FR", "fr"]);
    await useLocaleSuggestion();

    callOnClick(getAddedToastArguments()?.actions?.[1]?.onClick);

    expect(useToast().remove).toHaveBeenCalledExactlyOnceWith(MOCKED_TOAST_ID);
  });

  it("should persist the current locale to the cookie when the toast is closed without answering.", async() => {
    stubNavigatorLanguages(["fr-FR", "fr"]);
    await useLocaleSuggestion();

    getAddedToastArguments()?.["onUpdate:open"]?.(false);

    expect(useCookieMockState.cookieRef.value).toBe("en");
  });

  it("should keep the cookie untouched when the toast open update emits while open.", async() => {
    stubNavigatorLanguages(["fr-FR", "fr"]);
    await useLocaleSuggestion();

    getAddedToastArguments()?.["onUpdate:open"]?.(true);

    expect(useCookieMockState.cookieRef.value).toBeNull();
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