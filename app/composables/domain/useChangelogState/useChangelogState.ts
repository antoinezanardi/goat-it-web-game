import type { UseChangelogState } from "@/composables/domain/useChangelogState/use-changelog-state.types";
import { StateNames } from "#shared/enums/state.enums";

/**
 * Exposes the global changelog modal and unread flags.
 *
 * Values live in Nuxt state only and are not persisted across sessions.
 */
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