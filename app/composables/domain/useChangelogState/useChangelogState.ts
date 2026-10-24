import type { UseChangelogState } from "@/composables/domain/useChangelogState/use-changelog-state.types";
import { StateNames } from "#shared/enums/state.enums";

function useChangelogState(): UseChangelogState {
  const isChangelogOpen = useState<boolean>(StateNames.CHANGELOG_IS_OPEN, () => false);
  const isChangelogUnread = useState<boolean>(StateNames.CHANGELOG_IS_UNREAD, () => false);

  function openChangelog(): void {
    isChangelogOpen.value = true;
  }

  function closeChangelog(): void {
    isChangelogOpen.value = false;
  }
  return {
    isChangelogOpen,
    isChangelogUnread,
    openChangelog,
    closeChangelog,
  };
}

export { useChangelogState };