<script lang="ts" setup>
const SKELETON_ENTRY_KEYS = ["first", "second"] as const;
const SKELETON_DESCRIPTION_WIDTHS = ["w-full", "w-11/12", "w-4/5"] as const;
const SKELETON_BLOCK_CLASSES = "motion-reduce:animate-none";
</script>

<template>
  <div
    aria-hidden="true"
    class="flex flex-col gap-8"
    data-testid="changelog-modal-skeleton"
  >
    <div
      v-for="entryKey in SKELETON_ENTRY_KEYS"
      :key="entryKey"
      class="flex flex-col gap-3"
      data-testid="changelog-modal-skeleton-entry"
    >
      <USkeleton
        class="h-5 w-24"
        :class="SKELETON_BLOCK_CLASSES"
        data-testid="changelog-modal-skeleton-version"
      />

      <USkeleton
        class="h-8 w-3/5"
        :class="SKELETON_BLOCK_CLASSES"
        data-testid="changelog-modal-skeleton-title"
      />

      <div class="flex flex-col gap-2">
        <USkeleton
          v-for="descriptionWidth in SKELETON_DESCRIPTION_WIDTHS"
          :key="descriptionWidth"
          class="h-4"
          :class="[
            SKELETON_BLOCK_CLASSES,
            descriptionWidth
          ]"
          data-testid="changelog-modal-skeleton-description"
        />
      </div>
    </div>
  </div>
</template>