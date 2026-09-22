<script lang="ts" setup>
import { GameSettingsAboutTab, GameSettingsGeneralTab } from "#components";

import type { TabsItem } from "#ui/types";
import type { GameSettingsModalEmits, GameSettingsModalProps } from "@/components/domain/game/GameSettingsModal/game-settings-modal.types";
import { GAME_SETTINGS_TAB_ABOUT, GAME_SETTINGS_TAB_GENERAL } from "@/components/domain/game/GameSettingsModal/game-settings-modal.constants";

const props = defineProps<GameSettingsModalProps>();
const emit = defineEmits<GameSettingsModalEmits>();

const { t } = useI18n();

const activeTab = ref<string | number>(GAME_SETTINGS_TAB_GENERAL);

const tabItems = computed<TabsItem[]>(() => [
  {
    value: GAME_SETTINGS_TAB_GENERAL,
    label: t("game.settings.tabs.general"),
    icon: "i-lucide-settings",
    slot: GAME_SETTINGS_TAB_GENERAL,
  },
  {
    value: GAME_SETTINGS_TAB_ABOUT,
    label: t("game.settings.tabs.about"),
    icon: "i-lucide-info",
    slot: GAME_SETTINGS_TAB_ABOUT,
  },
]);

watch(() => props.open, (isOpen: boolean) => {
  if (isOpen) {
    activeTab.value = GAME_SETTINGS_TAB_GENERAL;
  }
});

function onUpdateOpen(value: boolean): void {
  emit("update:open", value);
}
</script>

<template>
  <UModal
    :open="props.open"
    scrollable
    @update:open="onUpdateOpen"
  >
    <template #title>
      <DefaultModalTitle
        data-testid="game-settings-modal-title"
        icon="i-lucide-settings"
        :title="t('game.settings.title')"
      />
    </template>

    <template #body>
      <div
        class="flex flex-col gap-4"
        data-testid="game-settings-modal"
      >
        <UTabs
          v-model="activeTab"
          :items="tabItems"
        >
          <template #general>
            <GameSettingsGeneralTab :disabled="props.isFetchingQuestions"/>
          </template>

          <template #about>
            <GameSettingsAboutTab/>
          </template>
        </UTabs>
      </div>
    </template>
  </UModal>
</template>