import {
  PWA_MANIFEST_HOME_TRANSLATIONS_SCHEMA,
  PWA_MANIFEST_SEO_TRANSLATIONS_SCHEMA,
} from "#shared/utils/helpers/pwa/manifest/pwa-manifest.constants.ts";
import type {
  PwaManifestLocaleFileReader,
  PwaManifestTranslations,
} from "#shared/utils/helpers/pwa/manifest/pwa-manifest.types.ts";

/**
 * Loads and validates the default-locale translations used by the web app manifest.
 *
 * @param readLocaleFile - Reads one locale namespace file and returns its raw JSON payload.
 * @throws When a namespace payload does not match the expected translation shape.
 */
function loadPwaManifestTranslations(readLocaleFile: PwaManifestLocaleFileReader): PwaManifestTranslations {
  const homeTranslations = PWA_MANIFEST_HOME_TRANSLATIONS_SCHEMA.parse(readLocaleFile("home.json"));
  const seoTranslations = PWA_MANIFEST_SEO_TRANSLATIONS_SCHEMA.parse(readLocaleFile("seo.json"));

  return {
    name: seoTranslations.seo.home.title,
    description: seoTranslations.seo.home.description,
    shortcutName: homeTranslations.home.playButton,
  };
}

export { loadPwaManifestTranslations };