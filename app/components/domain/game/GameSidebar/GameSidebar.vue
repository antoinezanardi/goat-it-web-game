<script lang="ts" setup>
import type { GameSidebarEmits, GameSidebarProps } from "@/components/domain/game/GameSidebar/game-sidebar.types";
import { GAME_SIDEBAR_UI } from "@/components/domain/game/GameSidebar/game-sidebar.constants";

const props = defineProps<GameSidebarProps>();
const emit = defineEmits<GameSidebarEmits>();
const { t } = useI18n();

function onUpdateOpen(value: boolean): void {
  emit("update:isOpen", value);
}

function onStartTutorial(): void {
  emit("startTutorial");
}

function onOpenSettings(): void {
  emit("openSettings");
}
</script>

<template>
  <USlideover
    :open="props.isOpen"
    side="left"
    :title="t('home.brand')"
    :ui="GAME_SIDEBAR_UI"
    @update:open="onUpdateOpen"
  >
    <template #header>
      <ULink
        class="flex gap-2 items-center"
        data-testid="game-sidebar"
        to="/"
      >
        <img
          alt=""
          class="h-8 w-8"
          src="/img/logo/logo-64.avif"
        >

        <span class="font-semibold text-fg-primary text-lg">
          {{ t("home.brand") }}
        </span>
      </ULink>
    </template>

    <template #body>
      <div class="flex flex-col gap-3">
        <ULink
          v-if="props.isTutorialAvailable"
          class="flex gap-1.5 items-center"
          data-testid="game-sidebar-tutorial-link"
          @click="onStartTutorial"
        >
          <UIcon
            class="size-4"
            name="i-lucide-compass"
          />
          {{ t("game.interactiveTutorial.label") }}
        </ULink>

        <ULink
          class="flex gap-1.5 items-center"
          data-testid="game-sidebar-rules-link"
          target="_blank"
          to="/rules"
        >
          <UIcon
            class="size-4"
            name="i-lucide-book-open"
          />
          {{ t("game.rules") }}
        </ULink>

        <ULink
          class="flex gap-1.5 items-center"
          data-testid="game-sidebar-back-to-home-link"
          to="/"
        >
          <UIcon
            class="size-4"
            name="i-lucide-house"
          />
          {{ t("game.backToHome") }}
        </ULink>
      </div>
    </template>

    <template #footer>
      <div
        class="w-full"
        data-testid="game-sidebar-footer"
      >
        <UButton
          block
          color="secondary"
          data-testid="game-sidebar-settings-button"
          icon="i-lucide-settings"
          :label="t('game.settings.trigger')"
          variant="solid"
          @click="onOpenSettings"
        />
      </div>
    </template>
  </USlideover>
</template>