import { CHANGELOG_TOAST_DURATION_IN_MS } from "@/composables/domain/useChangelog/use-changelog.constants";
import { CHANGELOG_ICON } from "@/utils/ui/changelog/changelog.constants";
import type { UseChangelog, UseChangelogOptions } from "@/composables/domain/useChangelog/use-changelog.types";
import { useChangelogCookie } from "@/composables/domain/useChangelogCookie/useChangelogCookie";
import { useChangelogState } from "@/composables/domain/useChangelogState/useChangelogState";

/**
 * Tracks which release the player has seen and announces a new version once.
 *
 * Compares the latest version with the changelog cookie, shows one toast for an unannounced version, and marks the
 * release as seen when the modal opens.
 */
function useChangelog(options: UseChangelogOptions): UseChangelog {
  const { addInfoToast } = useAppToast();
  const { t } = useI18n();
  const { readChangelogState, writeChangelogState } = useChangelogCookie();

  const { isChangelogOpen, isChangelogUnread, openChangelog, closeChangelog } = useChangelogState();

  const latestVersion = computed<string | undefined>(() => toValue(options.latestVersion));

  const lastSeenVersion = ref<string>("");
  const lastNotifiedVersion = ref<string>("");

  function persistState(): void {
    writeChangelogState({ lastSeenVersion: lastSeenVersion.value, lastNotifiedVersion: lastNotifiedVersion.value });
  }

  function syncUnreadState(): void {
    isChangelogUnread.value = latestVersion.value !== undefined && lastSeenVersion.value !== latestVersion.value;
  }

  function showNewReleaseToast(): void {
    addInfoToast({
      title: t("changelog.toast.title"),
      description: t("changelog.toast.description"),
      duration: CHANGELOG_TOAST_DURATION_IN_MS,
      icon: CHANGELOG_ICON,
      type: "background",
      actions: [
        {
          label: t("changelog.toast.action"),
          color: "primary",
          onClick: openChangelog,
        },
      ],
    });
  }

  function initializeFromStoredState(): void {
    const latestVersionValue = latestVersion.value;

    if (latestVersionValue === undefined) {
      isChangelogUnread.value = false;

      return;
    }

    const storedState = readChangelogState();

    if (storedState === undefined) {
      lastSeenVersion.value = latestVersionValue;
      lastNotifiedVersion.value = latestVersionValue;
      persistState();
      syncUnreadState();

      return;
    }

    lastSeenVersion.value = storedState.lastSeenVersion;
    lastNotifiedVersion.value = storedState.lastNotifiedVersion;
    syncUnreadState();

    if (storedState.lastNotifiedVersion !== latestVersionValue) {
      lastNotifiedVersion.value = latestVersionValue;
      persistState();
      showNewReleaseToast();
    }
  }

  function markLatestReleaseAsSeen(): void {
    const latestVersionValue = latestVersion.value;

    if (latestVersionValue === undefined || lastSeenVersion.value === latestVersionValue) {
      return;
    }
    lastSeenVersion.value = latestVersionValue;
    persistState();
    syncUnreadState();
  }

  onMounted(() => {
    initializeFromStoredState();
    watch(latestVersion, initializeFromStoredState);
  });

  watch([isChangelogOpen, latestVersion], ([isChangelogOpenValue]) => {
    if (isChangelogOpenValue) {
      markLatestReleaseAsSeen();
    }
  });

  return {
    isChangelogOpen,
    openChangelog,
    closeChangelog,
  };
}

export { useChangelog };