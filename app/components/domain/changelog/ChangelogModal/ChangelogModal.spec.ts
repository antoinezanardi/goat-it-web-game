import type { VueWrapper } from "@vue/test-utils";
import { mountSuspended } from "@nuxt/test-utils/runtime";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { ref } from "vue";
import type { Ref } from "vue";

import type { MountSuspendedOptions } from "~~/tests/unit/utils/types/mount.types";
import { getWrapperVm } from "~~/tests/unit/utils/helpers/vtu.helpers";
import { createFakeChangelogEntry } from "~~/tests/unit/utils/faketories/changelog/changelog-entry.entity.faketory";
import { useAsyncDataMock } from "~~/tests/unit/setup/nuxt/composables/use-async-data.nuxt.unit-setup";
import { queryCollectionMock } from "~~/tests/unit/setup/nuxt/composables/query-collection.nuxt.unit-setup";

import type { UChangelogVersion } from "#components";
import { ChangelogModal } from "#components";

import type { ChangelogEntry } from "~/composables/domain/useChangelog/use-changelog.types";
import { CHANGELOG_STATE_KEYS } from "~/composables/domain/useChangelog/use-changelog.constants";

const queryCollectionAllMock = vi.fn<() => Promise<ChangelogEntry[]>>();

const defaultChangelogEntries: ChangelogEntry[] = [
  createFakeChangelogEntry({ version: "1.9.0", date: "2026-09-25" }),
  createFakeChangelogEntry({ version: "1.8.0", date: "2026-07-01" }),
];

describe("ChangelogModal Component", () => {
  let wrapper: VueWrapper;
  let changelogEntriesReference: Ref<unknown>;

  async function mountChangelogModal(options: MountSuspendedOptions<typeof ChangelogModal> = {}): Promise<VueWrapper> {
    return mountSuspended(ChangelogModal, {
      attachTo: document.body,
      global: { stubs: { ContentRenderer: { name: "ContentRenderer", template: "<div data-testid='changelog-entry-body'/>" } } },
      ...options,
    });
  }

  function getOpenState(): Ref<boolean> {
    return useState<boolean>(CHANGELOG_STATE_KEYS.IS_OPEN, () => false);
  }

  function getChangelogEntryFetcher(): (...arguments_: unknown[]) => unknown {
    return useAsyncDataMock.instance.mock.calls[0]?.[1] as (...arguments_: unknown[]) => unknown;
  }

  beforeEach(async() => {
    changelogEntriesReference = ref<unknown>(defaultChangelogEntries);
    queryCollectionAllMock.mockResolvedValue(defaultChangelogEntries);
    queryCollectionMock.instance.mockReturnValue({ all: queryCollectionAllMock });
    useAsyncDataMock.instance.mockReturnValue({ data: changelogEntriesReference, status: ref("success") });
    useState<boolean>(CHANGELOG_STATE_KEYS.IS_UNREAD, () => false).value = false;
    getOpenState().value = true;
    wrapper = await mountChangelogModal();
  });

  afterEach(() => {
    wrapper.unmount();
    document.body.innerHTML = "";
  });

  it("should render ChangelogModal when mounted.", () => {
    expect(wrapper.exists()).toBeTruthy();
  });

  it("should render the UModal component when mounted.", () => {
    expect(wrapper.findComponent({ name: "UModal" }).exists()).toBe(true);
  });

  it("should pass the changelog open state to UModal when mounted.", () => {
    expect(wrapper.findComponent({ name: "UModal" }).props("open")).toBe(true);
  });

  it("should pass the modal title translation key to UModal when mounted.", () => {
    expect(wrapper.findComponent({ name: "UModal" }).props("title")).toBe("changelog.modal.title");
  });

  it("should render the changelog modal body when mounted.", () => {
    expect(document.body.querySelector("[data-testid='changelog-modal']")).not.toBeNull();
  });

  it("should render the UChangelogVersions component when mounted.", () => {
    expect(wrapper.findComponent({ name: "UChangelogVersions" }).exists()).toBe(true);
  });

  it("should disable the indicator on the changelog versions when mounted.", () => {
    expect(wrapper.findComponent({ name: "UChangelogVersions" }).props("indicator")).toBe(false);
  });

  it("should disable the indicator on every changelog version when mounted.", () => {
    const indicatorProps = wrapper.findAllComponents<typeof UChangelogVersion>({ name: "UChangelogVersion" })
      .map(version => version.props("indicator"));

    expect(indicatorProps).toStrictEqual(defaultChangelogEntries.map(() => false));
  });

  it("should render one UChangelogVersion per entry when mounted.", () => {
    expect(wrapper.findAllComponents({ name: "UChangelogVersion" })).toHaveLength(defaultChangelogEntries.length);
  });

  it("should forward the entry fields to every UChangelogVersion when mounted.", () => {
    const versions = wrapper.findAllComponents<typeof UChangelogVersion>({ name: "UChangelogVersion" });

    expect(versions.map(version => ({
      badge: version.props("badge"),
      date: version.props("date"),
      title: version.props("title"),
      description: version.props("description"),
    }))).toStrictEqual(defaultChangelogEntries.map(entry => ({
      badge: `v${entry.version}`,
      date: entry.date,
      title: entry.title,
      description: entry.description,
    })));
  });

  it("should render a ContentRenderer body per entry when mounted.", () => {
    expect(document.body.querySelectorAll("[data-testid='changelog-entry-body']")).toHaveLength(defaultChangelogEntries.length);
  });

  it("should pass a locale-prefixed changelog key getter to useAsyncData when mounted.", () => {
    const keyGetter = useAsyncDataMock.instance.mock.calls[0]?.[0] as (() => string) | undefined;

    expect(keyGetter?.()).toBe("changelog-en");
  });

  it("should watch the locale with useAsyncData when mounted.", () => {
    const options = useAsyncDataMock.instance.mock.calls[0]?.[2];
    const { locale } = useI18n();

    expect(options?.watch).toStrictEqual([locale]);
  });

  it("should default the fetched changelog entries to an empty array when mounted.", () => {
    const options = useAsyncDataMock.instance.mock.calls[0]?.[2];

    expect(options?.default?.()).toStrictEqual([]);
  });

  it("should query the changelog collection for the current locale when the fetcher runs.", async() => {
    await getChangelogEntryFetcher()();

    expect(queryCollectionMock.instance).toHaveBeenCalledExactlyOnceWith("changelog_en");
  });

  it("should list every entry of the changelog collection when the fetcher runs.", async() => {
    await getChangelogEntryFetcher()();

    expect(queryCollectionAllMock).toHaveBeenCalledOnce();
  });

  it("should close the changelog when the modal reports it should close.", () => {
    getWrapperVm(wrapper.findComponent({ name: "UModal" })).$emit("update:open", false);

    expect(getOpenState().value).toBe(false);
  });

  it("should keep the changelog open when the modal reports it opened.", () => {
    getWrapperVm(wrapper.findComponent({ name: "UModal" })).$emit("update:open", true);

    expect(getOpenState().value).toBe(true);
  });
});