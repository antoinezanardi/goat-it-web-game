import { SAFE_SOURCE_URL_SCHEMA } from "#shared/utils/helpers/question/source/question-source.constants";

function filterSafeSourceUrls(urls: readonly string[]): string[] {
  return urls.filter(url => SAFE_SOURCE_URL_SCHEMA.safeParse(url).success);
}

function getSourceDomain(url: string): string {
  try {
    return new URL(url).hostname.replace(/^www\./u, "");
  } catch {
    return url;
  }
}

export { filterSafeSourceUrls, getSourceDomain };