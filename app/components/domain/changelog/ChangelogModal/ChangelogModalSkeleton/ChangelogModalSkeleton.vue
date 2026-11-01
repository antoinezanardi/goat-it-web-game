<script lang="ts" setup>
import {
  CHANGELOG_MODAL_SKELETON_BLOCK_CLASSES,
  CHANGELOG_MODAL_SKELETON_DESCRIPTION_WIDTHS,
  CHANGELOG_MODAL_SKELETON_ENTRY_KEYS,
} from "@/components/domain/changelog/ChangelogModal/ChangelogModalSkeleton/changelog-modal-skeleton.constants";
</script>

<template>
  <div
    aria-hidden="true"
    class="flex flex-col gap-8"
    data-testid="changelog-modal-skeleton"
  >
    <div
      v-for="entryKey in CHANGELOG_MODAL_SKELETON_ENTRY_KEYS"
      :key="entryKey"
      class="flex flex-col gap-3"
      data-testid="changelog-modal-skeleton-entry"
    >
      <USkeleton
        class="h-5 w-24"
        :class="CHANGELOG_MODAL_SKELETON_BLOCK_CLASSES"
        data-testid="changelog-modal-skeleton-version"
      />

      <USkeleton
        class="h-8 w-3/5"
        :class="CHANGELOG_MODAL_SKELETON_BLOCK_CLASSES"
        data-testid="changelog-modal-skeleton-title"
      />

      <div class="flex flex-col gap-2">
        <USkeleton
          v-for="descriptionWidth in CHANGELOG_MODAL_SKELETON_DESCRIPTION_WIDTHS"
          :key="descriptionWidth"
          class="h-4"
          :class="[
            CHANGELOG_MODAL_SKELETON_BLOCK_CLASSES,
            descriptionWidth
          ]"
          data-testid="changelog-modal-skeleton-description"
        />
      </div>
    </div>
  </div>
</template>