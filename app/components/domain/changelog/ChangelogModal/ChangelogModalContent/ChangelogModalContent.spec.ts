import { mountSuspended } from "@nuxt/test-utils/runtime";
import type { VueWrapper } from "@vue/test-utils";
import { beforeEach, describe, expect, it } from "vitest";

import type { MountSuspendedOptions } from "~~/tests/unit/utils/types/mount.types";
import { createFakeChangelogEntry } from "~~/tests/unit/utils/faketories/changelog/changelog-entry.entity.faketory";

import type { ChangelogModalSkeleton, StatusScreen } from "#components";
import { ChangelogModalContent } from "#components";

import type { ChangelogModalContentProps } from "@/components/domain/changelog/ChangelogModal/ChangelogModalContent/changelog-modal-content.types";

const defaultChangelogModalContentProps: ChangelogModalContentProps = {
  changelogEntries: [
    createFakeChangelogEntry({ version: "1.9.0", date: "2026-09-25" }),
    createFakeChangelogEntry({ version: "1.8.0", date: "2026-07-01" }),
  ],
  changelogEntriesStatus: "success",
};

describe("ChangelogModalContent Component", () => {
  let wrapper: VueWrapper;

  async function mountChangelogModalContent(options: MountSuspendedOptions<typeof ChangelogModalContent> = {}): Promise<VueWrapper> {
    return mountSuspended(ChangelogModalContent, {
      props: defaultChangelogModalContentProps,
      ...options,
    });
  }

  function findStatusRegion(): Element {
    return wrapper.find("[role='status']").element;
  }

  beforeEach(async() => {
    wrapper = await mountChangelogModalContent();
  });

  it("should render ChangelogModalContent when mounted.", () => {
    expect(wrapper.exists()).toBeTruthy();
  });

  it("should render the changelog modal wrapper when mounted.", () => {
    expect(wrapper.find("[data-testid='changelog-modal']").exists()).toBe(true);
  });

  it("should render the changelog modal body when mounted.", () => {
    expect(wrapper.find("[data-testid='changelog-modal-body']").exists()).toBe(true);
  });

  it("should make the changelog body keyboard focusable when mounted.", () => {
    expect(wrapper.find("[data-testid='changelog-modal-body']").attributes("tabindex")).toBe("0");
  });

  it("should wrap the changelog body states in the fade slide up transition when mounted.", () => {
    expect(wrapper.findComponent({ name: "Transition" }).props("name")).toBe("fade-slide-up");
  });

  it("should swap the changelog body states with the out in transition mode when mounted.", () => {
    expect(wrapper.findComponent({ name: "Transition" }).props("mode")).toBe("out-in");
  });

  it("should not transition the changelog body states on mount when the content renders.", () => {
    expect(wrapper.findComponent({ name: "Transition" }).props("appear")).toBeFalsy();
  });

  it("should render exactly one root element per changelog body state when mounted.", () => {
    expect(wrapper.find("transition-stub").element.children).toHaveLength(1);
  });

  it.each<{ entriesStatus: ChangelogModalContentProps["changelogEntriesStatus"]; expectedAriaBusy: string }>([
    { entriesStatus: "idle", expectedAriaBusy: "true" },
    { entriesStatus: "pending", expectedAriaBusy: "true" },
    { entriesStatus: "success", expectedAriaBusy: "false" },
    { entriesStatus: "error", expectedAriaBusy: "false" },
  ])("should set the busy state of the changelog body to $expectedAriaBusy when the changelog entries status is $entriesStatus.", async({ entriesStatus, expectedAriaBusy }) => {
    await wrapper.setProps({ changelogEntriesStatus: entriesStatus });

    expect(wrapper.find("[data-testid='changelog-modal-body']").attributes("aria-busy")).toBe(expectedAriaBusy);
  });

  it.each<{ entriesStatus: ChangelogModalContentProps["changelogEntriesStatus"]; expectedAnnouncement: string }>([
    { entriesStatus: "idle", expectedAnnouncement: "changelog.modal.loading" },
    { entriesStatus: "pending", expectedAnnouncement: "changelog.modal.loading" },
    { entriesStatus: "error", expectedAnnouncement: "changelog.modal.error" },
  ])("should announce $expectedAnnouncement through the status region when the changelog entries status is $entriesStatus.", async({ entriesStatus, expectedAnnouncement }) => {
    await wrapper.setProps({ changelogEntriesStatus: entriesStatus });

    expect(wrapper.find("[role='status']").text()).toBe(expectedAnnouncement);
  });

  it("should announce the empty changelog state through the status region when the changelog entries are empty.", async() => {
    await wrapper.setProps({ changelogEntries: [] });

    expect(wrapper.find("[role='status']").text()).toBe("changelog.modal.empty");
  });

  it("should announce nothing through the status region when the changelog entries are populated.", () => {
    expect(wrapper.find("[role='status']").text()).toBe("");
  });

  it("should keep the status region outside the changelog body transition when mounted.", () => {
    expect(wrapper.find("transition-stub").element.contains(findStatusRegion())).toBe(false);
  });

  it("should keep the status region outside the busy changelog body when mounted.", () => {
    expect(wrapper.find("[data-testid='changelog-modal-body']").element.contains(findStatusRegion())).toBe(false);
  });

  it.each<{ entriesStatus: ChangelogModalContentProps["changelogEntriesStatus"] }>([
    { entriesStatus: "idle" },
    { entriesStatus: "pending" },
  ])("should render the changelog modal skeleton instead of the changelog versions when the changelog entries status is $entriesStatus.", async({ entriesStatus }) => {
    await wrapper.setProps({ changelogEntriesStatus: entriesStatus });

    expect({
      skeleton: wrapper.findComponent<typeof ChangelogModalSkeleton>({ name: "ChangelogModalSkeleton" }).exists(),
      versions: wrapper.findComponent({ name: "UChangelogVersions" }).exists(),
    }).toStrictEqual({ skeleton: true, versions: false });
  });

  it("should render the changelog modal loading state wrapper when the changelog entries are loading.", async() => {
    await wrapper.setProps({ changelogEntriesStatus: "pending" });

    expect(wrapper.find("[data-testid='changelog-modal-loading']").exists()).toBe(true);
  });

  it("should render the changelog versions when the changelog entries are populated.", () => {
    expect(wrapper.findComponent({ name: "UChangelogVersions" }).exists()).toBe(true);
  });

  it("should render the changelog error screen with the cloud off icon when the changelog entries failed to load.", async() => {
    await wrapper.setProps({ changelogEntriesStatus: "error" });

    expect(wrapper.findComponent<typeof StatusScreen>("[data-testid='changelog-modal-error']").props("icon")).toBe("i-lucide-cloud-off");
  });

  it("should render the changelog error message in the error screen when the changelog entries failed to load.", async() => {
    await wrapper.setProps({ changelogEntriesStatus: "error" });

    expect(wrapper.findComponent<typeof StatusScreen>("[data-testid='changelog-modal-error']").props("title")).toBe("changelog.modal.error");
  });

  it("should not render a retry action in the error screen when the changelog entries failed to load.", async() => {
    await wrapper.setProps({ changelogEntriesStatus: "error" });

    expect(wrapper.find("[data-testid='changelog-modal-error'] button").exists()).toBe(false);
  });

  it("should not render the changelog versions when the changelog entries failed to load.", async() => {
    await wrapper.setProps({ changelogEntriesStatus: "error" });

    expect(wrapper.findComponent({ name: "UChangelogVersions" }).exists()).toBe(false);
  });

  it("should render the changelog empty screen with the megaphone icon when the changelog entries are empty.", async() => {
    await wrapper.setProps({ changelogEntries: [] });

    expect(wrapper.findComponent<typeof StatusScreen>("[data-testid='changelog-modal-empty']").props("icon")).toBe("i-lucide-megaphone");
  });

  it("should render the changelog empty message in the empty screen when the changelog entries are empty.", async() => {
    await wrapper.setProps({ changelogEntries: [] });

    expect(wrapper.findComponent<typeof StatusScreen>("[data-testid='changelog-modal-empty']").props("title")).toBe("changelog.modal.empty");
  });

  it("should not render the changelog versions when the changelog entries are empty.", async() => {
    await wrapper.setProps({ changelogEntries: [] });

    expect(wrapper.findComponent({ name: "UChangelogVersions" }).exists()).toBe(false);
  });
});