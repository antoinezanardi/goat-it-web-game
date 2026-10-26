import { describe, expect, it } from "vitest";
import { ZodError } from "zod";

import { loadPwaManifestTranslations } from "#shared/utils/helpers/pwa/manifest/load-pwa-manifest-translations.helpers.ts";
import type { PwaManifestLocaleFileReader } from "#shared/utils/helpers/pwa/manifest/pwa-manifest.types.ts";

const PWA_MANIFEST_VALID_HOME_TRANSLATIONS = {
  home: { playButton: "Jouer" },
};

const PWA_MANIFEST_VALID_SEO_TRANSLATIONS = {
  seo: {
    home: {
      title: "Goat It – Le jeu où la réponse se devine",
      description: "Goat It est un jeu de déduction basé sur des faits insolites.",
    },
  },
};

function createReadLocaleFile(payloads: Record<string, unknown>): PwaManifestLocaleFileReader {
  return (fileName: string): unknown => payloads[fileName];
}

describe(loadPwaManifestTranslations, () => {
  it("should return the flattened manifest translations when both namespace payloads are valid.", () => {
    const readLocaleFile = createReadLocaleFile({
      "home.json": PWA_MANIFEST_VALID_HOME_TRANSLATIONS,
      "seo.json": PWA_MANIFEST_VALID_SEO_TRANSLATIONS,
    });

    expect(loadPwaManifestTranslations(readLocaleFile)).toStrictEqual({
      name: PWA_MANIFEST_VALID_SEO_TRANSLATIONS.seo.home.title,
      description: PWA_MANIFEST_VALID_SEO_TRANSLATIONS.seo.home.description,
      shortcutName: PWA_MANIFEST_VALID_HOME_TRANSLATIONS.home.playButton,
    });
  });

  it("should throw a ZodError when the home namespace payload is invalid.", () => {
    const readLocaleFile = createReadLocaleFile({
      "home.json": { home: {} },
      "seo.json": PWA_MANIFEST_VALID_SEO_TRANSLATIONS,
    });

    expect(() => loadPwaManifestTranslations(readLocaleFile)).toThrow(ZodError);
  });

  it("should throw a ZodError when the SEO namespace payload is invalid.", () => {
    const readLocaleFile = createReadLocaleFile({
      "home.json": PWA_MANIFEST_VALID_HOME_TRANSLATIONS,
      "seo.json": { seo: {} },
    });

    expect(() => loadPwaManifestTranslations(readLocaleFile)).toThrow(ZodError);
  });
});