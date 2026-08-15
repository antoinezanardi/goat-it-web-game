<script lang="ts" setup>
import type { DocsPageShellProps } from "@/components/docs/DocsPageShell/docs-page-shell.types";

defineProps<DocsPageShellProps>();

defineSlots<{
  default: () => unknown;
}>();
</script>

<template>
  <div class="lg:gap-12 lg:grid lg:grid-cols-[minmax(0,1fr)_190px] max-w-7xl mx-auto px-6 w-full">
    <div class="max-w-3xl mx-auto w-full">
      <DocsBackLink/>

      <slot/>
    </div>

    <DocsToc :sections="sections"/>

    <DocsBackToTop/>
  </div>
</template>