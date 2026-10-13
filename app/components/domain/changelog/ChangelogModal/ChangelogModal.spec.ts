import { mountSuspended } from "@nuxt/test-utils/runtime";
import type { VueWrapper } from "@vue/test-utils";
import { flushPromises } from "@vue/test-utils";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import type { Mock } from "vitest";
import { nextTick, ref } from "vue";
import type { Ref } from "vue";

import type { MountSuspendedOptions } from "~~/tests/unit/utils/types/mount.types";
import { getWrapperVm } from "~~/tests/unit/utils/helpers/vtu.helpers";
import { createFakeChangelogEntry } from "~~/tests/unit/utils/faketories/changelog/changelog-entry.entity.faketory";
import { useAsyncDataMock } from "~~/tests/unit/setup/nuxt/composables/use-async-data.nuxt.unit-setup";
import { queryCollectionMock } from "~~/tests/unit/setup/nuxt/composables/query-collection.nuxt.unit-setup";
import { createQueryCollectionMockEntry } from "~~/tests/unit/utils/mocks/composables/nuxt/queryCollection/queryCollection.mock";
import type { QueryCollectionMockEntry } from "~~/tests/unit/utils/mocks/composables/nuxt/queryCollection/queryCollection.mock";
import type { UseAsyncDataMockResult } from "~~/tests/unit/utils/mocks/composables/nuxt/useAsyncData/useAsyncData.mock";

import { ChangelogModal } from "#components";
import type { DefaultModalFooter, DefaultModalTitle, UChangelogVersion } from "#components";

import { CHANGELOG_MODAL_UI, CHANGELOG_VERSION_UI } from "@/components/domain/changelog/ChangelogModal/changelog-modal.constants";
import type { ChangelogEntry } from "~/composables/domain/useChangelog/use-changelog.types";
import { StateNames } from "#shared/enums/state.enums";

const defaultChangelogEntries: ChangelogEntry[] = [
  createFakeChangelogEntry({ version: "1.9.0", date: "2026-09-25" }),
  createFakeChangelogEntry({ version: "1.8.0", date: "2026-07-01" }),
];

