import type { VueWrapper } from "@vue/test-utils";
import { mountSuspended } from "@nuxt/test-utils/runtime";
import { beforeEach, describe, expect, it, vi } from "vitest";

import type { MountSuspendedOptions } from "~~/tests/unit/utils/types/mount.types";

import HomePage from "@/pages/index.vue";

describe("Home Page", () => {
  let wrapper: VueWrapper;

  async function mountHomePage(options: MountSuspendedOptions<typeof HomePage> = {}): Promise<VueWrapper> {
    return mountSuspended(HomePage, { shallow: true, ...options });
  }

  beforeEach(async() => {
    wrapper = await mountHomePage();
  });

  it("should render Home Page when mounted.", () => {
    expect(wrapper.exists()).toBeTruthy();
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

  it("should render the logo image with brand translation key as alt when mounted.", () => {
    const img = wrapper.find("#home-logo");

    expect(img.attributes("alt")).toBe("home.brand");
  });

  it("should render the HomePlayButton component when mounted.", () => {
    expect(wrapper.findComponent({ name: "HomePlayButton" }).exists()).toBe(true);
  });

  it("should render the HomeFooter component when mounted.", () => {
    expect(wrapper.findComponent({ name: "HomeFooter" }).exists()).toBe(true);
  });
});