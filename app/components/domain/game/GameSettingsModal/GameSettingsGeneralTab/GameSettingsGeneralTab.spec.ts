import type { VueWrapper } from "@vue/test-utils";
import { mountSuspended } from "@nuxt/test-utils/runtime";
import { beforeEach, describe, expect, it } from "vitest";

import type { MountSuspendedOptions } from "~~/tests/unit/utils/types/mount.types";

import { GameSettingsGeneralTab } from "#components";
import type { LocaleSelect } from "#components";

import type { GameSettingsGeneralTabProps } from "@/components/domain/game/GameSettingsModal/GameSettingsGeneralTab/game-settings-general-tab.types";

describe("GameSettingsGeneralTab Component", () => {
  let wrapper: VueWrapper;

  const defaultGameSettingsGeneralTabProps: GameSettingsGeneralTabProps = {
    isLocaleSelectDisabled: false,
  } as const;

  async function mountGameSettingsGeneralTab(options: MountSuspendedOptions<typeof GameSettingsGeneralTab> = {}): Promise<VueWrapper> {
    return mountSuspended(GameSettingsGeneralTab, { props: defaultGameSettingsGeneralTabProps, ...options });
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

  it("should render the language label with the languageLabel translation key when mounted.", () => {
    expect(wrapper.find("[data-testid='game-settings-language-label']").text()).toBe("game.settings.languageLabel");
  });

  it("should render the LocaleSelect component when mounted.", () => {
    expect(wrapper.findComponent<typeof LocaleSelect>({ name: "LocaleSelect" }).exists()).toBe(true);
  });

  it("should pass disabled as true to LocaleSelect when isLocaleSelectDisabled is true.", async() => {
    await wrapper.setProps({ isLocaleSelectDisabled: true });
    const localeSelect = wrapper.findComponent<typeof LocaleSelect>({ name: "LocaleSelect" });

    expect(localeSelect.props("disabled")).toBe(true);
  });

  it("should pass disabled as false to LocaleSelect when isLocaleSelectDisabled is false.", () => {
    const localeSelect = wrapper.findComponent<typeof LocaleSelect>({ name: "LocaleSelect" });

    expect(localeSelect.props("disabled")).toBe(false);
  });
});