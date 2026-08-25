<script lang="ts" setup>
import type { ExampleRoundSlots } from "@/components/content/example-round.types";
import { EXAMPLE_ROUND_BUTTON_UI } from "@/components/content/example-round.constants";

defineSlots<ExampleRoundSlots>();

const isOpen = ref(false);
</script>

<template>
  <UCollapsible v-model:open="isOpen">
    <UButton
      block
      class="group justify-between"
      color="secondary"
      data-testid="example-round-trigger"
      icon="i-lucide-drama"
      trailing-icon="i-lucide-chevron-down"
      :ui="EXAMPLE_ROUND_BUTTON_UI"
      variant="ghost"
    >
      <span class="font-medium text-sm">
        <slot
          v-if="isOpen"
          name="triggerClose"
        />

        <slot
          v-else
          name="triggerOpen"
        />
      </span>
    </UButton>

    <template #content>
      <div class="example-round-content mt-1 px-4 py-3">
        <slot/>
      </div>
    </template>
  </UCollapsible>
</template>