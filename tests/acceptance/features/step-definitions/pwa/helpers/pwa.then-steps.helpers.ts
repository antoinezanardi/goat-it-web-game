import { readFileSync, statSync } from "node:fs";
import path from "node:path";

import { expect } from "@playwright/test";
import type { Page } from "@playwright/test";
import { z } from "zod";

import { ACCEPTANCE_TESTS_DEFAULT_LOCALE } from "#acceptance/features/support/constants/hooks.constants.ts";
import {
  PWA_BUILD_OFFLINE_FALLBACK_FILE,
  PWA_BUILD_PUBLIC_DIRECTORY,
  PWA_BUILD_SERVICE_WORKER_FILE,
  PWA_LOCALES_DIRECTORY,
  PWA_NON_EXECUTABLE_SCRIPT_TYPES,
  PWA_OFFLINE_FALLBACK_PATH,
  PWA_PRECACHE_MAXIMUM_BYTES,
  PWA_PRECACHE_MAXIMUM_ENTRY_COUNT,
  PWA_PRELOADED_FONT_PATH,
} from "#acceptance/features/step-definitions/pwa/pwa.steps.constants.ts";

const PWA_MANIFEST_SHORTCUT_SCHEMA = z.object({ name: z.string() });
const PWA_MANIFEST_SHORTCUTS_SCHEMA = z.array(PWA_MANIFEST_SHORTCUT_SCHEMA).min(1);
const PWA_MANIFEST_SCHEMA = z.object({
  description: z.string(),
  dir: z.string(),
  display_override: z.array(z.string()),
  id: z.string(),
  lang: z.string(),
  name: z.string(),
  shortcuts: PWA_MANIFEST_SHORTCUTS_SCHEMA,
});

const PWA_HOME_TRANSLATIONS_SCHEMA = z.object({
  home: z.object({ playButton: z.string() }),
});

const PWA_SEO_HOME_TRANSLATIONS_SCHEMA = z.object({
  title: z.string(),
  description: z.string(),
});
const PWA_SEO_TRANSLATIONS_SCHEMA = z.object({
  seo: z.object({ home: PWA_SEO_HOME_TRANSLATIONS_SCHEMA }),
});

function readBuildOutputFile(relativePath: string): string {
  return readFileSync(path.join(PWA_BUILD_PUBLIC_DIRECTORY, relativePath), "utf8");
}

function readLocaleJson(fileName: string): unknown {
  const fileContent: unknown = JSON.parse(readFileSync(path.join(PWA_LOCALES_DIRECTORY, ACCEPTANCE_TESTS_DEFAULT_LOCALE, fileName), "utf8"));

  return fileContent;
}

async function expectHeadLinkHref(page: Page, linkRelationship: string, href: string): Promise<void> {
  await expect(page.locator(`head link[rel="${linkRelationship}"]`)).toHaveAttribute("href", href);
}

async function expectHeadMetaContent(page: Page, name: string, content: string | RegExp): Promise<void> {
  await expect(page.locator(`head meta[name="${name}"]`)).toHaveAttribute("content", content);
}

function hasExecutableScript(document: string): boolean {
  return [...document.matchAll(/<script\b[^>]*>/giu)].some(([tag]) => {
    const scriptType = (/\btype\s*=\s*["'](?<scriptType>[^"']+)["']/iu).exec(tag)?.groups?.scriptType;

    return scriptType === undefined || !PWA_NON_EXECUTABLE_SCRIPT_TYPES.has(scriptType.toLowerCase());
  });
}

