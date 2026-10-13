<script lang="ts" setup>
import type { ChangelogCollectionName } from "@/components/domain/changelog/ChangelogModal/changelog-modal.types";

const { locale, t } = useI18n();

const changelogCollection = computed<ChangelogCollectionName>(() => `changelog_${locale.value}` as ChangelogCollectionName);

const { data: changelogEntries } = useAsyncData(
  () => `changelog-${locale.value}`,
  () => queryCollection(changelogCollection.value).all(),
  { watch: [locale], default: () => [] },
);

const { entries, isOpen, close } = useChangelog({ entries: changelogEntries });

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
    :title="t('changelog.modal.title')"
    @update:open="onUpdateOpen"
  >
    <template #body>
      <div data-testid="changelog-modal">
        <UChangelogVersions :indicator="false">
          <UChangelogVersion
            v-for="entry in entries"
            :key="entry.version"
            :badge="`v${entry.version}`"
            :date="entry.date"
            :description="entry.description"
            :indicator="false"
            :title="entry.title"
          >
            <template #body>
              <ContentRenderer :value="entry"/>
            </template>
          </UChangelogVersion>
        </UChangelogVersions>
      </div>
    </template>
  </UModal>
</template>