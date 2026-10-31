import { z } from "zod";

import type {
  PwaManifestDisplayOverride,
  PwaManifestIcon,
  PwaManifestScreenshot,
} from "#shared/utils/helpers/pwa/manifest/pwa-manifest.types.ts";

const PWA_MANIFEST_HOME_NAMESPACE_SCHEMA = z.object({ playButton: z.string() });
const PWA_MANIFEST_HOME_TRANSLATIONS_SCHEMA = z.object({ home: PWA_MANIFEST_HOME_NAMESPACE_SCHEMA });

const PWA_MANIFEST_SEO_HOME_SCHEMA = z.object({
  title: z.string(),
  description: z.string(),
});
const PWA_MANIFEST_SEO_NAMESPACE_SCHEMA = z.object({ home: PWA_MANIFEST_SEO_HOME_SCHEMA });
const PWA_MANIFEST_SEO_TRANSLATIONS_SCHEMA = z.object({ seo: PWA_MANIFEST_SEO_NAMESPACE_SCHEMA });

const PWA_MANIFEST_ID = "/";
const PWA_MANIFEST_SCOPE = "/";
const PWA_MANIFEST_START_URL = "/";
const PWA_MANIFEST_THEME_COLOR = "#09090b";
const PWA_MANIFEST_BACKGROUND_COLOR = "#09090b";
const PWA_MANIFEST_DISPLAY = "standalone";
const PWA_MANIFEST_DISPLAY_OVERRIDE: readonly PwaManifestDisplayOverride[] = ["standalone", "minimal-ui"];
const PWA_MANIFEST_ORIENTATION = "any";
const PWA_MANIFEST_DIR = "ltr";
const PWA_MANIFEST_CATEGORIES = ["games"];
const PWA_MANIFEST_SHORTCUT_URL = "/game";

const PWA_MANIFEST_ICONS: readonly PwaManifestIcon[] = [
  { src: "/pwa/pwa-192x192.png", sizes: "192x192", type: "image/png" },
  { src: "/pwa/pwa-512x512.png", sizes: "512x512", type: "image/png" },
  { src: "/pwa/pwa-512x512-maskable.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
];

const PWA_MANIFEST_SCREENSHOTS: readonly PwaManifestScreenshot[] = [
  { src: "/pwa/screenshot-home.png", sizes: "1280x720", type: "image/png", form_factor: "wide" },
  { src: "/pwa/screenshot-game.png", sizes: "1280x720", type: "image/png", form_factor: "wide" },
];

const PWA_MANIFEST_SHORTCUT_ICONS: readonly PwaManifestIcon[] = [{ src: "/pwa/pwa-192x192.png", sizes: "192x192" }];

export {
  PWA_MANIFEST_BACKGROUND_COLOR,
  PWA_MANIFEST_CATEGORIES,
  PWA_MANIFEST_DIR,
  PWA_MANIFEST_DISPLAY,
  PWA_MANIFEST_DISPLAY_OVERRIDE,
  PWA_MANIFEST_HOME_TRANSLATIONS_SCHEMA,
  PWA_MANIFEST_ICONS,
  PWA_MANIFEST_ID,
  PWA_MANIFEST_ORIENTATION,
  PWA_MANIFEST_SCREENSHOTS,
  PWA_MANIFEST_SCOPE,
  PWA_MANIFEST_SEO_TRANSLATIONS_SCHEMA,
  PWA_MANIFEST_SHORTCUT_ICONS,
  PWA_MANIFEST_SHORTCUT_URL,
  PWA_MANIFEST_START_URL,
  PWA_MANIFEST_THEME_COLOR,
};