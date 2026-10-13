<script lang="ts" setup>
import { StateNames } from "#shared/enums/state.enums";
import type { ChangelogWhatsNewButtonContentProps } from "@/components/domain/changelog/ChangelogWhatsNewButton/changelog-whats-new-button-content.types";

defineProps<ChangelogWhatsNewButtonContentProps>();

const { t } = useI18n();
const isUnread = useState<boolean>(StateNames.CHANGELOG_IS_UNREAD, () => false);
</script>

<template>
  <span class="flex gap-1.5 items-center">
    <UIcon
      class="size-4"
      :class="iconClass"
      name="i-lucide-sparkles"
    />

    {{ t("changelog.entryPoint") }}

    <span
      v-if="isUnread"
      aria-hidden="true"
      class="bg-primary inline-block ml-1 rounded-full size-2"
      data-testid="changelog-unread-indicator"
    />
  </span>
</template>