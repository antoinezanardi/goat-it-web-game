import { SAFE_SOURCE_URL_SCHEMA } from "#shared/utils/helpers/question/source/question-source.constants";

/**
 * Keeps only the source URLs allowed by the safe-scheme allowlist, preserving their order.
 */
function filterSafeSourceUrls(urls: readonly string[]): string[] {
  return urls.filter(url => SAFE_SOURCE_URL_SCHEMA.safeParse(url).success);
}

/**
 * Returns the URL hostname without a leading `www.`, or the input unchanged when it cannot be parsed.
 */
function getSourceDomain(url: string): string {
  try {
    return new URL(url).hostname.replace(/^www\./u, "");
  } catch {
    return url;
  }
}

export { filterSafeSourceUrls, getSourceDomain };