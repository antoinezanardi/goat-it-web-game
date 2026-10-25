import { readFileSync } from "node:fs";
import path from "node:path";

import { expect } from "@playwright/test";

import {
  PWA_BUILD_OFFLINE_FALLBACK_FILE,
  PWA_BUILD_PUBLIC_DIRECTORY,
  PWA_BUILD_SERVICE_WORKER_FILE,
  PWA_NON_EXECUTABLE_SCRIPT_TYPES,
  PWA_OFFLINE_FALLBACK_PATH,
} from "#acceptance/features/step-definitions/pwa/pwa.steps.constants.ts";

function readBuildOutputFile(relativePath: string): string {
  return readFileSync(path.join(PWA_BUILD_PUBLIC_DIRECTORY, relativePath), "utf8");
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

function toPrecachedPath(match: RegExpMatchArray): string[] {
  const precachedPath = match.groups?.precachedPath;

  return precachedPath === undefined ? [] : [new URL(precachedPath, "https://acceptance.test").pathname];
}

function getServiceWorkerPrecachedPaths(serviceWorker: string): string[] {
  return [...serviceWorker.matchAll(/url\s*:\s*["'](?<precachedPath>[^"']+)["']/gu)].flatMap(toPrecachedPath);
}

function expectServiceWorkerPrecachesOfflineFallback(): void {
  const serviceWorker = readBuildOutputFile(PWA_BUILD_SERVICE_WORKER_FILE);

  expect({
    hasFallbackEntry: getServiceWorkerPrecachedPaths(serviceWorker).includes(PWA_OFFLINE_FALLBACK_PATH),
    hasFallbackPlugin: (/fallbackURL\s*:\s*["']\/offline["']/u).test(serviceWorker),
  }).toStrictEqual({ hasFallbackEntry: true, hasFallbackPlugin: true });
}

export { expectServiceWorkerPrecachesOfflineFallback, expectStaticOfflineFallback };