import type { Ref } from "vue";

type UseChangelogState = {
  isOpen: Ref<boolean>;
  isUnread: Ref<boolean>;
  open: () => void;
  close: () => void;
};

export type { UseChangelogState };