import type { VueWrapper } from "@vue/test-utils";
import { mountSuspended } from "@nuxt/test-utils/runtime";
import { afterEach, beforeEach, describe, expect, it } from "vitest";

import type { MountSuspendedOptions } from "~~/tests/unit/utils/types/mount.types";
import { getWrapperVm } from "~~/tests/unit/utils/helpers/vtu.helpers";

import type { UButton, ULink } from "#components";
import { GameSidebar } from "#components";

import { GAME_SIDEBAR_UI } from "@/components/domain/game/GameSidebar/game-sidebar.constants";
import type { GameSidebarProps } from "@/components/domain/game/GameSidebar/game-sidebar.types";

describe("GameSidebar Component", () => {
  let wrapper: VueWrapper;

  const defaultGameSidebarProps: GameSidebarProps = {
    isTutorialAvailable: true,
    open: true,
  } as const;

  async function mountGameSidebar(options: MountSuspendedOptions<typeof GameSidebar> = {}): Promise<VueWrapper> {
    return mountSuspended(GameSidebar, { props: defaultGameSidebarProps, attachTo: document.body, ...options });
  }

  function findLinkByTestId(testId: string): VueWrapper<InstanceType<typeof ULink>> {
    const allLinks = wrapper.findAllComponents<typeof ULink>({ name: "ULink" });
    const matchedLink = allLinks.find(link => link.find(`[data-testid='${testId}']`).exists());

    if (!matchedLink) {
      throw new Error(`ULink with data-testid="${testId}" not found`);
    }
    return matchedLink;
  }

  beforeEach(async() => {
    wrapper = await mountGameSidebar();
  });

  afterEach(() => {
    wrapper.unmount();
    document.body.innerHTML = "";
  });

  it("should render GameSidebar when mounted.", () => {
    expect(wrapper.exists()).toBeTruthy();
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

  it("should pass the GAME_SIDEBAR_UI ui config to USlideover when mounted.", () => {
    const slideover = wrapper.findComponent({ name: "USlideover" });

    expect(slideover.props("ui")).toStrictEqual(GAME_SIDEBAR_UI);
  });

  it("should render the brand text in the header when mounted.", () => {
    expect(document.body.querySelector("[data-testid='game-sidebar']")?.textContent).toContain("home.brand");
  });

  it("should render the sidebar header as a link to the home page when mounted.", () => {
    expect(findLinkByTestId("game-sidebar").props("to")).toBe("/");
  });

  it("should render the logo image inside the header link when mounted.", () => {
    expect(findLinkByTestId("game-sidebar").find("img").exists()).toBe(true);
  });

  it("should render the back to home link with the correct label when mounted.", () => {
    const link = document.body.querySelector("[data-testid='game-sidebar-back-to-home-link']");

    expect(link?.textContent).toContain("game.backToHome");
  });

  it("should render the back to home link pointing to the home page when mounted.", () => {
    const backToHomeLink = findLinkByTestId("game-sidebar-back-to-home-link");

    expect(backToHomeLink.props("to")).toBe("/");
  });

  it("should render the house icon on the back to home link when mounted.", () => {
    const backToHomeLink = findLinkByTestId("game-sidebar-back-to-home-link");

    expect(backToHomeLink.findComponent({ name: "UIcon" }).props("name")).toBe("i-lucide-house");
  });

  it("should render the rules link with the correct label when mounted.", () => {
    const link = document.body.querySelector("[data-testid='game-sidebar-rules-link']");

    expect(link?.textContent).toContain("game.rules");
  });

  it("should render the rules link pointing to the rules page when mounted.", () => {
    const rulesLink = findLinkByTestId("game-sidebar-rules-link");

    expect(rulesLink.props("to")).toBe("/rules");
  });

  it("should open the rules link in a new tab when mounted.", () => {
    const rulesLink = findLinkByTestId("game-sidebar-rules-link");

    expect(rulesLink.props("target")).toBe("_blank");
  });

  it("should render the book icon on the rules link when mounted.", () => {
    const rulesLink = findLinkByTestId("game-sidebar-rules-link");

    expect(rulesLink.findComponent({ name: "UIcon" }).props("name")).toBe("i-lucide-book-open");
  });

  it("should render the settings button with the correct data-testid when mounted.", () => {
    expect(wrapper.findComponent<typeof UButton>("[data-testid='game-sidebar-settings-button']").exists()).toBe(true);
  });

  it("should render the settings button with the trigger label translation key when mounted.", () => {
    const settingsButton = wrapper.findComponent<typeof UButton>("[data-testid='game-sidebar-settings-button']");

    expect(settingsButton.props("label")).toBe("game.settings.trigger");
  });

  it("should render the settings button with the settings icon when mounted.", () => {
    const settingsButton = wrapper.findComponent<typeof UButton>("[data-testid='game-sidebar-settings-button']");

    expect(settingsButton.props("icon")).toBe("i-lucide-settings");
  });

  it("should emit openSettings when the settings button is clicked.", async() => {
    const settingsButton = wrapper.findComponent<typeof UButton>("[data-testid='game-sidebar-settings-button']");
    await settingsButton.trigger("click");

    expect(wrapper.emitted("openSettings")).toStrictEqual([[]]);
  });

  it("should not render the LocaleSelect component when mounted.", () => {
    expect(wrapper.findComponent({ name: "LocaleSelect" }).exists()).toBe(false);
  });

  it("should not render the VersionButton component when mounted.", () => {
    expect(wrapper.findComponent({ name: "VersionButton" }).exists()).toBe(false);
  });

  it("should have the footer data-testid attribute when mounted.", () => {
    expect(document.body.querySelector("[data-testid='game-sidebar-footer']")).not.toBeNull();
  });

  it("should emit update:open when USlideover emits update:open.", () => {
    const slideover = wrapper.findComponent({ name: "USlideover" });
    getWrapperVm(slideover).$emit("update:open", false);

    expect(wrapper.emitted("update:open")).toStrictEqual([[false]]);
  });

  it("should render the tutorial entry when isTutorialAvailable is true.", () => {
    expect(document.body.querySelector("[data-testid='game-sidebar-tutorial-link']")).not.toBeNull();
  });

  it("should render the interactive tutorial label on the tutorial entry when mounted.", () => {
    expect(findLinkByTestId("game-sidebar-tutorial-link").text()).toContain("game.interactiveTutorial.label");
  });

  it("should render the compass icon on the tutorial entry when mounted.", () => {
    expect(findLinkByTestId("game-sidebar-tutorial-link").findComponent({ name: "UIcon" }).props("name")).toBe("i-lucide-compass");
  });

  it("should render the tutorial entry as a button when mounted.", () => {
    expect(findLinkByTestId("game-sidebar-tutorial-link").find("button").exists()).toBe(true);
  });

  it("should emit startTutorial when the tutorial entry is clicked.", async() => {
    await findLinkByTestId("game-sidebar-tutorial-link").find("button").trigger("click");

    expect(wrapper.emitted("startTutorial")).toStrictEqual([[]]);
  });

  it("should not render the tutorial entry when isTutorialAvailable is false.", async() => {
    await wrapper.setProps({ isTutorialAvailable: false });

    expect(document.body.querySelector("[data-testid='game-sidebar-tutorial-link']")).toBeNull();
  });
});