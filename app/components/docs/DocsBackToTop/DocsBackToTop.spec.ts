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
    return mountSuspended(DocsBackToTop, { attachTo: document.body, ...options });
  }

  beforeEach(async() => {
    wrapper = await mountDocsBackToTop();
  });

  it("should render DocsBackToTop when mounted.", () => {
    expect(wrapper.exists()).toBeTruthy();
  });

  it("should render the button with the backToTop aria-label translation key when mounted.", () => {
    const button = wrapper.find("[data-testid='docs-back-to-top-button']");

    expect(button.attributes("aria-label")).toBe("docs.backToTop");
  });

  it("should render the arrow-up icon when mounted.", () => {
    const button = wrapper.findComponent({ name: "UButton" });

    expect(button.props("icon")).toBe("i-lucide-arrow-up");
  });

  it("should render the tooltip with the backToTop text translation key when mounted.", () => {
    const tooltip = wrapper.findComponent({ name: "UTooltip" });

    expect(tooltip.attributes("text")).toBe("docs.backToTop");
  });

  it.each<{ scrollY: number; expectedVisibility: boolean }>([
    { scrollY: 600, expectedVisibility: false },
    { scrollY: 601, expectedVisibility: true },
  ])("should render the button visibility as $expectedVisibility when scroll y equals $scrollY.", async({ scrollY, expectedVisibility }) => {
    useWindowScrollMock.instance.y.value = scrollY;
    await nextTick();

    expect(wrapper.find("[data-testid='docs-back-to-top-button']").isVisible()).toBe(expectedVisibility);
  });

  it("should set scroll y to 0 when the button is clicked.", async() => {
    useWindowScrollMock.instance.y.value = 1000;
    await nextTick();

    await wrapper.find("[data-testid='docs-back-to-top-button']").trigger("click");

    expect(useWindowScrollMock.instance.y.value).toBe(0);
  });

  it.each<{ preferredReducedMotion: "no-preference" | "reduce"; expectedBehavior: "smooth" | "auto" }>([
    { preferredReducedMotion: "no-preference", expectedBehavior: "smooth" },
    { preferredReducedMotion: "reduce", expectedBehavior: "auto" },
  ])("should use $expectedBehavior scroll behavior when reduced motion preference is $preferredReducedMotion.", ({ preferredReducedMotion, expectedBehavior }) => {
    usePreferredReducedMotionMock.instance.preferredReducedMotionRef.value = preferredReducedMotion;

    expect(unref(useWindowScrollMock.instance.capturedOptions.current?.behavior)).toBe(expectedBehavior);
  });
});