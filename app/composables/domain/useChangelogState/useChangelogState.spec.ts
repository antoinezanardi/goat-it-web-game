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

  it("should default the open state to false when no shared state exists.", () => {
    expect(changelogState.isOpen.value).toBe(false);
  });

  it("should default the unread state to false when no shared state exists.", () => {
    expect(changelogState.isUnread.value).toBe(false);
  });

  it("should reflect the shared unread state when it has already been set.", () => {
    useState<boolean>(StateNames.CHANGELOG_IS_UNREAD).value = true;

    expect(changelogState.isUnread.value).toBe(true);
  });

  it("should set the open state to true when open is called.", () => {
    changelogState.open();

    expect(changelogState.isOpen.value).toBe(true);
  });

  it("should set the open state to false when close is called after open.", () => {
    changelogState.open();
    changelogState.close();

    expect(changelogState.isOpen.value).toBe(false);
  });

  it("should keep the unread state untouched when open is called.", () => {
    useState<boolean>(StateNames.CHANGELOG_IS_UNREAD).value = true;
    changelogState.open();

    expect(changelogState.isUnread.value).toBe(true);
  });
});