import type { VueWrapper } from "@vue/test-utils";
import { mountSuspended } from "@nuxt/test-utils/runtime";
import { beforeEach, describe, expect, it, vi } from "vitest";

import type { MountSuspendedOptions } from "~~/tests/unit/utils/types/mount.types";

import { GITHUB_REPO_URL, VERSION_BUTTON_UI } from "@/components/VersionButton/version-button.constants";
import VersionButton from "@/components/VersionButton/VersionButton.vue";

// Acceptable as import() mock hoisting fails on CI because ~~/ alias is not resolved during Vitest's mock hoisting phase
// oxlint-disable-next-line vitest/prefer-import-in-mock
vi.mock("~~/package.json", () => ({
  version: "1.0.0",
}));

describe("VersionButton Component", () => {
  let wrapper: VueWrapper;

  async function mountVersionButton(options: MountSuspendedOptions<typeof VersionButton> = {}): Promise<VueWrapper> {
    return mountSuspended(VersionButton, { ...options });
  }

  beforeEach(async() => {
    wrapper = await mountVersionButton();
  });

  it("should display v{version} text as the UButton label when mounted.", () => {
    const button = wrapper.findComponent({ name: "UButton" });

    expect(button.props("label")).toBe("v1.0.0");
  });

  it("should render a UButton linking to the GitHub repository URL when mounted.", () => {
    const button = wrapper.findComponent({ name: "UButton" });

    expect(button.props("href")).toBe(GITHUB_REPO_URL);
  });

  it("should have target=_blank on the UButton when mounted.", () => {
    const button = wrapper.findComponent({ name: "UButton" });

    expect(button.props("target")).toBe("_blank");
  });

  it("should have rel=noopener noreferrer on the UButton when mounted.", () => {
    const button = wrapper.findComponent({ name: "UButton" });

    expect(button.props("rel")).toBe("noopener noreferrer");
  });

  it("should set the UButton icon to i-lucide-github when mounted.", () => {
    const button = wrapper.findComponent({ name: "UButton" });

    expect(button.props("icon")).toBe("i-lucide-github");
  });

  it("should set the UButton ui prop to VERSION_BUTTON_UI when mounted.", () => {
    const button = wrapper.findComponent({ name: "UButton" });

    expect(button.props("ui")).toStrictEqual(VERSION_BUTTON_UI);
  });

  it("should set the UButton variant to outline when mounted.", () => {
    const button = wrapper.findComponent({ name: "UButton" });

    expect(button.props("variant")).toBe("outline");
  });

  it("should set the UButton color to info when mounted.", () => {
    const button = wrapper.findComponent({ name: "UButton" });

    expect(button.props("color")).toBe("info");
  });

  it("should set the UButton size to md when mounted.", () => {
    const button = wrapper.findComponent({ name: "UButton" });

    expect(button.props("size")).toBe("md");
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