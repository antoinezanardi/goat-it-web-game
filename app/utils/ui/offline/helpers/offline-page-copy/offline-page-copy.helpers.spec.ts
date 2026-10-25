import { describe, expect, it } from "vitest";
import type { Locale } from "@goat-it/schemas/shared/locale";

import { DEFAULT_LOCALE_FALLBACK } from "#shared/constants/locale.constants";
import { resolveOfflinePageCopy } from "@/utils/ui/offline/helpers/offline-page-copy/offline-page-copy.helpers";
import { OFFLINE_PAGE_COPY } from "@/utils/ui/offline/offline-page.constants";
import type { OfflinePageCopy } from "@/utils/ui/offline/offline-page.types";

describe(resolveOfflinePageCopy, () => {
  it.each<[Locale, OfflinePageCopy]>([
    ["en", OFFLINE_PAGE_COPY.en],
    ["fr", OFFLINE_PAGE_COPY.fr],
  ])("should return the %s copy when the configured locale is supported.", (locale, expectedCopy) => {
    expect(resolveOfflinePageCopy(locale)).toStrictEqual(expectedCopy);
  });

  it("should fall back to the default locale copy when the configured locale is unsupported.", () => {
    expect(resolveOfflinePageCopy("ja")).toStrictEqual(OFFLINE_PAGE_COPY[DEFAULT_LOCALE_FALLBACK]);
  });

  it("should fall back to the default locale copy when the configured locale is missing.", () => {
    expect(resolveOfflinePageCopy(undefined)).toStrictEqual(OFFLINE_PAGE_COPY[DEFAULT_LOCALE_FALLBACK]);
  });
});