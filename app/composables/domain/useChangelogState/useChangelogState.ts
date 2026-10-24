import type { UseChangelogState } from "@/composables/domain/useChangelogState/use-changelog-state.types";
import { StateNames } from "#shared/enums/state.enums";

function useChangelogState(): UseChangelogState {
  const isOpen = useState<boolean>(StateNames.CHANGELOG_IS_OPEN, () => false);
  const isUnread = useState<boolean>(StateNames.CHANGELOG_IS_UNREAD, () => false);

  function open(): void {
    isOpen.value = true;
  }

  function close(): void {
    isOpen.value = false;
  }
  return {
    isOpen,
    isUnread,
    open,
    close,
  };
}

export { useChangelogState };