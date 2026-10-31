<script lang="ts" setup>
import type { ChangelogWhatsNewButtonContentProps } from "@/components/domain/changelog/ChangelogWhatsNewButton/ChangelogWhatsNewButtonContent/changelog-whats-new-button-content.types";
import { CHANGELOG_ICON } from "@/utils/ui/changelog/changelog.constants";

const props = defineProps<ChangelogWhatsNewButtonContentProps>();

const { t } = useI18n();
</script>

<template>
  <span class="flex gap-1.5 items-center">
    <UIcon
      class="size-4"
      :name="CHANGELOG_ICON"
    />

    {{ t("changelog.entryPoint") }}

    <ClientOnly>
      <span
        v-if="props.isChangelogUnread"
        aria-hidden="true"
        class="bg-primary inline-block ml-1 rounded-full size-2"
        data-testid="changelog-unread-indicator"
      />
    </ClientOnly>
  </span>
</template>