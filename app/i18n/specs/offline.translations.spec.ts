import { crush } from "radashi";
import { describe, it, expect } from "vitest";

import frOffline from "~/i18n/locales/fr/offline.json";
import enOffline from "~/i18n/locales/en/offline.json";
import deOffline from "~/i18n/locales/de/offline.json";
import esOffline from "~/i18n/locales/es/offline.json";
import itOffline from "~/i18n/locales/it/offline.json";
import ptOffline from "~/i18n/locales/pt/offline.json";

describe("offline.json translations", () => {
  it.each<[string, typeof frOffline]>([
    ["de", deOffline],
    ["en", enOffline],
    ["es", esOffline],
    ["it", itOffline],
    ["pt", ptOffline],
  ])("should have the same keys in every locale as in french when context is offline.", (_locale, offlineTranslations) => {
    const crushedReferenceKeys = Object.keys(crush(frOffline)).toSorted();
    const crushedOfflineKeys = Object.keys(crush(offlineTranslations)).toSorted();

    expect(crushedOfflineKeys).toStrictEqual<string[]>(crushedReferenceKeys);
  });
});