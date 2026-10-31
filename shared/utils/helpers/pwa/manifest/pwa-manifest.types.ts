import type { Locale } from "@goat-it/schemas/shared/locale";

/**
 * Localized strings used by the web app manifest.
 */
type PwaManifestTranslations = {
  /** Installed application name. */
  name: string;
  /** Installed application description. */
  description: string;
  /** Label of the play shortcut. */
  shortcutName: string;
};

/**
 * Input for building the localized web app manifest.
 */
type BuildPwaManifestOptions = {
  /** Default locale the manifest is generated for. */
  locale: Locale;
  translations: PwaManifestTranslations;
};

/**
 * Reads one locale namespace file and returns its raw JSON payload.
 */
type PwaManifestLocaleFileReader = (fileName: string) => unknown;

type PwaManifestDisplayOverride = "standalone" | "minimal-ui";

type PwaManifestIconPurpose = "any" | "maskable" | "monochrome";

/**
 * Image resource declared in the web app manifest.
 */
type PwaManifestIcon = {
  src: string;
  sizes: string;
  type?: string;
  purpose?: PwaManifestIconPurpose;
};

/**
 * Install-prompt screenshot declared in the web app manifest.
 */
type PwaManifestScreenshot = {
  src: string;
  sizes: string;
  type?: string;
  form_factor?: "narrow" | "wide";
};

/**
 * Launcher shortcut declared in the web app manifest.
 */
type PwaManifestShortcut = {
  name: string;
  short_name?: string;
  url: string;
  icons?: PwaManifestIcon[];
};

/**
 * Web app manifest generated for the default locale.
 */
type PwaManifest = {
  id: string;
  name: string;
  short_name: string;
  description: string;
  theme_color: string;
  background_color: string;
  display: "standalone";
  display_override: PwaManifestDisplayOverride[];
  orientation: "any";
  scope: string;
  start_url: string;
  lang: Locale;
  dir: "ltr";
  icons: PwaManifestIcon[];
  screenshots: PwaManifestScreenshot[];
  shortcuts: PwaManifestShortcut[];
  categories: string[];
};

export type {
  BuildPwaManifestOptions,
  PwaManifest,
  PwaManifestDisplayOverride,
  PwaManifestIcon,
  PwaManifestLocaleFileReader,
  PwaManifestScreenshot,
  PwaManifestTranslations,
};