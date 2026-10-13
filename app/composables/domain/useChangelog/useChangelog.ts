import { StateNames } from "#shared/enums/state.enums";
import type { UseChangelog, UseChangelogOptions } from "~/composables/domain/useChangelog/use-changelog.types";
import { CHANGELOG_TOAST_ICON } from "~/composables/domain/useChangelog/use-changelog.constants";
import { useChangelogCookie } from "~/composables/domain/useChangelogCookie/useChangelogCookie";

function useChangelog(options: UseChangelogOptions): UseChangelog {
  const { addInfoToast } = useAppToast();
  const { t } = useI18n();
  const { readChangelogState, writeChangelogState } = useChangelogCookie();

  const isOpen = useState<boolean>(StateNames.CHANGELOG_IS_OPEN, () => false);
  const isUnread = useState<boolean>(StateNames.CHANGELOG_IS_UNREAD, () => false);

  const latestVersion = computed<string | undefined>(() => toValue(options.latestVersion));

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

  if (import.meta.client) {
    watch(latestVersion, initializeFromStoredState, { immediate: true });
  }

  watch([isOpen, latestVersion], ([isOpenValue]) => {
    if (isOpenValue) {
      markLatestReleaseAsSeen();
    }
  });

  return {
    isOpen,
    open,
    close,
  };
}

export { useChangelog };