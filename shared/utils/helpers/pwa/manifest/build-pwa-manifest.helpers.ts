import { SITE_NAME } from "#shared/constants/site.constants.ts";
import {
  PWA_MANIFEST_BACKGROUND_COLOR,
  PWA_MANIFEST_CATEGORIES,
  PWA_MANIFEST_DIR,
  PWA_MANIFEST_DISPLAY,
  PWA_MANIFEST_DISPLAY_OVERRIDE,
  PWA_MANIFEST_ICONS,
  PWA_MANIFEST_ID,
  PWA_MANIFEST_ORIENTATION,
  PWA_MANIFEST_SCREENSHOTS,
  PWA_MANIFEST_SCOPE,
  PWA_MANIFEST_SHORTCUT_ICONS,
  PWA_MANIFEST_SHORTCUT_URL,
  PWA_MANIFEST_START_URL,
  PWA_MANIFEST_THEME_COLOR,
} from "#shared/utils/helpers/pwa/manifest/pwa-manifest.constants.ts";
import type { BuildPwaManifestOptions, PwaManifest } from "#shared/utils/helpers/pwa/manifest/pwa-manifest.types.ts";

/**
 * Builds the localized web app manifest for the default locale.
 *
 * Runtime locale changes do not rebuild this manifest; it is a build-time artifact.
 */
function buildPwaManifest(options: BuildPwaManifestOptions): PwaManifest {
  return {
    id: PWA_MANIFEST_ID,
    name: options.translations.name,
    short_name: SITE_NAME,
    description: options.translations.description,
    theme_color: PWA_MANIFEST_THEME_COLOR,
    background_color: PWA_MANIFEST_BACKGROUND_COLOR,
    display: PWA_MANIFEST_DISPLAY,
    display_override: [...PWA_MANIFEST_DISPLAY_OVERRIDE],
    orientation: PWA_MANIFEST_ORIENTATION,
    scope: PWA_MANIFEST_SCOPE,
    start_url: PWA_MANIFEST_START_URL,
    lang: options.locale,
    dir: PWA_MANIFEST_DIR,
    icons: [...PWA_MANIFEST_ICONS],
    screenshots: [...PWA_MANIFEST_SCREENSHOTS],
    shortcuts: [
      {
        name: options.translations.shortcutName,
        short_name: options.translations.shortcutName,
        url: PWA_MANIFEST_SHORTCUT_URL,
        icons: [...PWA_MANIFEST_SHORTCUT_ICONS],
      },
    ],
    categories: [...PWA_MANIFEST_CATEGORIES],
  };
}

export { buildPwaManifest };