<script lang="ts" setup>
import type { DocsPageShellProps, DocsPageShellSlots } from "@/components/docs/DocsPageShell/docs-page-shell.types";

defineProps<DocsPageShellProps>();

defineSlots<DocsPageShellSlots>();
</script>

<template>
  <UPage class="max-w-7xl mx-auto pe-[max(1.5rem,env(safe-area-inset-right))] ps-[max(1.5rem,env(safe-area-inset-left))] w-full">
    <div class="max-w-3xl mx-auto pb-[max(2rem,env(safe-area-inset-bottom))] pt-[max(2rem,env(safe-area-inset-top))] w-full">
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