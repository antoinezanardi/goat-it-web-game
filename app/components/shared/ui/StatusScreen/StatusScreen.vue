<script lang="ts" setup>
import type { StatusScreenProps, StatusScreenSlots } from "@/components/shared/ui/StatusScreen/status-screen.types";
import { STATUS_SCREEN_VARIANT_CLASSES, STATUS_SCREEN_VARIANT_TITLE_TAGS } from "@/components/shared/ui/StatusScreen/status-screen.constants";

const props = withDefaults(defineProps<StatusScreenProps>(), {
  variant: "section",
});

defineSlots<StatusScreenSlots>();

const variantClasses = computed(() => STATUS_SCREEN_VARIANT_CLASSES[props.variant]);
const titleTag = computed(() => STATUS_SCREEN_VARIANT_TITLE_TAGS[props.variant]);
const iconClasses = computed(() => [variantClasses.value.icon, props.iconClass ?? variantClasses.value.iconColor]);
const titleTestId = computed<string | undefined>(() => (props.testId === undefined ? undefined : `${props.testId}-title`));
const descriptionTestId = computed<string | undefined>(() => (props.testId === undefined ? undefined : `${props.testId}-description`));
</script>

<template>
  <div
    :class="variantClasses.root"
    :data-testid="props.testId"
  >
    <div :class="variantClasses.copy">
      <div :class="variantClasses.header">
        <UIcon
          aria-hidden="true"
          :class="iconClasses"
          :name="props.icon"
        />

        <component
          :is="titleTag"
          :class="variantClasses.title"
          :data-testid="titleTestId"
        >
          <slot name="title">
            {{ props.title }}
          </slot>
        </component>
      </div>

      <p
        v-if="props.description !== undefined || $slots.description"
        :class="variantClasses.description"
        :data-testid="descriptionTestId"
      >
        <slot name="description">
          {{ props.description }}
        </slot>
      </p>
    </div>

    <div
      v-if="$slots.actions"
      :class="variantClasses.actions"
    >
      <slot name="actions"/>
    </div>
  </div>
</template>