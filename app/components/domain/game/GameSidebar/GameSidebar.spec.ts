import { createTestingPinia } from "@pinia/testing";
import type { VueWrapper } from "@vue/test-utils";
import { mountSuspended } from "@nuxt/test-utils/runtime";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { nextTick } from "vue";

import type { MountSuspendedOptions } from "~~/tests/unit/utils/types/mount.types";
import { getWrapperVm } from "~~/tests/unit/utils/helpers/vtu.helpers";
import { createFakeGameSettings } from "~~/tests/unit/utils/faketories/game-settings/game-settings.entity.faketory";
import { mockStore } from "~~/tests/unit/utils/mocks/stores/store.mock";

import type { UButton, ULink } from "#components";
import { GameSidebar } from "#components";

import { GAME_SIDEBAR_UI } from "@/components/domain/game/GameSidebar/game-sidebar.constants";
import type { GameSidebarProps } from "@/components/domain/game/GameSidebar/game-sidebar.types";
import { useGameSettingsStore } from "@/stores/domain/game-settings/game-settings.store";

describe("GameSidebar Component", () => {
  let wrapper: VueWrapper;

  const defaultGameSidebarProps: GameSidebarProps = {
    isTutorialAvailable: true,
    isOpen: true,
  } as const;

  async function mountGameSidebar(options: MountSuspendedOptions<typeof GameSidebar> = {}): Promise<VueWrapper> {
    return mountSuspended(GameSidebar, { props: defaultGameSidebarProps, attachTo: document.body, global: { plugins: [createTestingPinia()] }, ...options });
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

  it("should pass isOpen as the open prop to USlideover when mounted.", () => {
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

  it("should render the brand text in the sidebar title when mounted.", () => {
    expect(document.body.querySelector("[data-testid='game-sidebar']")?.textContent).toContain("home.brand");
  });

  it("should render the sidebar title as a link to the home page when mounted.", () => {
    expect(findLinkByTestId("game-sidebar").props("to")).toBe("/");
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

  it("should have the footer data-testid attribute when mounted.", () => {
    expect(document.body.querySelector("[data-testid='game-sidebar-footer']")).not.toBeNull();
  });

  it("should emit update:isOpen when USlideover emits update:open.", () => {
    const slideover = wrapper.findComponent({ name: "USlideover" });
    getWrapperVm(slideover).$emit("update:open", false);

    expect(wrapper.emitted("update:isOpen")).toStrictEqual([[false]]);
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

  it("should emit startTutorial when the tutorial entry is clicked.", async() => {
    await findLinkByTestId("game-sidebar-tutorial-link").find("button").trigger("click");

    expect(wrapper.emitted("startTutorial")).toStrictEqual([[]]);
  });

  it("should not render the tutorial entry when isTutorialAvailable is false.", async() => {
    await wrapper.setProps({ isTutorialAvailable: false });

    expect(document.body.querySelector("[data-testid='game-sidebar-tutorial-link']")).toBeNull();
  });

  it("should render the question filters action directly after the tutorial action when mounted.", () => {
    const sidebarLinks = [...document.body.querySelectorAll<HTMLElement>("[data-testid='game-sidebar-tutorial-link'], [data-testid='game-sidebar-filters-link']")]
      .map(element => element.dataset.testid);

    expect(sidebarLinks).toStrictEqual(["game-sidebar-tutorial-link", "game-sidebar-filters-link"]);
  });

  it("should render the question filters label when mounted.", () => {
    expect(document.body.querySelector("[data-testid='game-sidebar-filters-link']")?.textContent).toContain("game.questionsFilters.sidebarLabel");
  });

  it("should render the funnel icon on the question filters action when mounted.", () => {
    expect(findLinkByTestId("game-sidebar-filters-link").findComponent({ name: "UIcon" }).props("name")).toBe("i-lucide-funnel");
  });

  it("should not render the question filters count badge when no filter group is active.", () => {
    expect(document.body.querySelector("[data-testid='game-sidebar-filters-count-badge']")).toBeNull();
  });

  it("should render the question filters count badge with the applied count when a filter group is active.", async() => {
    mockStore(useGameSettingsStore).settings = createFakeGameSettings({ isAdultContentEnabled: true, cognitiveDifficulties: ["easy", "medium", "hard"] });
    await nextTick();

    expect(wrapper.findComponent({ name: "GameQuestionsFiltersCountBadge" }).props("count")).toBe(1);
  });

  it("should forward the data-testid attribute to the question filters count badge when a filter group is active.", async() => {
    mockStore(useGameSettingsStore).settings = createFakeGameSettings({ isAdultContentEnabled: true, cognitiveDifficulties: ["easy", "medium", "hard"] });
    await nextTick();

    expect(document.body.querySelector("[data-testid='game-sidebar-filters-count-badge']")).not.toBeNull();
  });

  it("should not set an explicit aria-label on the question filters action when mounted.", () => {
    expect(document.body.querySelector("[data-testid='game-sidebar-filters-link']")?.getAttribute("aria-label")).toBeNull();
  });

  it("should emit openFilters when the question filters action is clicked.", async() => {
    await findLinkByTestId("game-sidebar-filters-link").find("button").trigger("click");

    expect(wrapper.emitted("openFilters")).toStrictEqual([[]]);
  });

  it("should emit after:leave when the slideover emits after:leave.", () => {
    getWrapperVm(wrapper.findComponent({ name: "USlideover" })).$emit("after:leave");

    expect(wrapper.emitted("after:leave")).toStrictEqual([[]]);
  });
});