function expectStaticOfflineFallback(): void {
  const fallbackDocument = readBuildOutputFile(PWA_BUILD_OFFLINE_FALLBACK_FILE);

  expect({
    containsExecutableScript: hasExecutableScript(fallbackDocument),
    containsOfflineNotice: fallbackDocument.includes("data-testid=\"offline-page\""),
    containsNuxtPayload: fallbackDocument.includes("__NUXT_DATA__"),
    containsModuleScript: (/<script[^>]*type\s*=\s*["']module["']/iu).test(fallbackDocument),
  }).toStrictEqual({
    containsExecutableScript: false,
    containsOfflineNotice: true,
    containsNuxtPayload: false,
    containsModuleScript: false,
  });
}

async function expectWebManifestIsLocalizedToDefaultLocale(page: Page): Promise<void> {
  const response = await page.request.get(new URL("/manifest.webmanifest", page.url()).href);

  if (!response.ok()) {
    throw new Error(`The web manifest request failed with status ${response.status()}.`);
  }

  const payload: unknown = await response.json();
  const manifest = PWA_MANIFEST_SCHEMA.parse(payload);
  const homeTranslations = PWA_HOME_TRANSLATIONS_SCHEMA.parse(readLocaleJson("home.json"));
  const seoTranslations = PWA_SEO_TRANSLATIONS_SCHEMA.parse(readLocaleJson("seo.json"));

  expect({
    description: manifest.description,
    dir: manifest.dir,
    displayOverride: manifest.display_override,
    id: manifest.id,
    lang: manifest.lang,
    name: manifest.name,
    shortcutName: manifest.shortcuts[0]?.name,
  }).toStrictEqual({
    description: seoTranslations.seo.home.description,
    dir: "ltr",
    displayOverride: ["standalone", "minimal-ui"],
    id: "/",
    lang: ACCEPTANCE_TESTS_DEFAULT_LOCALE,
    name: seoTranslations.seo.home.title,
    shortcutName: homeTranslations.home.playButton,
  });
}

function toPrecachedPath(match: RegExpMatchArray): string[] {
  const precachedPath = match.groups?.precachedPath;

  return precachedPath === undefined ? [] : [new URL(precachedPath, "https://acceptance.test").pathname];
}

function getServiceWorkerPrecachedPaths(serviceWorker: string): string[] {
  return [...serviceWorker.matchAll(/\{url\s*:\s*["'](?<precachedPath>[^"']+)["']\s*,\s*revision\s*:/gu)].flatMap(toPrecachedPath);
}

function toBuildOutputPath(precachedPath: string): string {
  return precachedPath === PWA_OFFLINE_FALLBACK_PATH ? PWA_BUILD_OFFLINE_FALLBACK_FILE : precachedPath.replace(/^\//u, "");
}

function getPrecachedBytes(precachedPaths: string[]): number {
  return precachedPaths.reduce((totalBytes, precachedPath) => totalBytes +
    statSync(path.join(PWA_BUILD_PUBLIC_DIRECTORY, toBuildOutputPath(precachedPath))).size, 0);
}

function expectServiceWorkerPrecachesOfflineFallback(): void {
  const serviceWorker = readBuildOutputFile(PWA_BUILD_SERVICE_WORKER_FILE);

  expect({
    hasFallbackEntry: getServiceWorkerPrecachedPaths(serviceWorker).includes(PWA_OFFLINE_FALLBACK_PATH),
    hasFallbackPlugin: (/fallbackURL\s*:\s*["']\/offline["']/u).test(serviceWorker),
  }).toStrictEqual({ hasFallbackEntry: true, hasFallbackPlugin: true });
}

function expectSlimServiceWorkerPrecache(): void {
  const serviceWorker = readBuildOutputFile(PWA_BUILD_SERVICE_WORKER_FILE);
  const precachedPaths = getServiceWorkerPrecachedPaths(serviceWorker);

  expect({
    entryCountWithinLimit: precachedPaths.length <= PWA_PRECACHE_MAXIMUM_ENTRY_COUNT,
    includesEntryStylesheet: precachedPaths.some(precachedPath => (/^\/_nuxt\/entry\.[^/]+\.css$/u).test(precachedPath)),
    includesOfflineFallback: precachedPaths.includes(PWA_OFFLINE_FALLBACK_PATH),
    includesPreloadedFont: precachedPaths.includes(PWA_PRELOADED_FONT_PATH),
    precachesIcons: precachedPaths.some(precachedPath => precachedPath.startsWith("/pwa/pwa-") || precachedPath === "/pwa/apple-touch-icon.png"),
    precachesImages: precachedPaths.some(precachedPath => precachedPath.startsWith("/img/")),
    precachesLazyJavaScript: precachedPaths.some(precachedPath => (/^\/_nuxt\/.+\.js$/u).test(precachedPath)),
    precachesLocalizedBundles: precachedPaths.some(precachedPath => precachedPath.startsWith("/_i18n/")),
    precachesScreenshots: precachedPaths.some(precachedPath => precachedPath.startsWith("/pwa/screenshot-")),
    totalBytesWithinLimit: getPrecachedBytes(precachedPaths) <= PWA_PRECACHE_MAXIMUM_BYTES,
  }).toStrictEqual({
    entryCountWithinLimit: true,
    includesEntryStylesheet: true,
    includesOfflineFallback: true,
    includesPreloadedFont: true,
    precachesIcons: false,
    precachesImages: false,
    precachesLazyJavaScript: false,
    precachesLocalizedBundles: false,
    precachesScreenshots: false,
    totalBytesWithinLimit: true,
  });
}

export {
  expectHeadLinkHref,
  expectHeadMetaContent,
  expectServiceWorkerPrecachesOfflineFallback,
  expectSlimServiceWorkerPrecache,
  expectStaticOfflineFallback,
  expectWebManifestIsLocalizedToDefaultLocale,
};