import { describe, expect, it } from "vitest";

import { buildPwaManifest } from "#shared/utils/helpers/pwa/manifest/build-pwa-manifest.helpers.ts";
import type { PwaManifestTranslations } from "#shared/utils/helpers/pwa/manifest/pwa-manifest.types.ts";

const PWA_MANIFEST_TEST_TRANSLATIONS: PwaManifestTranslations = {
  name: "Goat It – Le jeu où la réponse se devine",
  description: "Goat It est un jeu de déduction basé sur des faits insolites.",
  shortcutName: "Jouer",
};

describe(buildPwaManifest, () => {
  it("should use the localized translations and locale when translations are provided.", () => {
    const manifest = buildPwaManifest({ locale: "fr", translations: PWA_MANIFEST_TEST_TRANSLATIONS });

    expect({
      description: manifest.description,
      lang: manifest.lang,
      name: manifest.name,
      shortcutName: manifest.shortcuts[0]?.name,
      shortcutShortName: manifest.shortcuts[0]?.short_name,
    }).toStrictEqual({
      description: PWA_MANIFEST_TEST_TRANSLATIONS.description,
      lang: "fr",
      name: PWA_MANIFEST_TEST_TRANSLATIONS.name,
      shortcutName: PWA_MANIFEST_TEST_TRANSLATIONS.shortcutName,
      shortcutShortName: PWA_MANIFEST_TEST_TRANSLATIONS.shortcutName,
    });
  });

  it("should include the static install metadata when built.", () => {
    const manifest = buildPwaManifest({ locale: "en", translations: PWA_MANIFEST_TEST_TRANSLATIONS });

    expect({
      backgroundColor: manifest.background_color,
      categories: manifest.categories,
      dir: manifest.dir,
      display: manifest.display,
      displayOverride: manifest.display_override,
      icons: manifest.icons,
      id: manifest.id,
      orientation: manifest.orientation,
      scope: manifest.scope,
      screenshots: manifest.screenshots,
      shortName: manifest.short_name,
      shortcutIcons: manifest.shortcuts[0]?.icons,
      shortcutUrl: manifest.shortcuts[0]?.url,
      startUrl: manifest.start_url,
      themeColor: manifest.theme_color,
    }).toStrictEqual({
      backgroundColor: "#09090b",
      categories: ["games"],
      dir: "ltr",
      display: "standalone",
      displayOverride: ["standalone", "minimal-ui"],
      icons: [
        { src: "/pwa/pwa-192x192.png", sizes: "192x192", type: "image/png" },
        { src: "/pwa/pwa-512x512.png", sizes: "512x512", type: "image/png" },
        { src: "/pwa/pwa-512x512-maskable.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
      ],
      id: "/",
      orientation: "any",
      scope: "/",
      screenshots: [
        { src: "/pwa/screenshot-home.png", sizes: "1280x720", type: "image/png", form_factor: "wide" },
        { src: "/pwa/screenshot-game.png", sizes: "1280x720", type: "image/png", form_factor: "wide" },
      ],
      shortName: "Goat It",
      shortcutIcons: [{ src: "/pwa/pwa-192x192.png", sizes: "192x192" }],
      shortcutUrl: "/game",
      startUrl: "/",
      themeColor: "#09090b",
    });
  });
});