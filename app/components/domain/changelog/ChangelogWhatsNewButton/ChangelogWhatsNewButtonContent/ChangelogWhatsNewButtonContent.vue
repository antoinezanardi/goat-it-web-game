<script lang="ts" setup>
import type { ChangelogWhatsNewButtonContentProps } from "@/components/domain/changelog/ChangelogWhatsNewButton/ChangelogWhatsNewButtonContent/changelog-whats-new-button-content.types";
import { CHANGELOG_ICON, CHANGELOG_UNREAD_STATUS_ID } from "@/utils/ui/changelog/changelog.constants";

const props = defineProps<ChangelogWhatsNewButtonContentProps>();

const { t } = useI18n();

const UNREAD_INDICATOR_CLASSES = "changelog-unread-indicator-pulse";
</script>

<template>
  <span class="flex gap-1.5 items-center">
    <span class="inline-flex relative">
      <UIcon
        aria-hidden="true"
        class="size-4"
        :name="CHANGELOG_ICON"
      />

      <ClientOnly>
        <span
          v-if="props.isChangelogUnread"
          aria-hidden="true"
          class="-end-0.5 -top-0.5 absolute bg-primary pointer-events-none ring-2 ring-card rounded-full size-2 z-10"
          :class="UNREAD_INDICATOR_CLASSES"
          data-testid="changelog-unread-indicator"
        />
      </ClientOnly>
    </span>

    {{ t("changelog.entryPoint") }}

    <span
      :id="CHANGELOG_UNREAD_STATUS_ID"
      aria-hidden="true"
      class="sr-only"
      data-testid="changelog-unread-status"
    >
      <ClientOnly>
        {{ props.isChangelogUnread ? t("changelog.unreadStatus") : "" }}
      </ClientOnly>
    </span>
  </span>
</template>

<style scoped>
.changelog-unread-indicator-pulse {
  animation: changelog-unread-indicator-pulse 1.8s ease-in-out infinite;
}

@keyframes changelog-unread-indicator-pulse {
  0%,
  100% {
    opacity: 1;
    transform: scale(1);
  }

  50% {
    opacity: .55;
    transform: scale(.9);
  }
}

@media (prefers-reduced-motion: reduce) {
  .changelog-unread-indicator-pulse {
    animation: none;
  }
}
</style>