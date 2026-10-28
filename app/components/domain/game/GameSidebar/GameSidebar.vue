<script lang="ts" setup>
import type { GameSidebarEmits, GameSidebarProps } from "@/components/domain/game/GameSidebar/game-sidebar.types";
import { GAME_SIDEBAR_ICONS, GAME_SIDEBAR_UI } from "@/components/domain/game/GameSidebar/game-sidebar.constants";

const props = defineProps<GameSidebarProps>();
const emit = defineEmits<GameSidebarEmits>();
const { t } = useI18n();

const { activeFiltersCount } = useGameQuestionsFilters();

const { isChangelogUnread, openChangelog } = useChangelogState();

function onUpdateOpen(value: boolean): void {
  emit("update:isSidebarOpen", value);
}

function onStartTutorial(): void {
  emit("startGameTutorial");
}

function onOpenSettings(): void {
  emit("openGameSettings");
}

function onOpenFilters(): void {
  emit("openGameFilters");
}

function onOpenChangelog(): void {
  openChangelog();
  emit("openChangelog");
}

function onAfterLeave(): void {
  emit("after:leave");
}
</script>

<template>
  <USlideover
    :close="false"
    :open="props.isSidebarOpen"
    side="left"
    :title="t('home.brand')"
    :ui="GAME_SIDEBAR_UI"
    @after:leave="onAfterLeave"
    @update:open="onUpdateOpen"
  >
    <template #title>
      <ULink
        class="flex gap-2 items-center"
        data-testid="game-sidebar"
        to="/"
      >
        <img
          alt=""
          class="h-8 w-8"
          decoding="async"
          height="64"
          loading="lazy"
          src="/img/logo/logo-64.avif"
          width="64"
        >

        <span class="font-semibold text-fg-primary text-lg">
          {{ t("home.brand") }}
        </span>
      </ULink>
    </template>

    <template #body>
      <div class="flex flex-col gap-3">
        <ULink
          v-if="props.isGameTutorialAvailable"
          class="flex gap-1.5 items-center"
          data-testid="game-sidebar-tutorial-link"
          @click="onStartTutorial"
        >
          <UIcon
            class="size-4"
            :name="GAME_SIDEBAR_ICONS.tutorial"
          />
          {{ t("game.interactiveTutorial.label") }}
        </ULink>

        <ULink
          class="flex gap-1.5 items-center"
          data-testid="game-sidebar-filters-link"
          @click="onOpenFilters"
        >
          <UIcon
            class="size-4"
            :name="GAME_SIDEBAR_ICONS.filters"
          />
          {{ t("game.questionsFilters.sidebarLabel") }}

          <GameQuestionsFiltersCountBadge
            v-if="activeFiltersCount > 0"
            class="ml-1"
            :count="activeFiltersCount"
            data-testid="game-sidebar-filters-count-badge"
          />
        </ULink>

        <ChangelogWhatsNewButton
          data-testid="game-sidebar-changelog-link"
          display-variant="menu"
          :is-changelog-unread="isChangelogUnread"
          @open-changelog="onOpenChangelog"
        />

        <ULink
          class="flex gap-1.5 items-center"
          data-testid="game-sidebar-rules-link"
          rel="noopener noreferrer"
          target="_blank"
          to="/rules"
        >
          <UIcon
            class="size-4"
            :name="GAME_SIDEBAR_ICONS.rules"
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
            :name="GAME_SIDEBAR_ICONS.backToHome"
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
          :icon="GAME_SIDEBAR_ICONS.settings"
          :label="t('game.settings.trigger')"
          variant="solid"
          @click="onOpenSettings"
        />
      </div>
    </template>
  </USlideover>
</template>