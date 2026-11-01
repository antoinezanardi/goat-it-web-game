<script lang="ts" setup>
import { CHANGELOG_ICON } from "@/utils/ui/changelog/changelog.constants";
import type { ChangelogCollectionName } from "@/components/domain/changelog/ChangelogModal/changelog-modal.types";
import { CHANGELOG_MODAL_UI } from "@/components/domain/changelog/ChangelogModal/changelog-modal.constants";
import { sortChangelogEntries } from "@/components/domain/changelog/ChangelogModal/helpers/changelog-sorting/changelog-sorting.helpers";

const { locale, t } = useI18n();

const changelogCollection = computed<ChangelogCollectionName>(() => `changelog_${locale.value}` as ChangelogCollectionName);

const { data: latestRelease } = useAsyncData(
  () => `changelog-latest-${locale.value}`,
  () => queryCollection(changelogCollection.value)
    .select("version", "date", "title", "description")
    .order("date", "DESC")
    .limit(1)
    .first(),
  { lazy: true, server: false, watch: [locale] },
);

const latestVersion = computed<string | undefined>(() => latestRelease.value?.version);

const {
  data: changelogEntries,
  status: changelogEntriesStatus,
  execute: fetchChangelogEntries,
} = useAsyncData(
  () => `changelog-${locale.value}`,
  () => queryCollection(changelogCollection.value).all(),
  { default: () => [], immediate: false, server: false },
);

const sortedChangelogEntries = computed(() => sortChangelogEntries(changelogEntries.value));

const { isChangelogOpen, closeChangelog } = useChangelog({ latestVersion });

const { hasEverOpened } = useLazyModal({ isOpen: isChangelogOpen });

const requestedLocale = ref<string>();

function requestChangelogEntries(): void {
  requestedLocale.value = locale.value;
  void fetchChangelogEntries();
}

watch(isChangelogOpen, isChangelogOpenValue => {
  if (isChangelogOpenValue && requestedLocale.value !== locale.value) {
    requestChangelogEntries();
  }
});

watch(locale, () => {
  if (isChangelogOpen.value) {
    requestChangelogEntries();
  }
});

function onUpdateOpen(value: boolean): void {
  if (!value) {
    closeChangelog();
  }
}
</script>

<template>
  <div
    id="changelog-modal-container"
    class="contents"
  >
    <LazyUModal
      v-if="hasEverOpened"
      :open="isChangelogOpen"
      :ui="CHANGELOG_MODAL_UI"
      @update:open="onUpdateOpen"
    >
      <template #title>
        <DefaultModalTitle
          data-testid="changelog-modal-title"
          :icon="CHANGELOG_ICON"
          :title="t('changelog.modal.title')"
        />
      </template>

      <template #body>
        <ChangelogModalContent
          :changelog-entries="sortedChangelogEntries"
          :changelog-entries-status="changelogEntriesStatus"
        />
      </template>

      <template #footer>
        <DefaultModalFooter
          data-testid="changelog-modal-footer"
          disable-shortcuts
          @close-modal="closeChangelog"
        />
      </template>
    </LazyUModal>
  </div>
</template>