import { mountSuspended } from "@nuxt/test-utils/runtime";
import type { VueWrapper } from "@vue/test-utils";
import { beforeEach, describe, expect, it } from "vitest";

import type { MountSuspendedOptions } from "~~/tests/unit/utils/types/mount.types";

import { GameSettingsLocaleSelect } from "#components";
import type { LocaleSelect, UIcon } from "#components";

import type { GameSettingsLocaleSelectProps } from "@/components/domain/game/GameSettingsModal/GameSettingsGeneralTab/GameSettingsLocaleSelect/game-settings-locale-select.types";

describe("GameSettingsLocaleSelect Component", () => {
  let wrapper: VueWrapper;

  const defaultGameSettingsLocaleSelectProps: GameSettingsLocaleSelectProps = {
    isDisabled: false,
  } as const;

  async function mountGameSettingsLocaleSelect(options: MountSuspendedOptions<typeof GameSettingsLocaleSelect> = {}): Promise<VueWrapper> {
    return mountSuspended(GameSettingsLocaleSelect, { props: defaultGameSettingsLocaleSelectProps, ...options });
  }

  beforeEach(async() => {
    wrapper = await mountGameSettingsLocaleSelect();
  });

  it("should render GameSettingsLocaleSelect when mounted.", () => {
    expect(wrapper.exists()).toBeTruthy();
  });

  it("should render the root with the correct data-testid when mounted.", () => {
    expect(wrapper.find("[data-testid='game-settings-locale-select']").exists()).toBe(true);
  });

  it("should render the label with the languageLabel translation key when mounted.", () => {
    expect(wrapper.get("[data-testid='game-settings-locale-select-label']").text()).toBe("game.settings.languageLabel");
  });

  it("should render the globe icon when mounted.", () => {
    const icon = wrapper.findComponent<typeof UIcon>("[data-testid='game-settings-locale-select-icon']");

    expect(icon.props("name")).toBe("i-lucide-globe");
  });

  it("should render the LocaleSelect component when mounted.", () => {
    expect(wrapper.findComponent<typeof LocaleSelect>({ name: "LocaleSelect" }).exists()).toBe(true);
  });

  it("should pass disabled as true to LocaleSelect when isDisabled is true.", async() => {
    await wrapper.setProps({ isDisabled: true });
    const localeSelect = wrapper.findComponent<typeof LocaleSelect>({ name: "LocaleSelect" });

    expect(localeSelect.props("disabled")).toBe(true);
  });

  it("should pass disabled as false to LocaleSelect when isDisabled is false.", () => {
    const localeSelect = wrapper.findComponent<typeof LocaleSelect>({ name: "LocaleSelect" });

    expect(localeSelect.props("disabled")).toBe(false);
  });
});