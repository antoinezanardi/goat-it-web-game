import { crush } from "radashi";
import { describe, it, expect } from "vitest";

import frGame from "~/i18n/locales/fr/game.json";
import enGame from "~/i18n/locales/en/game.json";
import deGame from "~/i18n/locales/de/game.json";
import esGame from "~/i18n/locales/es/game.json";
import itGame from "~/i18n/locales/it/game.json";
import ptGame from "~/i18n/locales/pt/game.json";

describe("game.json translations", () => {
  it.each<[string, typeof frGame]>([
    ["de", deGame],
    ["en", enGame],
    ["es", esGame],
    ["it", itGame],
    ["pt", ptGame],
  ])("should have the same keys in every locale as in french when context is game.", (_locale, gameTranslations) => {
    const crushedReferenceKeys = Object.keys(crush(frGame)).toSorted();
    const crushedGameKeys = Object.keys(crush(gameTranslations)).toSorted();

    expect(crushedGameKeys).toStrictEqual<string[]>(crushedReferenceKeys);
  });
});