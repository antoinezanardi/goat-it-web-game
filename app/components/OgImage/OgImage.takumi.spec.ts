import { mountSuspended } from "@nuxt/test-utils/runtime";
import { describe, expect, it } from "vitest";

import type { MountSuspendedOptions } from "~~/tests/unit/utils/types/mount.types";

import OgImageTakumi from "~/components/OgImage/OgImage.takumi.vue";

describe("OgImage Component", () => {
  async function mountOgImageComponent(options: MountSuspendedOptions<typeof OgImageTakumi> = {}): Promise<ReturnType<typeof mountSuspended<typeof OgImageTakumi>>> {
    return mountSuspended(OgImageTakumi, { shallow: true, ...options });
  }

  it("should render the tagline when mounted.", async() => {
    const wrapper = await mountOgImageComponent();

    const tagline = wrapper.find("#og-image-tagline");

    expect(tagline.text()).toBe("Le jeu où la réponse se devine");
  });

  it("should render the h1 with brand name when mounted.", async() => {
    const wrapper = await mountOgImageComponent();

    const h1 = wrapper.find("#og-image-brand");

    expect(h1.text()).toBe("Goat It");
  });

  it("should render the logo image with the correct src when mounted.", async() => {
    const wrapper = await mountOgImageComponent();

    const img = wrapper.find("#og-image-logo");

    expect(img.attributes("src")).toBe("/img/logo/logo-source.png");
  });

  it("should render the logo image with alt text when mounted.", async() => {
    const wrapper = await mountOgImageComponent();

    const img = wrapper.find("#og-image-logo");

    expect(img.attributes("alt")).toBe("Goat It Logo");
  });

  it("should render the root element with the dark background color when mounted.", async() => {
    const wrapper = await mountOgImageComponent();

    const root = wrapper.find("#og-image-root");

    expect(root.classes()).toContain("bg-[#18181b]");
  });
});