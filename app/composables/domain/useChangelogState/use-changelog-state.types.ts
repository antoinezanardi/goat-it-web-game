import type { Ref } from "vue";

/**
 * Shared changelog modal state and controls returned by `useChangelogState`.
 */
type UseChangelogState = {
  isChangelogOpen: Ref<boolean>;
  /** True while the latest release has not been read yet. */
  isChangelogUnread: Ref<boolean>;
  openChangelog: () => void;
  closeChangelog: () => void;
};

export type { UseChangelogState };