import type { VueWrapper } from "@vue/test-utils";
import { mountSuspended } from "@nuxt/test-utils/runtime";
import { beforeEach, describe, expect, it } from "vitest";
import { nextTick, unref } from "vue";

import type { MountSuspendedOptions } from "~~/tests/unit/utils/types/mount.types";
import { usePreferredReducedMotionMock } from "~~/tests/unit/setup/nuxt/composables/use-preferred-reduced-motion.nuxt.unit-setup";
import { useWindowScrollMock } from "~~/tests/unit/setup/nuxt/composables/use-window-scroll.nuxt.unit-setup";

import { DocsBackToTop } from "#components";

describe("DocsBackToTop Component", () => {
  let wrapper: VueWrapper;

  async function mountDocsBackToTop(options: MountSuspendedOptions<typeof DocsBackToTop> = {}): Promise<VueWrapper> {
    return mountSuspended(DocsBackToTop, { ...options, attachTo: document.body });
  }

  beforeEach(async() => {
    wrapper = await mountDocsBackToTop();
  });

  it("should render the button with the backToTop aria-label translation key when mounted.", () => {
    const button = wrapper.find("[data-testid='docs-back-to-top-button']");

    expect(button.attributes("aria-label")).toBe("docs.backToTop");
  });

  it("should render the tooltip with the backToTop text translation key when mounted.", () => {
    const tooltip = wrapper.findComponent({ name: "UTooltip" });

    expect(tooltip.attributes("text")).toBe("docs.backToTop");
  });

  it("should hide the button when scroll y does not exceed the threshold.", async() => {
    useWindowScrollMock.instance.y.value = 600;
    await nextTick();

    expect(wrapper.find("[data-testid='docs-back-to-top-button']").isVisible()).toBe(false);
  });

  it("should show the button when scroll y exceeds the threshold.", async() => {
    useWindowScrollMock.instance.y.value = 601;
    await nextTick();

    expect(wrapper.find("[data-testid='docs-back-to-top-button']").isVisible()).toBe(true);
  });

  it("should set scroll y to 0 when the button is clicked.", async() => {
    useWindowScrollMock.instance.y.value = 1000;
    await nextTick();

    await wrapper.find("[data-testid='docs-back-to-top-button']").trigger("click");

    expect(useWindowScrollMock.instance.y.value).toBe(0);
  });

  it("should use smooth scroll behavior when reduced motion is not preferred.", () => {
    usePreferredReducedMotionMock.instance.preferredReducedMotionRef.value = "no-preference";

    expect(unref(useWindowScrollMock.instance.capturedOptions.current?.behavior)).toBe("smooth");
  });

  it("should use auto scroll behavior when reduced motion is preferred.", () => {
    usePreferredReducedMotionMock.instance.preferredReducedMotionRef.value = "reduce";

    expect(unref(useWindowScrollMock.instance.capturedOptions.current?.behavior)).toBe("auto");
  });
});