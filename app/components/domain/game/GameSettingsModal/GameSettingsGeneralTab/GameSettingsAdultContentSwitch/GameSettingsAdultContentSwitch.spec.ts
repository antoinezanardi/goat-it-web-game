import type { VueWrapper } from "@vue/test-utils";
import { mountSuspended } from "@nuxt/test-utils/runtime";
import { createTestingPinia } from "@pinia/testing";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { nextTick } from "vue";

import type { MountSuspendedOptions } from "~~/tests/unit/utils/types/mount.types";
import { mockStore } from "~~/tests/unit/utils/mocks/stores/store.mock";
import { createFakeGameSettings } from "~~/tests/unit/utils/faketories/game-settings/game-settings.entity.faketory";

import { GameSettingsAdultContentSwitch } from "#components";
import type { UIcon } from "#components";

import { useGameSettingsStore } from "@/stores/domain/game-settings/game-settings.store";

describe("GameSettingsAdultContentSwitch Component", () => {
  let wrapper: VueWrapper;

  async function mountGameSettingsAdultContentSwitch(options: MountSuspendedOptions<typeof GameSettingsAdultContentSwitch> = {}): Promise<VueWrapper> {
    return mountSuspended(GameSettingsAdultContentSwitch, { plugins: [createTestingPinia()], ...options });
  }

  beforeEach(async() => {
    wrapper = await mountGameSettingsAdultContentSwitch();
    mockStore(useGameSettingsStore).settings = createFakeGameSettings({ isAdultContentEnabled: false });
    await nextTick();
  });

  it("should render GameSettingsAdultContentSwitch when mounted.", () => {
    expect(wrapper.exists()).toBeTruthy();
  });

  it("should render the switch row with the correct data-testid when mounted.", () => {
    expect(wrapper.find("[data-testid='game-settings-adult-content-switch']").exists()).toBe(true);
  });

  it("should render the label with the label translation key when mounted.", () => {
    expect(wrapper.get("[data-testid='game-settings-adult-content-label']").text()).toBe("game.settings.adultContent.label");
  });

  it("should render the USwitch component when mounted.", () => {
    expect(wrapper.findComponent({ name: "USwitch" }).exists()).toBe(true);
  });

  it("should render the adult content icon when mounted.", () => {
    const icon = wrapper.findComponent<typeof UIcon>("[data-testid='game-settings-adult-content-icon']");

    expect(icon.props("name")).toBe("i-lucide-venetian-mask");
  });

  it("should render the description with the disabled translation key when adult content is disabled.", () => {
    expect(wrapper.get("[data-testid='game-settings-adult-content-description']").text()).toBe("game.settings.adultContent.descriptionDisabled");
  });

  it("should link the label to the switch when mounted.", () => {
    const label = wrapper.get("[data-testid='game-settings-adult-content-label']");
    const switchControl = wrapper.get("[role='switch']");

    expect(label.attributes("for")).toBe(switchControl.attributes("id"));
  });

  it("should reference the description from the switch when mounted.", () => {
    const switchControl = wrapper.get("[role='switch']");
    const description = wrapper.get("[data-testid='game-settings-adult-content-description']");

    expect(switchControl.attributes("aria-describedby")).toBe(description.attributes("id"));
  });

  it("should render the muted icon class when adult content is disabled.", () => {
    const icon = wrapper.findComponent<typeof UIcon>("[data-testid='game-settings-adult-content-icon']");

    expect(icon.classes()).toContain("text-muted");
  });

  it("should render the enabled description when adult content is enabled.", async() => {
    const store = mockStore(useGameSettingsStore);
    store.settings = createFakeGameSettings({ isAdultContentEnabled: true });
    await nextTick();

    expect(wrapper.get("[data-testid='game-settings-adult-content-description']").text()).toBe("game.settings.adultContent.descriptionEnabled");
  });

  it("should render the active icon class when adult content is enabled.", async() => {
    const store = mockStore(useGameSettingsStore);
    store.settings = createFakeGameSettings({ isAdultContentEnabled: true });
    await nextTick();
    const icon = wrapper.findComponent<typeof UIcon>("[data-testid='game-settings-adult-content-icon']");

    expect(icon.classes()).toContain("text-primary");
  });

  it("should call setAdultContentEnabled with true when the switch is toggled on.", async() => {
    const store = mockStore(useGameSettingsStore);
    const setAdultContentEnabledSpy = vi.spyOn(store, "setAdultContentEnabled");

    await wrapper.get("[role='switch']").trigger("click");

    expect(setAdultContentEnabledSpy).toHaveBeenCalledExactlyOnceWith(true);
  });
});