<script lang="ts" setup>
import { CHANGELOG_ICON } from "@/utils/ui/changelog/changelog.constants";
import type { ChangelogModalContentProps } from "@/components/domain/changelog/ChangelogModal/ChangelogModalContent/changelog-modal-content.types";
import {
  CHANGELOG_MODAL_ERROR_ICON,
  CHANGELOG_VERSION_UI,
} from "@/components/domain/changelog/ChangelogModal/ChangelogModalContent/changelog-modal-content.constants";

const props = defineProps<ChangelogModalContentProps>();

const { t } = useI18n();

const isChangelogEntriesLoading = computed<boolean>(() => props.changelogEntriesStatus === "idle" || props.changelogEntriesStatus === "pending");

const isChangelogEntriesError = computed<boolean>(() => props.changelogEntriesStatus === "error");

const isChangelogEntriesEmpty = computed<boolean>(() => props.changelogEntries.length === 0);

const statusAnnouncement = computed<string>(() => {
  if (isChangelogEntriesLoading.value) {
    return t("changelog.modal.loading");
  }
  if (isChangelogEntriesError.value) {
    return t("changelog.modal.error");
  }
  return isChangelogEntriesEmpty.value ? t("changelog.modal.empty") : "";
});
</script>

<template>
  <div
    class="flex flex-col h-full"
    data-testid="changelog-modal"
  >
    <p
      class="sr-only"
      role="status"
    >
      {{ statusAnnouncement }}
    </p>

    <div
      :aria-busy="isChangelogEntriesLoading"
      class="flex flex-1 flex-col focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary min-h-0"
      data-testid="changelog-modal-body"
      tabindex="0"
    >
      <Transition
        mode="out-in"
        name="fade-slide-up"
      >
        <div
          v-if="isChangelogEntriesLoading"
          key="loading"
          class="flex flex-col gap-3"
          data-testid="changelog-modal-loading"
        >
          <ChangelogModalSkeleton/>
        </div>

        <StatusScreen
          v-else-if="isChangelogEntriesError"
          key="error"
          :icon="CHANGELOG_MODAL_ERROR_ICON"
          test-id="changelog-modal-error"
          :title="t('changelog.modal.error')"
        />

        <StatusScreen
          v-else-if="isChangelogEntriesEmpty"
          key="empty"
          :icon="CHANGELOG_ICON"
          test-id="changelog-modal-empty"
          :title="t('changelog.modal.empty')"
        />

        <LazyUChangelogVersions
          v-else
          key="entries"
          class="docs-prose"
          :indicator="false"
        >
          <LazyUChangelogVersion
            v-for="entry in props.changelogEntries"
            :key="entry.version"
            :badge="`v${entry.version}`"
            :date="entry.date"
            :description="entry.description"
            :indicator="false"
            :title="entry.title"
            :ui="CHANGELOG_VERSION_UI"
          >
            <template #body>
              <LazyContentRenderer :value="entry"/>
            </template>
          </LazyUChangelogVersion>
        </LazyUChangelogVersions>
      </Transition>
    </div>
  </div>
</template>