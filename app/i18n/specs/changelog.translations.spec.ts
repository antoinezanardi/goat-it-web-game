import { crush } from "radashi";
import { describe, it, expect } from "vitest";

import frChangelog from "~/i18n/locales/fr/changelog.json";
import enChangelog from "~/i18n/locales/en/changelog.json";
import deChangelog from "~/i18n/locales/de/changelog.json";
import esChangelog from "~/i18n/locales/es/changelog.json";
import itChangelog from "~/i18n/locales/it/changelog.json";
import ptChangelog from "~/i18n/locales/pt/changelog.json";

describe("changelog.json translations", () => {
  it.each<[string, typeof frChangelog]>([
    ["de", deChangelog],
    ["en", enChangelog],
    ["es", esChangelog],
    ["it", itChangelog],
    ["pt", ptChangelog],
  ])("should have the same keys in every locale as in french when context is changelog.", (_locale, changelogTranslations) => {
    const crushedReferenceKeys = Object.keys(crush(frChangelog)).toSorted();
    const crushedChangelogKeys = Object.keys(crush(changelogTranslations)).toSorted();

    expect(crushedChangelogKeys).toStrictEqual<string[]>(crushedReferenceKeys);
  });
});