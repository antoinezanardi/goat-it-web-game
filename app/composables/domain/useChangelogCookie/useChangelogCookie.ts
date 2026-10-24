import { CookieNames } from "#shared/enums/cookie.enums";
import { CHANGELOG_STATE_COOKIE_OPTIONS, CHANGELOG_STATE_SCHEMA } from "@/composables/domain/useChangelogCookie/use-changelog-cookie.constants";
import type { ChangelogState, UseChangelogCookie } from "@/composables/domain/useChangelogCookie/use-changelog-cookie.types";

/**
 * Reads and writes the schema-validated changelog state cookie.
 */
function useChangelogCookie(): UseChangelogCookie {
  const cookie = useCookie<unknown>(CookieNames.CHANGELOG_STATE, CHANGELOG_STATE_COOKIE_OPTIONS);

  function readChangelogState(): ChangelogState | undefined {
    const result = CHANGELOG_STATE_SCHEMA.safeParse(cookie.value);

    if (!result.success) {
      return undefined;
    }
    return result.data;
  }

  function writeChangelogState(state: ChangelogState): void {
    cookie.value = state;
  }
  return {
    readChangelogState,
    writeChangelogState,
  };
}

export { useChangelogCookie };