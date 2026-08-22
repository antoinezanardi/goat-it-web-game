import type { VueWrapper } from "@vue/test-utils";
import { mountSuspended } from "@nuxt/test-utils/runtime";
import { beforeEach, describe, expect, it } from "vitest";

import type { MountSuspendedOptions } from "~~/tests/unit/utils/types/mount.types";

import OgImageTakumi from "~/components/OgImage/OgImage.takumi.vue";

describe("OgImageTakumi Component", () => {
  let wrapper: VueWrapper;

  async function mountOgImageComponent(options: MountSuspendedOptions<typeof OgImageTakumi> = {}): Promise<VueWrapper> {
    return mountSuspended(OgImageTakumi, { ...options });
  }

  beforeEach(async() => {
    wrapper = await mountOgImageComponent();
  });

  it("should render OgImageTakumi when mounted.", () => {
    expect(wrapper.exists()).toBeTruthy();
  });

  it("should render the logo image with alt text when mounted.", () => {
    const img = wrapper.find("#og-image-logo");

    expect(img.attributes("alt")).toBe("Goat It Logo");
  });
});