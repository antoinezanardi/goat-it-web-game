<script lang="ts" setup>
import type { ChangelogCollectionName } from "@/components/domain/changelog/ChangelogModal/changelog-modal.types";
import { CHANGELOG_MODAL_UI } from "@/components/domain/changelog/ChangelogModal/changelog-modal.constants";
import { sortChangelogEntries } from "~/composables/domain/useChangelog/helpers/changelog.helpers";

const { locale, t } = useI18n();

const changelogCollection = computed<ChangelogCollectionName>(() => `changelog_${locale.value}` as ChangelogCollectionName);

const { data: latestRelease } = useAsyncData(
  () => `changelog-latest-${locale.value}`,
  () => queryCollection(changelogCollection.value)
    .select("version", "date", "title", "description")
    .order("date", "DESC")
    .limit(1)
    .first(),
  { watch: [locale], default: () => { /* empty */ } },
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

const { isOpen, close } = useChangelog({ latestVersion });

const requestedLocale = ref<string>();

function requestChangelogEntries(): void {
  requestedLocale.value = locale.value;
  void fetchChangelogEntries();
}

watch(isOpen, isOpenValue => {
  if (isOpenValue && requestedLocale.value !== locale.value) {
    requestChangelogEntries();
  }
});

watch(locale, () => {
  if (isOpen.value) {
    requestChangelogEntries();
  }
});

function onUpdateOpen(value: boolean): void {
  if (!value) {
    close();
  }
}
</script>

<template>
  <UModal
    :open="isOpen"
    scrollable
    :ui="CHANGELOG_MODAL_UI"
    @update:open="onUpdateOpen"
  >
    <template #title>
      <DefaultModalTitle
        data-testid="changelog-modal-title"
        icon="i-lucide-sparkles"
        :title="t('changelog.modal.title')"
      />
    </template>

    <template #body>
      <div data-testid="changelog-modal">
        <LoadingSpinner v-if="changelogEntriesStatus === 'idle' || changelogEntriesStatus === 'pending'"/>

        <p v-else-if="changelogEntriesStatus === 'error'">
          {{ t("errors.generic") }}
        </p>

        <UChangelogVersions
          v-else
          :indicator="false"
        >
          <UChangelogVersion
            v-for="entry in sortedChangelogEntries"
            :key="entry.version"
            :badge="`v${entry.version}`"
            :date="entry.date"
            :description="entry.description"
            :indicator="false"
            :title="entry.title"
          >
            <template #body>
              <ContentRenderer
                class="docs-prose"
                :value="entry"
              />
            </template>
          </UChangelogVersion>
        </UChangelogVersions>
      </div>
    </template>

    <template #footer>
      <div class="flex justify-end w-full">
        <UButton
          color="neutral"
          data-testid="changelog-modal-footer-close-button"
          icon="i-lucide-x"
          :label="t('common.close')"
          @click="close"
        />
      </div>
    </template>
  </UModal>
</template>