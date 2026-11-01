import type { VueWrapper } from "@vue/test-utils";
import { mountSuspended } from "@nuxt/test-utils/runtime";
import { beforeEach, describe, expect, it } from "vitest";

import type { MountSuspendedOptions } from "~~/tests/unit/utils/types/mount.types";

import type { USkeleton } from "#components";
import { ChangelogModalSkeleton } from "#components";

describe("ChangelogModalSkeleton Component", () => {
  let wrapper: VueWrapper;

  async function mountChangelogModalSkeleton(options: MountSuspendedOptions<typeof ChangelogModalSkeleton> = {}): Promise<VueWrapper> {
    return mountSuspended(ChangelogModalSkeleton, { ...options });
  }

  beforeEach(async() => {
    wrapper = await mountChangelogModalSkeleton();
  });

  it("should render ChangelogModalSkeleton when mounted.", () => {
    expect(wrapper.exists()).toBeTruthy();
  });

  it("should hide the skeleton from assistive technologies when mounted.", () => {
    expect(wrapper.attributes("aria-hidden")).toBe("true");
  });

  it("should render the skeleton container when mounted.", () => {
    expect(wrapper.find("[data-testid='changelog-modal-skeleton']").exists()).toBe(true);
  });

  it("should render two skeleton releases when mounted.", () => {
    expect(wrapper.findAll("[data-testid='changelog-modal-skeleton-entry']")).toHaveLength(2);
  });

  it("should render skeleton blocks with the skeleton component when mounted.", () => {
    expect(wrapper.findComponent<typeof USkeleton>({ name: "USkeleton" }).exists()).toBe(true);
  });

  it("should render a version and date block per skeleton release when mounted.", () => {
    expect(wrapper.findAll("[data-testid='changelog-modal-skeleton-version']")).toHaveLength(2);
  });

  it("should render a title block per skeleton release when mounted.", () => {
    expect(wrapper.findAll("[data-testid='changelog-modal-skeleton-title']")).toHaveLength(2);
  });

  it("should render varied-width description lines per skeleton release when mounted.", () => {
    const descriptionWidths = wrapper.findAll("[data-testid='changelog-modal-skeleton-description']")
      .map(line => line.classes().find(cssClass => cssClass.startsWith("w-")));

    expect(descriptionWidths).toStrictEqual(["w-full", "w-11/12", "w-4/5", "w-full", "w-11/12", "w-4/5"]);
  });

  it("should not use the default skeleton pulse when mounted.", () => {
    expect(wrapper.find("[data-testid='changelog-modal-skeleton-title']").classes()).not.toContain("animate-pulse");
  });

  it("should disable the skeleton pulse when the player prefers reduced motion.", () => {
    expect(wrapper.find("[data-testid='changelog-modal-skeleton-title']").classes()).toContain("motion-reduce:animate-none");
  });

  it("should give the skeleton blocks a subtle stroke background so they stay visible against the modal surface when mounted.", () => {
    expect(wrapper.find("[data-testid='changelog-modal-skeleton-title']").classes()).toContain("bg-stroke-subtle");
  });
});