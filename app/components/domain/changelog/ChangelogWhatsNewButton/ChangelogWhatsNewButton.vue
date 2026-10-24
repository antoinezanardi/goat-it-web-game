<script lang="ts" setup>
import type {
  ChangelogWhatsNewButtonEmits,
  ChangelogWhatsNewButtonProps,
} from "@/components/domain/changelog/ChangelogWhatsNewButton/changelog-whats-new-button.types";

const props = withDefaults(defineProps<ChangelogWhatsNewButtonProps>(), {
  variant: "button",
});

const emit = defineEmits<ChangelogWhatsNewButtonEmits>();

const isButtonVariant = computed<boolean>(() => props.variant === "button");

function onOpenChangelog(): void {
  emit("openChangelog");
}
</script>

<template>
  <UButton
    v-if="isButtonVariant"
    color="primary"
    size="md"
    variant="soft"
    @click="onOpenChangelog"
  >
    <ChangelogWhatsNewButtonContent :is-unread="props.isUnread"/>
  </UButton>

  <ULink
    v-else
    class="flex gap-1.5 items-center"
    @click="onOpenChangelog"
  >
    <ChangelogWhatsNewButtonContent :is-unread="props.isUnread"/>
  </ULink>
</template>