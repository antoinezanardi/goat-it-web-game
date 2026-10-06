import { createTestingPinia } from "@pinia/testing";
import type { VueWrapper } from "@vue/test-utils";
import { mountSuspended } from "@nuxt/test-utils/runtime";
import { beforeEach, describe, expect, it } from "vitest";

import type { MountSuspendedOptions } from "~~/tests/unit/utils/types/mount.types";

import { GameSettingsGeneralTab } from "#components";
import type { GameSettingsAdultContentSwitch, GameSettingsCognitiveDifficultiesFilter, GameSettingsLocaleSelect } from "#components";

import type { GameSettingsGeneralTabProps } from "@/components/domain/game/GameSettingsModal/GameSettingsGeneralTab/game-settings-general-tab.types";

describe("GameSettingsGeneralTab Component", () => {
  let wrapper: VueWrapper;

  const defaultGameSettingsGeneralTabProps: GameSettingsGeneralTabProps = {
    isLocaleSelectDisabled: false,
  } as const;

  async function mountGameSettingsGeneralTab(options: MountSuspendedOptions<typeof GameSettingsGeneralTab> = {}): Promise<VueWrapper> {
    return mountSuspended(GameSettingsGeneralTab, { props: defaultGameSettingsGeneralTabProps, plugins: [createTestingPinia()], ...options });
  }

  beforeEach(async() => {
    wrapper = await mountGameSettingsGeneralTab();
  });

  it("should render GameSettingsGeneralTab when mounted.", () => {
    expect(wrapper.exists()).toBeTruthy();
  });

  it("should render the general tab root with the correct data-testid when mounted.", () => {
    expect(wrapper.find("[data-testid='game-settings-general-tab']").exists()).toBe(true);
  });

  it("should render the locale select component when mounted.", () => {
    expect(wrapper.findComponent<typeof GameSettingsLocaleSelect>({ name: "GameSettingsLocaleSelect" }).exists()).toBe(true);
  });

  it("should render the adult content switch component when mounted.", () => {
    expect(wrapper.findComponent<typeof GameSettingsAdultContentSwitch>({ name: "GameSettingsAdultContentSwitch" }).exists()).toBe(true);
  });

  it("should render the separator components when mounted.", () => {
    expect(wrapper.findAllComponents({ name: "USeparator" })).toHaveLength(2);
  });

  it("should render the cognitive difficulties filter component when mounted.", () => {
    expect(wrapper.findComponent<typeof GameSettingsCognitiveDifficultiesFilter>({ name: "GameSettingsCognitiveDifficultiesFilter" }).exists()).toBe(true);
  });

  it("should pass isDisabled as true to GameSettingsLocaleSelect when isLocaleSelectDisabled is true.", async() => {
    await wrapper.setProps({ isLocaleSelectDisabled: true });
    const localeSelect = wrapper.findComponent<typeof GameSettingsLocaleSelect>({ name: "GameSettingsLocaleSelect" });

    expect(localeSelect.props("isDisabled")).toBe(true);
  });

  it("should pass isDisabled as false to GameSettingsLocaleSelect when isLocaleSelectDisabled is false.", () => {
    const localeSelect = wrapper.findComponent<typeof GameSettingsLocaleSelect>({ name: "GameSettingsLocaleSelect" });

    expect(localeSelect.props("isDisabled")).toBe(false);
  });
});