describe("ChangelogModal Component", () => {
  let wrapper: VueWrapper;
  let latestReleaseReference: Ref<unknown>;
  let changelogEntriesReference: Ref<unknown>;
  let changelogEntriesStatusReference: Ref<string>;
  let queryCollectionEntry: QueryCollectionMockEntry;
  let fetchChangelogEntriesMock: Mock<() => Promise<unknown>>;

  async function mountChangelogModal(options: MountSuspendedOptions<typeof ChangelogModal> = {}): Promise<VueWrapper> {
    return mountSuspended(ChangelogModal, {
      attachTo: document.body,
      global: { stubs: { ContentRenderer: { name: "ContentRenderer", template: "<div data-testid='changelog-entry-body'/>" } } },
      ...options,
    });
  }

  function getOpenState(): Ref<boolean> {
    return useState<boolean>(StateNames.CHANGELOG_IS_OPEN, () => false);
  }

  function getLatestReleaseFetcher(): (...arguments_: unknown[]) => unknown {
    return useAsyncDataMock.instance.mock.calls[0]?.[1] as (...arguments_: unknown[]) => unknown;
  }

  function getChangelogEntriesFetcher(): (...arguments_: unknown[]) => unknown {
    return useAsyncDataMock.instance.mock.calls[1]?.[1] as (...arguments_: unknown[]) => unknown;
  }

  function getChangelogEntriesOptions(): { default?: () => unknown; immediate?: boolean; server?: boolean } | undefined {
    return useAsyncDataMock.instance.mock.calls[1]?.[2];
  }

  beforeEach(async() => {
    latestReleaseReference = ref<unknown>(createFakeChangelogEntry({ version: "1.9.0", date: "2026-09-25" }));
    changelogEntriesReference = ref<unknown>(defaultChangelogEntries);
    changelogEntriesStatusReference = ref("success");
    fetchChangelogEntriesMock = vi.fn<() => Promise<unknown>>().mockResolvedValue(undefined);
    queryCollectionEntry = createQueryCollectionMockEntry();
    queryCollectionMock.instance.mockReturnValue(queryCollectionEntry);
    useAsyncDataMock.instance.mockImplementation((key: unknown): UseAsyncDataMockResult => {
      const keyValue = typeof key === "function" ? (key as () => string)() : String(key);

      if (keyValue.startsWith("changelog-latest")) {
        return {
          data: latestReleaseReference,
          status: ref("success"),
          execute: vi.fn<() => Promise<unknown>>().mockResolvedValue(undefined),
        };
      }
      return {
        data: changelogEntriesReference,
        status: changelogEntriesStatusReference,
        execute: fetchChangelogEntriesMock,
      };
    });
    useState<boolean>(StateNames.CHANGELOG_IS_UNREAD, () => false).value = false;
    getOpenState().value = true;
    wrapper = await mountChangelogModal();
  });

  afterEach(() => {
    wrapper.unmount();
    document.body.innerHTML = "";
    useI18n().locale.value = "en";
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

  it("should pass the changelog modal ui config to UModal when mounted.", () => {
    expect(wrapper.findComponent({ name: "UModal" }).props("ui")).toStrictEqual(CHANGELOG_MODAL_UI);
  });

  it("should pass the title translation key to the modal title when mounted.", () => {
    const title = wrapper.findComponent<typeof DefaultModalTitle>("[data-testid='changelog-modal-title']");

    expect(title.props("title")).toBe("changelog.modal.title");
  });

  it("should pass the sparkles icon to the modal title when mounted.", () => {
    const title = wrapper.findComponent<typeof DefaultModalTitle>("[data-testid='changelog-modal-title']");

    expect(title.props("icon")).toBe("i-lucide-sparkles");
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

  it("should pass the changelog version ui config to every changelog version when mounted.", () => {
    const versionUiProps = wrapper.findAllComponents<typeof UChangelogVersion>({ name: "UChangelogVersion" })
      .map(version => version.props("ui"));

    expect(versionUiProps).toStrictEqual(defaultChangelogEntries.map(() => CHANGELOG_VERSION_UI));
  });

  it("should render one UChangelogVersion per entry when mounted.", () => {
    expect(wrapper.findAllComponents({ name: "UChangelogVersion" })).toHaveLength(defaultChangelogEntries.length);
  });

  it("should sort the changelog entries by date descending when the entries are unsorted.", async() => {
    changelogEntriesReference.value = [
      createFakeChangelogEntry({ version: "1.0.0", date: "2026-08-01" }),
      createFakeChangelogEntry({ version: "2.0.0", date: "2026-09-25" }),
    ];
    await nextTick();

    const badges = wrapper.findAllComponents<typeof UChangelogVersion>({ name: "UChangelogVersion" })
      .map(version => version.props("badge"));

    expect(badges).toStrictEqual(["v2.0.0", "v1.0.0"]);
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

  it("should render every entry body with the docs prose class when mounted.", () => {
    const contentRendererClasses = wrapper.findAllComponents({ name: "ContentRenderer" }).map(contentRenderer => contentRenderer.classes());

    for (const entryClasses of contentRendererClasses) {
      expect(entryClasses).toContain("docs-prose");
    }
  });

  it("should render a loading spinner when the changelog entries are pending.", async() => {
    changelogEntriesStatusReference.value = "pending";
    await nextTick();

    expect({
      spinner: wrapper.findComponent({ name: "LoadingSpinner" }).exists(),
      versions: wrapper.findComponent({ name: "UChangelogVersions" }).exists(),
    }).toStrictEqual({
      spinner: true,
      versions: false,
    });
  });

  it("should render a loading spinner when the changelog entries were not fetched yet.", async() => {
    changelogEntriesStatusReference.value = "idle";
    await nextTick();

    expect({
      spinner: wrapper.findComponent({ name: "LoadingSpinner" }).exists(),
      versions: wrapper.findComponent({ name: "UChangelogVersions" }).exists(),
    }).toStrictEqual({
      spinner: true,
      versions: false,
    });
  });

  it("should render a generic error message when the changelog entries failed to load.", async() => {
    changelogEntriesStatusReference.value = "error";
    await nextTick();

    expect(document.body.querySelector("[data-testid='changelog-modal']")?.textContent).toContain("errors.generic");
  });

  it("should not render the changelog versions when the changelog entries failed to load.", async() => {
    changelogEntriesStatusReference.value = "error";
    await nextTick();

    expect(wrapper.findComponent({ name: "UChangelogVersions" }).exists()).toBe(false);
  });

  it("should pass a locale-prefixed latest release key getter to useAsyncData when mounted.", () => {
    const keyGetter = useAsyncDataMock.instance.mock.calls[0]?.[0] as (() => string) | undefined;

    expect(keyGetter?.()).toBe("changelog-latest-en");
  });

  it("should pass a locale-prefixed changelog entries key getter to useAsyncData when mounted.", () => {
    const keyGetter = useAsyncDataMock.instance.mock.calls[1]?.[0] as (() => string) | undefined;

    expect(keyGetter?.()).toBe("changelog-en");
  });

  it("should watch the locale with the latest release query when mounted.", () => {
    const options = useAsyncDataMock.instance.mock.calls[0]?.[2];
    const { locale } = useI18n();

    expect(options?.watch).toStrictEqual([locale]);
  });

  it("should default the latest release to undefined when mounted.", () => {
    const options = useAsyncDataMock.instance.mock.calls[0]?.[2];

    expect(options?.default?.()).toBeUndefined();
  });

  it("should fetch the changelog entries on the client only when mounted.", () => {
    expect(getChangelogEntriesOptions()?.server).toBe(false);
  });

  it("should not fetch the changelog entries immediately when mounted.", () => {
    expect(getChangelogEntriesOptions()?.immediate).toBe(false);
  });

  it("should default the fetched changelog entries to an empty array when mounted.", () => {
    expect(getChangelogEntriesOptions()?.default?.()).toStrictEqual([]);
  });

  it("should query the changelog collection for the current locale when the latest release fetcher runs.", async() => {
    await getLatestReleaseFetcher()();

    expect(queryCollectionMock.instance).toHaveBeenCalledExactlyOnceWith("changelog_en");
  });

  it("should select only the release metadata fields when the latest release fetcher runs.", async() => {
    await getLatestReleaseFetcher()();

    expect(queryCollectionEntry.select).toHaveBeenCalledExactlyOnceWith("version", "date", "title", "description");
  });

  it("should order the latest release by date descending when the latest release fetcher runs.", async() => {
    await getLatestReleaseFetcher()();

    expect(queryCollectionEntry.order).toHaveBeenCalledExactlyOnceWith("date", "DESC");
  });

  it("should limit the latest release query to one release when the latest release fetcher runs.", async() => {
    await getLatestReleaseFetcher()();

    expect(queryCollectionEntry.limit).toHaveBeenCalledExactlyOnceWith(1);
  });

  it("should return the first latest release when the latest release fetcher runs.", async() => {
    await getLatestReleaseFetcher()();

    expect(queryCollectionEntry.first).toHaveBeenCalledOnce();
  });

  it("should query the changelog collection for the current locale when the changelog entries fetcher runs.", async() => {
    await getChangelogEntriesFetcher()();

    expect(queryCollectionMock.instance).toHaveBeenCalledExactlyOnceWith("changelog_en");
  });

  it("should list every entry of the changelog collection when the changelog entries fetcher runs.", async() => {
    await getChangelogEntriesFetcher()();

    expect(queryCollectionEntry.all).toHaveBeenCalledOnce();
  });

  it("should fetch the changelog entries when the modal is opened for the first time.", async() => {
    const openState = getOpenState();
    openState.value = false;
    await nextTick();

    openState.value = true;
    await nextTick();

    expect(fetchChangelogEntriesMock).toHaveBeenCalledOnce();
  });

  it("should not fetch the changelog entries again when the modal is reopened with the same locale.", async() => {
    const openState = getOpenState();
    openState.value = false;
    await nextTick();
    openState.value = true;
    await nextTick();
    openState.value = false;
    await nextTick();
    openState.value = true;
    await nextTick();

    expect(fetchChangelogEntriesMock).toHaveBeenCalledOnce();
  });

  it("should fetch the changelog entries again when the locale changes while the modal is open.", async() => {
    const openState = getOpenState();
    openState.value = false;
    await nextTick();
    openState.value = true;
    await nextTick();

    const { locale } = useI18n();
    locale.value = "fr";
    await flushPromises();

    expect(fetchChangelogEntriesMock).toHaveBeenCalledTimes(2);
  });

  it("should not fetch the changelog entries when the locale changes while the modal is closed.", async() => {
    const openState = getOpenState();
    openState.value = false;
    await nextTick();

    const { locale } = useI18n();
    locale.value = "fr";
    await flushPromises();

    expect(fetchChangelogEntriesMock).not.toHaveBeenCalled();
  });

  it("should fetch the changelog entries on the next opening when the locale changed while the modal was closed.", async() => {
    const openState = getOpenState();
    openState.value = false;
    await nextTick();

    const { locale } = useI18n();
    locale.value = "fr";
    await flushPromises();

    openState.value = true;
    await nextTick();

    expect(fetchChangelogEntriesMock).toHaveBeenCalledOnce();
  });

  it("should close the changelog when the modal reports it should close.", () => {
    getWrapperVm(wrapper.findComponent({ name: "UModal" })).$emit("update:open", false);

    expect(getOpenState().value).toBe(false);
  });

  it("should keep the changelog open when the modal reports it opened.", () => {
    getWrapperVm(wrapper.findComponent({ name: "UModal" })).$emit("update:open", true);

    expect(getOpenState().value).toBe(true);
  });

  it("should render the default modal footer when mounted.", () => {
    expect(wrapper.findComponent<typeof DefaultModalFooter>({ name: "DefaultModalFooter" }).exists()).toBe(true);
  });

  it("should render the changelog modal footer with the correct data-testid when mounted.", () => {
    expect(document.body.querySelector("[data-testid='changelog-modal-footer']")).not.toBeNull();
  });

  it("should close the changelog when the default modal footer reports a close.", () => {
    getWrapperVm(wrapper.findComponent({ name: "DefaultModalFooter" })).$emit("closeModal");

    expect(getOpenState().value).toBe(false);
  });
});