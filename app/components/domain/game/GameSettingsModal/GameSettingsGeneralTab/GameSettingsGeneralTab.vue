<script lang="ts" setup>
import { GameSettingsAdultContentSwitch, GameSettingsCognitiveDifficultiesFilter, GameSettingsLocaleSelect } from "#components";

import type { GameSettingsGeneralTabProps } from "@/components/domain/game/GameSettingsModal/GameSettingsGeneralTab/game-settings-general-tab.types";

const props = defineProps<GameSettingsGeneralTabProps>();
</script>

<template>
  <div
    class="flex flex-col gap-3"
    data-testid="game-settings-general-tab"
  >
    <GameSettingsLocaleSelect :is-disabled="props.isLocaleSelectDisabled"/>

    <USeparator/>

    <GameSettingsCognitiveDifficultiesFilter/>

    <USeparator/>

    <GameSettingsAdultContentSwitch/>
  </div>
</template>