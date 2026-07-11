import { readFileSync } from "node:fs";
import path from "node:path";

import { describe, it, expect } from "vitest";

const currentDirectory = import.meta.dirname;
const LOCALE_DIR = path.resolve(currentDirectory, "../locales");

const LOCALES = ["de", "en", "es", "fr", "it", "pt"] as const satisfies readonly string[];

type Locale = (typeof LOCALES)[number];

const NAMESPACES = ["home", "game", "common", "errors", "question-themes", "questions"] as const satisfies readonly string[];

type Namespace = (typeof NAMESPACES)[number];

const ROOT_KEY_MAP: Record<string, string> = {
  "question-themes": "questionThemes",
};

function loadJson(locale: string, namespace: string): Record<string, unknown> {
  const filePath = path.resolve(LOCALE_DIR, locale, `${namespace}.json`);
  const raw = readFileSync(filePath, "utf8");

  return JSON.parse(raw) as Record<string, unknown>;
}

function flattenKeys(object: Record<string, unknown>, prefix = ""): string[] {
  const keys: string[] = [];

  for (const [key, value] of Object.entries(object)) {
    const fullKey = prefix ? `${prefix}.${key}` : key;

    if (value !== null && typeof value === "object" && !Array.isArray(value)) {
      keys.push(fullKey, ...flattenKeys(value as Record<string, unknown>, fullKey));
    } else {
      keys.push(fullKey);
    }
  }
  return keys;
}

function getKeys(locale: string, namespace: string): string[] {
  const data = loadJson(locale, namespace);
  const rootKey = ROOT_KEY_MAP[namespace] ?? namespace;
  const root = data[rootKey];

  if (root === null || root === undefined || typeof root !== "object") {
    return [];
  }
  return flattenKeys(root as Record<string, unknown>);
}

function buildAllKeys(): Record<Namespace, Record<Locale, string[]>> {
  const allKeys = {} as Record<Namespace, Record<Locale, string[]>>;

  for (const namespace of NAMESPACES) {
    allKeys[namespace] = {} as Record<Locale, string[]>;

    for (const locale of LOCALES) {
      allKeys[namespace][locale] = getKeys(locale, namespace);
    }
  }
  return allKeys;
}

const allKeys = buildAllKeys();

function nonEnglishLocales(): Locale[] {
  return LOCALES.filter(locale => locale !== "en");
}

describe("Translation parity", () => {
  describe.each(NAMESPACES)("namespace: %s", (namespace: Namespace) => {
    describe("key count parity", () => {
      it.each(LOCALES)("should have the same number of keys as English when loading $locale locale.", (locale: Locale) => {
        expect(allKeys[namespace][locale]).toHaveLength(allKeys[namespace].en.length);
      });
    });

    describe("key set parity", () => {
      it.each(nonEnglishLocales())("should have identical key set compared to English when loading $locale locale.", (locale: Locale) => {
        const localeKeys = allKeys[namespace][locale];
        const englishKeys = allKeys[namespace].en;
        const localeSet = new Set(localeKeys);
        const englishSet = new Set(englishKeys);
        const missing = englishKeys.filter(key => !localeSet.has(key));
        const extra = localeKeys.filter(key => !englishSet.has(key));
        const discrepancies = [...missing.map(key => `missing: ${key}`), ...extra.map(key => `extra: ${key}`)];

        expect(discrepancies).toStrictEqual([]);
      });
    });
  });
});