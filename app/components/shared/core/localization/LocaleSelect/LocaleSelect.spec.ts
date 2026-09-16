import { mountSuspended } from "@nuxt/test-utils/runtime";
import type { VueWrapper } from "@vue/test-utils";
import { beforeEach, describe, expect, it } from "vitest";
import { nextTick } from "vue";

import type { MountSuspendedOptions } from "~~/tests/unit/utils/types/mount.types";
import type { ComponentVm } from "~~/tests/unit/utils/types/vtu.types";
import { getWrapperVm } from "~~/tests/unit/utils/helpers/vtu.helpers";
import { DEFAULT_MOCKED_LOCALE, MOCKED_LOCALE_CODES } from "~~/tests/unit/utils/mocks/composables/nuxt/useI18n/useI18n.mock.constants";

import type { ULocaleSelect } from "#components";
import { LocaleSelect } from "#components";

import { LOCALE_SELECT_UI } from "~/components/shared/core/localization/LocaleSelect/locale-select.constants";

describe("LocaleSelect Component", () => {
  let wrapper: VueWrapper;

  async function mountLocaleSelect(options: MountSuspendedOptions<typeof LocaleSelect> = {}): Promise<VueWrapper> {
    return mountSuspended(LocaleSelect, { ...options });
  }

  beforeEach(async() => {
    wrapper = await mountLocaleSelect();
  });

  it("should render LocaleSelect when mounted.", () => {
    expect(wrapper.exists()).toBeTruthy();
  });

  it("should render the locale select test id when mounted.", () => {
    expect(wrapper.find("[data-testid='locale-select']").exists()).toBe(true);
  });

  describe("Nuxt UI Locale Select", () => {
    it("should pass the current locale as modelValue prop to ULocaleSelect when mounted.", () => {
      const nuxtUILocaleSelect = wrapper.findComponent<typeof ULocaleSelect>({ name: "ULocaleSelect" });

      expect(nuxtUILocaleSelect.props("modelValue")).toBe(DEFAULT_MOCKED_LOCALE);
    });

    it("should pass a changed locale as modelValue prop to ULocaleSelect when the locale changes.", async() => {
      const { locale } = useI18n();
      const nuxtUILocaleSelect = wrapper.findComponent<typeof ULocaleSelect>({ name: "ULocaleSelect" });
      locale.value = MOCKED_LOCALE_CODES[0];
      await nextTick();

      expect(nuxtUILocaleSelect.props("modelValue")).toBe(MOCKED_LOCALE_CODES[0]);
    });

    it("should pass the supported locales as locales prop to ULocaleSelect when mounted.", () => {
      const { locales } = useI18n();
      const nuxtUILocaleSelect = wrapper.findComponent<typeof ULocaleSelect>({ name: "ULocaleSelect" });

      expect(nuxtUILocaleSelect.props("locales")).toStrictEqual(locales.value);
    });

    it("should pass the ui prop to ULocaleSelect when mounted.", () => {
      const nuxtUILocaleSelect = wrapper.findComponent<typeof ULocaleSelect>({ name: "ULocaleSelect" });

      expect(nuxtUILocaleSelect.props("ui")).toStrictEqual(LOCALE_SELECT_UI);
    });

    it("should call setLocale exactly once when a supported locale is selected.", () => {
      const { setLocale } = useI18n();
      const nuxtUILocaleSelect = wrapper.findComponent<typeof ULocaleSelect>({ name: "ULocaleSelect" });

      getWrapperVm<ComponentVm & { $emit: (event: string, payload: string) => void }>(nuxtUILocaleSelect).$emit("update:modelValue", MOCKED_LOCALE_CODES[0]);

      expect(setLocale).toHaveBeenCalledExactlyOnceWith(MOCKED_LOCALE_CODES[0]);
    });

    it("should not call setLocale when an unsupported locale is selected.", () => {
      const { setLocale } = useI18n();
      const nuxtUILocaleSelect = wrapper.findComponent<typeof ULocaleSelect>({ name: "ULocaleSelect" });

      getWrapperVm<ComponentVm & { $emit: (event: string, payload: string) => void }>(nuxtUILocaleSelect).$emit("update:modelValue", "ja");

      expect(setLocale).not.toHaveBeenCalled();
    });
  });
});