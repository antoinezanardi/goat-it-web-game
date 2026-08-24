<script lang="ts" setup>
import type { ExampleRoundSlots } from "@/components/content/example-round.types";
import { EXAMPLE_ROUND_BUTTON_UI, EXAMPLE_ROUND_COLLAPSIBLE_UI } from "@/components/content/example-round.constants";

defineSlots<ExampleRoundSlots>();
</script>

<template>
  <UCollapsible :ui="EXAMPLE_ROUND_COLLAPSIBLE_UI">
    <UButton
      block
      class="bg-content group justify-between min-h-10 rounded-lg"
      color="neutral"
      data-testid="example-round-trigger"
      trailing-icon="i-lucide-chevron-down"
      :ui="EXAMPLE_ROUND_BUTTON_UI"
      variant="outline"
    >
      <span class="font-medium text-fg-primary text-sm">
        <slot name="trigger"/>
      </span>
    </UButton>

    <template #content>
      <UCard class="mt-1">
        <slot/>
      </UCard>
    </template>
  </UCollapsible>
</template>