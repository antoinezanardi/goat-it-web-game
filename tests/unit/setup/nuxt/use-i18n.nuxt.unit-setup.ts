/**
 * UseI18n mock setup — Defense-in-depth against flaky i18n tests.
 *
 * ## Problem
 * Under Vitest with `pool: "threads"` and `isolate: false`, tests sharing the same thread
 * also share the Nuxt runtime instance. The `@nuxtjs/i18n` plugin (`route-locale-detect`)
 * registers a global `locale-changing` middleware that calls `loadAndSetLocale` on every
 * route navigation. Because `mountSuspended` triggers `router.replace(route)`, this
 * middleware fires and calls `i18n.mergeLocaleMessage(locale, messages)` — loading real
 * translated strings into the shared vue-i18n composer.
 *
 * When this happens between tests (or concurrently across spec files in the same thread),
 * components rendered by `mountSuspended` may resolve `t("some.key")` to the actual
 * translated text (e.g. "Other translations") instead of the expected key string
 * (e.g. "localization.otherTranslations"), causing flaky assertion failures.
 *
 * ## Solution
 * Two complementary layers:
 *
 * 1. **Mock `useI18n`** via `mockNuxtImport` so components get a stub `t(key) => key`.
 *    This is the primary protection: components call the mock, not the real composer.
 *
 * 2. **Neutralize the real composer** in `beforeAll`:
 *    - Clear all locale messages so the composer has no translations to return.
 *    - Patch `mergeLocaleMessage` and `setLocaleMessage` to no-ops so the navigation
 *      middleware cannot reload messages, even if it fires.
 *
 *    This is the secondary protection: if `mockNuxtImport` intermittently fails to
 *    intercept (rare race under `isolate: false` + `mockReset: true`), the real
 *    composer still has no messages and `t(key)` falls back to returning the key.
 *
 * The Nuxt app instance is accessed via the internal `unjs/unctx` context system
 * (`globalThis.__unctx__`) since there is no public API to reach it from setup files.
 */

import { mockNuxtImport } from "@nuxt/test-utils/runtime";
import { beforeAll, beforeEach } from "vitest";

import { createUseI18nMock } from "~~/tests/unit/utils/mocks/composables/nuxt/useI18n/useI18n.mock";
import type { UseI18nMock } from "~~/tests/unit/utils/mocks/composables/nuxt/useI18n/useI18n.mock";

type I18nComposer = {
  availableLocales: string[];
  setLocaleMessage: (locale: string, messages: Record<string, unknown>) => void;
  mergeLocaleMessage: (locale: string, messages: Record<string, unknown>) => void;
};

type NuxtApp = {
  $i18n?: I18nComposer;
};

type UnctxContext = {
  get: (key: string) => { tryUse: () => NuxtApp | undefined } | undefined;
};

const UNCTX_CONTEXT_KEY = "\u005F\u005Functx\u005F\u005F";

function noop(): void {
  return undefined;
}

function getUnctx(): UnctxContext | undefined {
  const unctx: unknown = Reflect.get(globalThis, UNCTX_CONTEXT_KEY);

  if (unctx !== null && typeof unctx === "object" && "get" in unctx && typeof unctx.get === "function") {
    // Acceptable as unctx is an internal unjs/unctx context system with no exported types
    // oxlint-disable-next-line typescript/no-unsafe-type-assertion
    return unctx as UnctxContext;
  }
  return undefined;
}

let i18nMock = createUseI18nMock();

mockNuxtImport("useI18n", () => (): UseI18nMock => i18nMock);

beforeAll(() => {
  try {
    const nuxtApp = getUnctx()?.get("nuxt-app")?.tryUse();
    const i18n = nuxtApp?.$i18n;

    if (i18n) {
      for (const locale of i18n.availableLocales) {
        i18n.setLocaleMessage(locale, {});
      }
      i18n.mergeLocaleMessage = noop;
      i18n.setLocaleMessage = noop;
    }
  } catch {
    // Silently ignore if Nuxt app or i18n is not yet available
  }
});

beforeEach(() => {
  i18nMock = createUseI18nMock();
});