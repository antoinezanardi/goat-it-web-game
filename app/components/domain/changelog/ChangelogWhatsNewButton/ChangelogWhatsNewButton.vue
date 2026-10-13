<script lang="ts" setup>
import type { ChangelogWhatsNewButtonProps } from "@/components/domain/changelog/ChangelogWhatsNewButton/changelog-whats-new-button.types";
import { CHANGELOG_STATE_KEYS } from "~/composables/domain/useChangelog/use-changelog.constants";

const props = withDefaults(defineProps<ChangelogWhatsNewButtonProps>(), {
  variant: "button",
});

const { t } = useI18n();
const isUnread = useState<boolean>(CHANGELOG_STATE_KEYS.IS_UNREAD, () => false);
const isOpen = useState<boolean>(CHANGELOG_STATE_KEYS.IS_OPEN, () => false);

function onOpenChangelog(): void {
  isOpen.value = true;
}
</script>

<template>
  <UButton
    v-if="props.variant === 'button'"
    color="neutral"
    icon="i-lucide-sparkles"
    :label="t('changelog.entryPoint')"
    size="md"
    variant="outline"
    @click="onOpenChangelog"
  >
    <template #trailing>
      <span
        v-if="isUnread"
        aria-hidden="true"
        class="bg-primary inline-block ml-1 rounded-full size-2"
        data-testid="changelog-unread-indicator"
      />
    </template>
  </UButton>

  <ULink
    v-else
    class="flex gap-1.5 items-center"
    @click="onOpenChangelog"
  >
    <UIcon
      class="size-4"
      name="i-lucide-sparkles"
    />

    {{ t("changelog.entryPoint") }}

    <span
      v-if="isUnread"
      aria-hidden="true"
      class="bg-primary inline-block ml-1 rounded-full size-2"
      data-testid="changelog-unread-indicator"
    />
  </ULink>
</template>