<script lang="ts" setup>
import type { DocsPageShellProps, DocsPageShellSlots } from "@/components/docs/DocsPageShell/docs-page-shell.types";

defineProps<DocsPageShellProps>();

defineSlots<DocsPageShellSlots>();
</script>

<template>
  <UPage class="max-w-7xl mx-auto px-6 w-full">
    <div class="max-w-3xl mx-auto w-full">
      <DocsBackLink/>

      <slot/>

      <DocsBackLink/>
    </div>

    <template #right>
      <DocsToc :sections="sections"/>
    </template>

    <DocsBackToTop/>
  </UPage>
</template>