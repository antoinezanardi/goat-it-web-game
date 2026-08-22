import type { VueWrapper } from "@vue/test-utils";
import { mountSuspended } from "@nuxt/test-utils/runtime";
import { beforeEach, describe, expect, it } from "vitest";

import type { MountSuspendedOptions } from "~~/tests/unit/utils/types/mount.types";
import { getWrapperVm } from "~~/tests/unit/utils/helpers/vtu.helpers";

import { GameSidebar } from "#components";

import type { GameSidebarProps } from "@/components/domain/game/GameSidebar/game-sidebar.types";

describe("GameSidebar Component", () => {
  let wrapper: VueWrapper;

  const defaultGameSidebarProps: GameSidebarProps = {
    open: true,
  } as const;

  async function mountSidebar(options: MountSuspendedOptions<typeof GameSidebar> = {}): Promise<VueWrapper> {
    return mountSuspended(GameSidebar, { props: defaultGameSidebarProps, attachTo: document.body, ...options });
  }

  beforeEach(async() => {
    wrapper = await mountSidebar();
  });

  it("should have the data-testid attribute when mounted.", () => {
    expect(document.body.querySelector("[data-testid='game-sidebar']")).not.toBeNull();
  });

  it("should pass the open prop to USlideover when mounted.", () => {
    const slideover = wrapper.findComponent({ name: "USlideover" });

    expect(slideover.props("open")).toBe(true);
  });

  it("should pass the brand i18n key as the title prop to USlideover when mounted.", () => {
    const slideover = wrapper.findComponent({ name: "USlideover" });

    expect(slideover.props("title")).toBe("home.brand");
  });

  it("should render the brand text in the header when mounted.", () => {
    expect(document.body.querySelector("[data-testid='game-sidebar']")?.textContent).toContain("home.brand");
  });

  it("should render the back to home link with the correct label when mounted.", () => {
    const link = document.body.querySelector("[data-testid='game-sidebar-back-to-home-link']");

    expect(link?.textContent).toContain("game.backToHome");
  });

  it("should render the back to home link pointing to the home page when mounted.", () => {
    const link = wrapper.findComponent({ name: "ULink" });

    expect(link.props("to")).toBe("/");
  });

  it("should render the VersionButton component when mounted.", () => {
    expect(wrapper.findComponent({ name: "VersionButton" }).exists()).toBe(true);
  });

  it("should emit update:open when USlideover emits update:open.", () => {
    const slideover = wrapper.findComponent({ name: "USlideover" });
    getWrapperVm(slideover).$emit("update:open", false);

    expect(wrapper.emitted("update:open")).toStrictEqual([[false]]);
  });
});