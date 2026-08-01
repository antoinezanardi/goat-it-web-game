import type { VueWrapper } from "@vue/test-utils";
import { mountSuspended } from "@nuxt/test-utils/runtime";
import { beforeEach, describe, expect, it } from "vitest";

import type { MountSuspendedOptions } from "~~/tests/unit/utils/types/mount.types";

import { GITHUB_REPO_URL } from "@/components/VersionButton/version-button.constants";
import VersionButton from "@/components/VersionButton/VersionButton.vue";

describe("VersionButton Component", () => {
  let wrapper: VueWrapper;

  async function mountVersionButton(options: MountSuspendedOptions<typeof VersionButton> = {}): Promise<VueWrapper> {
    return mountSuspended(VersionButton, { ...options });
  }

  beforeEach(async() => {
    wrapper = await mountVersionButton({
      props: { version: "1.0.0" },
    });
  });

  it("should display v{version} text when version prop is provided.", () => {
    expect(wrapper.text()).toContain("v1.0.0");
  });

  it("should render a link to the GitHub repository URL when mounted.", () => {
    const link = wrapper.find("a");

    expect(link.attributes("href")).toBe(GITHUB_REPO_URL);
  });

  it("should have target=_blank on the link when mounted.", () => {
    const link = wrapper.find("a");

    expect(link.attributes("target")).toBe("_blank");
  });

  it("should have rel=noopener noreferrer on the link when mounted.", () => {
    const link = wrapper.find("a");

    expect(link.attributes("rel")).toBe("noopener noreferrer");
  });

  it("should render the GitHub icon when mounted.", () => {
    const icon = wrapper.findComponent({ name: "UIcon" });

    expect(icon.props("name")).toBe("i-lucide-github");
  });

  it("should render the tooltip with the translated githubTooltip key when mounted.", () => {
    const tooltip = wrapper.findComponent({ name: "UTooltip" });

    expect(tooltip.attributes("text")).toBe("home.githubTooltip");
  });

  it("should render the container with the correct data-testid when mounted.", () => {
    const container = wrapper.find("[data-testid='github-version-button']");

    expect(container.exists()).toBe(true);
  });
});