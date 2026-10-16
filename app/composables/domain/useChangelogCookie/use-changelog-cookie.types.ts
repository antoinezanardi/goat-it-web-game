type ChangelogState = {
  lastSeenVersion: string;
  lastNotifiedVersion: string;
};

type UseChangelogCookie = {
  readChangelogState: () => ChangelogState | undefined;
  writeChangelogState: (state: ChangelogState) => void;
};

export type { ChangelogState, UseChangelogCookie };