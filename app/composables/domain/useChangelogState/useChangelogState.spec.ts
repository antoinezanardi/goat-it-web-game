import { mount } from "@vue/test-utils";
import { beforeEach, describe, expect, it } from "vitest";
import { defineComponent } from "vue";

import { StateNames } from "#shared/enums/state.enums";
import type { UseChangelogState } from "@/composables/domain/useChangelogState/use-changelog-state.types";
import { useChangelogState } from "@/composables/domain/useChangelogState/useChangelogState";

let changelogState: UseChangelogState;

function mountChangelogStateHarness(): void {
  mount(defineComponent({
    setup(): () => null {
      changelogState = useChangelogState();

      return (): null => null;
    },
  }));
}

describe(useChangelogState, () => {
  beforeEach(() => {
    clearNuxtState([StateNames.CHANGELOG_IS_OPEN, StateNames.CHANGELOG_IS_UNREAD]);
    mountChangelogStateHarness();
  });

  it("should default the changelog open state to false when no shared state exists.", () => {
    expect(changelogState.isChangelogOpen.value).toBe(false);
  });

  it("should default the changelog unread state to false when no shared state exists.", () => {
    expect(changelogState.isChangelogUnread.value).toBe(false);
  });

  it("should reflect the shared changelog unread state when it has already been set.", () => {
    useState<boolean>(StateNames.CHANGELOG_IS_UNREAD).value = true;

    expect(changelogState.isChangelogUnread.value).toBe(true);
  });

  it("should set the changelog open state to true when openChangelog is called.", () => {
    changelogState.openChangelog();

    expect(changelogState.isChangelogOpen.value).toBe(true);
  });

  it("should set the changelog open state to false when closeChangelog is called after openChangelog.", () => {
    changelogState.openChangelog();
    changelogState.closeChangelog();

    expect(changelogState.isChangelogOpen.value).toBe(false);
  });

  it("should keep the changelog unread state untouched when openChangelog is called.", () => {
    useState<boolean>(StateNames.CHANGELOG_IS_UNREAD).value = true;
    changelogState.openChangelog();

    expect(changelogState.isChangelogUnread.value).toBe(true);
  });
});