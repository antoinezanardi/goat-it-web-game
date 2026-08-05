<script lang="ts" setup>
import type { LoadingSpinnerProps } from "@/components/shared/ui/LoadingSpinner/loading-spinner.types";

defineProps<LoadingSpinnerProps>();
</script>

<template>
  <div
    class="flex flex-col gap-2 items-center"
    data-testid="loading-spinner"
  >
    <UIcon
      aria-hidden="true"
      class="animate-spin size-10"
      name="i-lucide-loader-circle"
    />

    <span
      v-if="label"
      class="text-fg-secondary text-sm"
      data-testid="loading-spinner-label"
    >
      {{ label }}
    </span>
  </div>
</template>