import { mockNuxtImport } from "@nuxt/test-utils/runtime";
import { mount } from "@vue/test-utils";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { defineComponent, nextTick, ref } from "vue";
import type { Ref } from "vue";

import { useCookieMockState } from "~~/tests/unit/setup/nuxt/composables/use-cookie.nuxt.unit-setup";
import { createUseAppToastMock } from "~~/tests/unit/utils/mocks/composables/ui/useAppToast/useAppToast.mock";
import type { UseAppToastMock } from "~~/tests/unit/utils/mocks/composables/ui/useAppToast/useAppToast.mock";
import { createFakeChangelogEntry } from "~~/tests/unit/utils/faketories/changelog/changelog-entry.entity.faketory";

import type { useChangelog as UseChangelogType } from "~/composables/domain/useChangelog/useChangelog";
import type { ChangelogEntry, UseChangelog } from "~/composables/domain/useChangelog/use-changelog.types";
import { CHANGELOG_STATE_KEYS, CHANGELOG_TOAST_ICON } from "~/composables/domain/useChangelog/use-changelog.constants";
import type { Toast } from "#ui/composables";
import { CookieNames } from "#shared/enums/cookie.enums";

let useAppToastMock: UseAppToastMock;

mockNuxtImport("useAppToast", () => (): UseAppToastMock => useAppToastMock);

let useChangelog: typeof UseChangelogType;
let entries: Ref<ChangelogEntry[]>;
let changelog: UseChangelog;
let openState: Ref<boolean>;
let unreadState: Ref<boolean>;

function resetSharedState(): void {
  clearNuxtState([CHANGELOG_STATE_KEYS.IS_OPEN, CHANGELOG_STATE_KEYS.IS_UNREAD]);
}

function mountChangelogHarness(): void {
  mount(defineComponent({
    setup(): () => null {
      changelog = useChangelog({ entries });
      openState = useState<boolean>(CHANGELOG_STATE_KEYS.IS_OPEN);
      unreadState = useState<boolean>(CHANGELOG_STATE_KEYS.IS_UNREAD);

      return (): null => null;
    },
  }));
}

function getLastSeenVersionCookie(): string | undefined {
  const cookie = useCookieMockState.cookieRef.value;

  if (typeof cookie !== "object" || cookie === null) {
    return undefined;
  }
  return (cookie as { lastSeenVersion?: string }).lastSeenVersion;
}

function getNotifiedToastOptions(): Partial<Toast> | undefined {
  return vi.mocked(useAppToastMock.addInfoToast).mock.calls[0]?.[0];
}

function clickToastAction(): void {
  const action = getNotifiedToastOptions()?.actions?.[0];

  if (typeof action?.onClick === "function") {
    action.onClick(new MouseEvent("click"));
  }
}

