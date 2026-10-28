<script lang="ts" setup>
import type { StatusScreenProps, StatusScreenSlots } from "@/components/shared/ui/StatusScreen/status-screen.types";
import { STATUS_SCREEN_VARIANT_CLASSES } from "@/components/shared/ui/StatusScreen/status-screen.constants";

const props = withDefaults(defineProps<StatusScreenProps>(), {
  titleTag: "h2",
  variant: "section",
});

defineSlots<StatusScreenSlots>();

const variantClasses = computed(() => STATUS_SCREEN_VARIANT_CLASSES[props.variant]);
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
        <slot name="icon">
          <UIcon
            v-if="props.icon"
            aria-hidden="true"
            :class="[
              props.iconClass ?? variantClasses.iconColor
            ]"
            :name="props.icon"
          />
        </slot>

        <component
          :is="props.titleTag"
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