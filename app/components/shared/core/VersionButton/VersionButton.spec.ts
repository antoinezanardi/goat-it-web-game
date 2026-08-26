import type { VueWrapper } from "@vue/test-utils";
import { mountSuspended } from "@nuxt/test-utils/runtime";
import { beforeEach, describe, expect, it } from "vitest";

import type { MountSuspendedOptions } from "~~/tests/unit/utils/types/mount.types";

import { VersionButton } from "#components";

import { version } from "~~/package.json";
import { GITHUB_REPO_URL, VERSION_BUTTON_UI } from "@/components/shared/core/VersionButton/version-button.constants";

describe("VersionButton Component", () => {
  let wrapper: VueWrapper;

  async function mountVersionButton(options: MountSuspendedOptions<typeof VersionButton> = {}): Promise<VueWrapper> {
    return mountSuspended(VersionButton, { ...options });
  }

  beforeEach(async() => {
    wrapper = await mountVersionButton();
  });

  it("should render VersionButton when mounted.", () => {
    expect(wrapper.exists()).toBeTruthy();
  });

  it("should render the version button root with the correct data-testid when mounted.", () => {
    expect(wrapper.find("[data-testid='github-version-button']").exists()).toBe(true);
  });

  it("should display v{version} text as the UButton label when mounted.", () => {
    const button = wrapper.findComponent({ name: "UButton" });

    expect(button.props("label")).toBe(`v${version}`);
  });

  it("should render a UButton linking to the GitHub repository URL when mounted.", () => {
    const button = wrapper.findComponent({ name: "UButton" });

    expect(button.props("href")).toBe(GITHUB_REPO_URL);
  });

  it("should set the UButton ui prop to VERSION_BUTTON_UI when mounted.", () => {
    const button = wrapper.findComponent({ name: "UButton" });

    expect(button.props("ui")).toStrictEqual(VERSION_BUTTON_UI);
  });

  it("should render the UButton github icon when mounted.", () => {
    const button = wrapper.findComponent({ name: "UButton" });

    expect(button.props("icon")).toBe("i-lucide-github");
  });

  it("should render the tooltip with the translated githubTooltip key when mounted.", () => {
    const tooltip = wrapper.findComponent({ name: "UTooltip" });

    expect(tooltip.props("text")).toBe("home.githubTooltip");
  });
});