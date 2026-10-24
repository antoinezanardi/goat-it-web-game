import type { Ref } from "vue";

type UseChangelogState = {
  isChangelogOpen: Ref<boolean>;
  isChangelogUnread: Ref<boolean>;
  openChangelog: () => void;
  closeChangelog: () => void;
};

export type { UseChangelogState };