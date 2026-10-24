<script lang="ts" setup>
import type {
  ChangelogWhatsNewButtonEmits,
  ChangelogWhatsNewButtonProps,
} from "@/components/domain/changelog/ChangelogWhatsNewButton/changelog-whats-new-button.types";

const props = withDefaults(defineProps<ChangelogWhatsNewButtonProps>(), {
  displayVariant: "button",
});

const emit = defineEmits<ChangelogWhatsNewButtonEmits>();

const isButtonVariant = computed<boolean>(() => props.displayVariant === "button");

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
    <ChangelogWhatsNewButtonContent :is-changelog-unread="props.isChangelogUnread"/>
  </UButton>

  <ULink
    v-else
    class="flex gap-1.5 items-center"
    @click="onOpenChangelog"
  >
    <ChangelogWhatsNewButtonContent :is-changelog-unread="props.isChangelogUnread"/>
  </ULink>
</template>