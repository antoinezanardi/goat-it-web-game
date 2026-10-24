type ChangelogState = {
  /** Version last read in the changelog modal. */
  lastSeenVersion: string;
  /** Version already announced by a toast; prevents notifying the same release twice. */
  lastNotifiedVersion: string;
};

/**
 * Read/write contract for the `changelog_state` cookie.
 */
type UseChangelogCookie = {
  /** Returns `undefined` when the cookie is missing or fails validation. */
  readChangelogState: () => ChangelogState | undefined;
  writeChangelogState: (state: ChangelogState) => void;
};

export type { ChangelogState, UseChangelogCookie };