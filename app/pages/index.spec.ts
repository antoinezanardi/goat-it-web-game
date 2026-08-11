import type { VueWrapper } from "@vue/test-utils";
import { mountSuspended } from "@nuxt/test-utils/runtime";
import { beforeEach, describe, expect, it, vi } from "vitest";

import type { MountSuspendedOptions } from "~~/tests/unit/utils/types/mount.types";

import { HOME_HOW_TO_PLAY_BUTTON_UI, HOME_PAGE_PLAY_BUTTON_UI } from "@/pages/index.constants";
import HomePage from "@/pages/index.vue";

describe("Home Page", () => {
  let wrapper: VueWrapper;

  async function mountHomePage(options: MountSuspendedOptions<typeof HomePage> = {}): Promise<VueWrapper> {
    return mountSuspended(HomePage, { shallow: true, ...options });
  }

  beforeEach(async() => {
    wrapper = await mountHomePage();
  });

  it("should configure SEO meta tags when mounted.", () => {
    const useHeadMock = vi.mocked(useHead);

    const headInput = useHeadMock.mock.calls[0]?.[0] as
      | { title: () => string; meta: { name?: string; property?: string; content: () => string }[] } |
      undefined;

    expect({
      title: headInput?.title(),
      meta: headInput?.meta.map(entry => (Object.assign(entry, { content: entry.content() }))),
    }).toStrictEqual({
      title: "seo.home.title",
      meta: [
        { name: "description", content: "seo.home.description" },
        { property: "og:title", content: "seo.home.title" },
        { property: "og:description", content: "seo.home.description" },
      ],
    });
  });

  it("should render the h1 with brand translation key when mounted.", () => {
    const h1 = wrapper.find("#home-brand");

    expect(h1.text()).toBe("home.brand");
  });

  it("should render the h2 with tagline translation key when mounted.", () => {
    const h2 = wrapper.find("#home-tagline");

    expect(h2.text()).toBe("home.tagline");
  });

  it("should render the subtitle paragraph with translation key when mounted.", () => {
    const subtitle = wrapper.find("#home-subtitle");

    expect(subtitle.text()).toBe("home.subtitle");
  });

  it("should render the logo image with 512px src when mounted.", () => {
    const img = wrapper.find("#home-logo");

    expect(img.attributes("src")).toBe("/img/logo/logo-512.avif");
  });

  it("should render the logo image with brand translation key as alt when mounted.", () => {
    const img = wrapper.find("#home-logo");

    expect(img.attributes("alt")).toBe("home.brand");
  });

  it("should render a UButton linking to /game when mounted.", () => {
    const button = wrapper.findComponent({ name: "UButton" });

    expect(button.attributes("to")).toBe("/game");
  });

  it("should render a UButton with the translated PLAY button label when mounted.", () => {
    const button = wrapper.findComponent({ name: "UButton" });

    expect(button.attributes("label")).toBe("home.playButton");
  });

  it("should render a UButton with size xl when mounted.", () => {
    const button = wrapper.findComponent({ name: "UButton" });

    expect(button.attributes("size")).toBe("xl");
  });

  it("should render a UButton with the HOME_PAGE_PLAY_BUTTON_UI ui config when mounted.", () => {
    const button = wrapper.findComponent({ name: "UButton" });

    expect(button.props("ui")).toStrictEqual(HOME_PAGE_PLAY_BUTTON_UI);
  });

  it("should render VersionButton when mounted.", () => {
    const versionButton = wrapper.findComponent({ name: "VersionButton" });

    expect(versionButton.exists()).toBe(true);
  });

  describe("How to Play button", () => {
    it("should render a How to Play UButton with label home.howToPlay when mounted.", () => {
      const button = wrapper.findAllComponents({ name: "UButton" }).at(1);

      expect(button?.attributes("label")).toBe("home.howToPlay");
    });

    it("should render a How to Play UButton linking to /rules when mounted.", () => {
      const button = wrapper.findAllComponents({ name: "UButton" }).at(1);

      expect(button?.attributes("to")).toBe("/rules");
    });

    it("should render a How to Play UButton with the HOW_TO_PLAY button UI config when mounted.", () => {
      const button = wrapper.findAllComponents({ name: "UButton" }).at(1);

      expect(button?.props("ui")).toStrictEqual(HOME_HOW_TO_PLAY_BUTTON_UI);
    });

    it("should render a How to Play UButton with the help-circle icon when mounted.", () => {
      const button = wrapper.findAllComponents({ name: "UButton" }).at(1);

      expect(button?.props("icon")).toBe("i-lucide-help-circle");
    });

    it("should render a How to Play UButton with variant subtle when mounted.", () => {
      const button = wrapper.findAllComponents({ name: "UButton" }).at(1);

      expect(button?.attributes("variant")).toBe("subtle");
    });
  });
});