describe("useChangelog", () => {
  beforeEach(async() => {
    resetSharedState();
    useAppToastMock = createUseAppToastMock();
    useCookieMockState.capturedName.current = undefined;
    useCookieMockState.capturedOptions.current = undefined;
    useCookieMockState.cookieRef.value = null;
    entries = ref<ChangelogEntry[]>([createFakeChangelogEntry({ version: "1.9.0", date: "2026-09-25" })]);
    ({ useChangelog } = await import("~/composables/domain/useChangelog/useChangelog"));
    mountChangelogHarness();
  });

  describe("cookie registration", () => {
    it("should read the changelog state cookie by name when mounted.", () => {
      expect(useCookieMockState.capturedName.current).toBe(CookieNames.CHANGELOG_STATE);
    });
  });

  describe("shared state", () => {
    it("should default the open state to false when mounted.", () => {
      expect(openState.value).toBe(false);
    });

    it("should default the unread state to false when mounted.", () => {
      expect(unreadState.value).toBe(false);
    });

    it("should sort the entries by date descending when the entries are unsorted.", () => {
      entries.value = [
        createFakeChangelogEntry({ version: "1.0.0", date: "2026-08-01" }),
        createFakeChangelogEntry({ version: "2.0.0", date: "2026-09-25" }),
      ];

      expect(changelog.entries.value.map(entry => entry.version)).toStrictEqual(["2.0.0", "1.0.0"]);
    });
  });

  describe("first visit", () => {
    it("should initialize both stored versions to the latest release when no cookie exists.", () => {
      expect(useCookieMockState.cookieRef.value).toStrictEqual({ lastSeenVersion: "1.9.0", lastNotifiedVersion: "1.9.0" });
    });

    it("should not show a toast when no cookie exists.", () => {
      expect(useAppToastMock.addInfoToast).not.toHaveBeenCalled();
    });

    it("should not mark the changelog unread when no cookie exists.", () => {
      expect(unreadState.value).toBe(false);
    });

    it("should clear the unread state when there is no changelog entry.", () => {
      resetSharedState();
      entries = ref<ChangelogEntry[]>([]);
      mountChangelogHarness();

      expect(unreadState.value).toBe(false);
    });

    it("should not show a toast when there is no changelog entry.", () => {
      resetSharedState();
      entries = ref<ChangelogEntry[]>([]);
      mountChangelogHarness();

      expect(useAppToastMock.addInfoToast).not.toHaveBeenCalled();
    });

    it("should treat an invalid cookie as a first visit when the cookie is invalid.", () => {
      resetSharedState();
      useCookieMockState.cookieRef.value = "not-json";
      mountChangelogHarness();

      expect(useCookieMockState.cookieRef.value).toStrictEqual({ lastSeenVersion: "1.9.0", lastNotifiedVersion: "1.9.0" });
    });
  });

  describe("newer release", () => {
    it("should mark the changelog unread when the stored seen version is older than the latest release.", () => {
      resetSharedState();
      useCookieMockState.cookieRef.value = { lastSeenVersion: "1.8.0", lastNotifiedVersion: "1.8.0" };
      mountChangelogHarness();

      expect(unreadState.value).toBe(true);
    });

    it("should show one localized notification when the stored notified version is older than the latest release.", () => {
      resetSharedState();
      useCookieMockState.cookieRef.value = { lastSeenVersion: "1.8.0", lastNotifiedVersion: "1.8.0" };
      mountChangelogHarness();

      expect(useAppToastMock.addInfoToast).toHaveBeenCalledExactlyOnceWith({
        title: "changelog.toast.title",
        description: "changelog.toast.description",
        icon: CHANGELOG_TOAST_ICON,
        type: "background",
        actions: [{ label: "changelog.toast.action", color: "primary", onClick: expect.any(Function) as () => void }],
      });
    });

    it("should persist the latest release as notified when the notification is shown.", () => {
      resetSharedState();
      useCookieMockState.cookieRef.value = { lastSeenVersion: "1.8.0", lastNotifiedVersion: "1.8.0" };
      mountChangelogHarness();

      expect((useCookieMockState.cookieRef.value as { lastNotifiedVersion?: string }).lastNotifiedVersion).toBe("1.9.0");
    });

    it("should not show a notification when the release was already notified but not seen.", () => {
      resetSharedState();
      useCookieMockState.cookieRef.value = { lastSeenVersion: "1.8.0", lastNotifiedVersion: "1.9.0" };
      mountChangelogHarness();

      expect(useAppToastMock.addInfoToast).not.toHaveBeenCalled();
    });
  });

  describe("opening the changelog", () => {
    it("should mark the latest release as seen when the modal is opened.", async() => {
      resetSharedState();
      useCookieMockState.cookieRef.value = { lastSeenVersion: "1.8.0", lastNotifiedVersion: "1.9.0" };
      mountChangelogHarness();

      changelog.open();
      await nextTick();

      expect(getLastSeenVersionCookie()).toBe("1.9.0");
    });

    it("should clear the unread state when the modal is opened.", async() => {
      resetSharedState();
      useCookieMockState.cookieRef.value = { lastSeenVersion: "1.8.0", lastNotifiedVersion: "1.9.0" };
      mountChangelogHarness();

      changelog.open();
      await nextTick();

      expect(unreadState.value).toBe(false);
    });

    it("should set the open state to true when open is called.", () => {
      changelog.open();

      expect(changelog.isOpen.value).toBe(true);
    });

    it("should set the open state to false when close is called.", () => {
      changelog.open();
      changelog.close();

      expect(changelog.isOpen.value).toBe(false);
    });

    it("should open the changelog when the notification action is invoked.", () => {
      resetSharedState();
      useCookieMockState.cookieRef.value = { lastSeenVersion: "1.8.0", lastNotifiedVersion: "1.8.0" };
      mountChangelogHarness();

      clickToastAction();

      expect(changelog.isOpen.value).toBe(true);
    });

    it("should keep the stored seen version untouched when the latest release was already seen.", async() => {
      resetSharedState();
      const storedCookie = { lastSeenVersion: "1.9.0", lastNotifiedVersion: "1.9.0" };
      useCookieMockState.cookieRef.value = storedCookie;
      mountChangelogHarness();

      changelog.open();
      await nextTick();

      expect(useCookieMockState.cookieRef.value).toBe(storedCookie);
    });
  });
});