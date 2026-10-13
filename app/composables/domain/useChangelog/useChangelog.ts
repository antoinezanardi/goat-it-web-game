import { sortChangelogEntries } from "~/composables/domain/useChangelog/helpers/changelog.helpers";
import type { ChangelogEntry, UseChangelog, UseChangelogOptions } from "~/composables/domain/useChangelog/use-changelog.types";
import { CHANGELOG_STATE_KEYS, CHANGELOG_TOAST_ICON } from "~/composables/domain/useChangelog/use-changelog.constants";
import { useChangelogCookie } from "~/composables/domain/useChangelogCookie/useChangelogCookie";

function useChangelog(options: UseChangelogOptions): UseChangelog {
  const { addInfoToast } = useAppToast();
  const { t } = useI18n();
  const { readChangelogState, writeChangelogState } = useChangelogCookie();

  const isOpen = useState<boolean>(CHANGELOG_STATE_KEYS.IS_OPEN, () => false);
  const isUnread = useState<boolean>(CHANGELOG_STATE_KEYS.IS_UNREAD, () => false);

  const entries = computed<ChangelogEntry[]>(() => sortChangelogEntries([...toValue(options.entries)]));
  const latestVersion = computed<string | undefined>(() => entries.value[0]?.version);

  const lastSeenVersion = ref<string>("");
  const lastNotifiedVersion = ref<string>("");

  function persistState(): void {
    writeChangelogState({ lastSeenVersion: lastSeenVersion.value, lastNotifiedVersion: lastNotifiedVersion.value });
  }

  function syncUnreadState(): void {
    isUnread.value = latestVersion.value !== undefined && lastSeenVersion.value !== latestVersion.value;
  }

  function open(): void {
    isOpen.value = true;
  }

  function close(): void {
    isOpen.value = false;
  }

  function showNewReleaseToast(): void {
    addInfoToast({
      title: t("changelog.toast.title"),
      description: t("changelog.toast.description"),
      icon: CHANGELOG_TOAST_ICON,
      type: "background",
      actions: [
        {
          label: t("changelog.toast.action"),
          color: "primary",
          onClick: open,
        },
      ],
    });
  }

  function initializeFromStoredState(): void {
    const latestVersionValue = latestVersion.value;

    if (latestVersionValue === undefined) {
      isUnread.value = false;

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

  watch(latestVersion, initializeFromStoredState, { immediate: true });

  watch(isOpen, isOpenValue => {
    if (isOpenValue) {
      markLatestReleaseAsSeen();
    }
  });

  return {
    entries,
    isOpen,
    open,
    close,
  };
}

export { useChangelog };