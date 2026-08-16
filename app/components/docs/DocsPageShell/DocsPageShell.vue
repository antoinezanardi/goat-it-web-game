<script lang="ts" setup>
import type { DocsPageShellProps, DocsPageShellSlots } from "@/components/docs/DocsPageShell/docs-page-shell.types";

defineProps<DocsPageShellProps>();

defineSlots<DocsPageShellSlots>();
</script>

<template>
  <UPage class="max-w-7xl mx-auto px-6 w-full">
    <div class="max-w-3xl mx-auto py-8 w-full">
      <DocsBackLink/>

      <slot/>

      <div class="mt-8">
        <DocsBackLink/>
      </div>
    </div>

    <template #right>
      <DocsToc :sections="sections"/>
    </template>

    <DocsBackToTop/>
  </UPage>
</template>