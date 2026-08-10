import { mountSuspended } from "@nuxt/test-utils/runtime";
import { describe, expect, it } from "vitest";

import type { MountSuspendedOptions } from "~~/tests/unit/utils/types/mount.types";

import OgImage from "~~/app/components/OgImage/OgImage.takumi.vue";

describe("OgImage Component", () => {
  async function mountOgImageComponent(options: MountSuspendedOptions<typeof OgImage> = {}): Promise<ReturnType<typeof mountSuspended<typeof OgImage>>> {
    return mountSuspended(OgImage, { shallow: true, ...options });
  }

  it("should not render the tagline when no tagline prop is provided.", async() => {
    const wrapper = await mountOgImageComponent();

    const tagline = wrapper.find("p");

    expect(tagline.exists()).toBe(false);
  });

  it("should render the tagline when tagline prop is provided.", async() => {
    const wrapper = await mountOgImageComponent({ props: { tagline: "The game where the answer is guessed." } });

    const tagline = wrapper.find("p");

    expect(tagline.text()).toBe("The game where the answer is guessed.");
  });

  it("should render the h1 with brand name when mounted.", async() => {
    const wrapper = await mountOgImageComponent();

    const h1 = wrapper.find("h1");

    expect(h1.text()).toBe("Goat It");
  });

  it("should render the logo image with the correct src when mounted.", async() => {
    const wrapper = await mountOgImageComponent();

    const img = wrapper.find("img");

    expect(img.attributes("src")).toBe("/img/logo/logo-source.png");
  });

  it("should render the logo image with alt text when mounted.", async() => {
    const wrapper = await mountOgImageComponent();

    const img = wrapper.find("img");

    expect(img.attributes("alt")).toBe("Goat It Logo");
  });

  it("should render the root element with the dark background color when mounted.", async() => {
    const wrapper = await mountOgImageComponent();

    const root = wrapper.find("div");

    expect(root.classes()).toContain("bg-[#18181b]");
  });
});