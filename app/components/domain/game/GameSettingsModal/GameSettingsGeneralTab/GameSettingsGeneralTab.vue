<script lang="ts" setup>
import { GameSettingsAdultContentSwitch, GameSettingsLocaleSelect } from "#components";

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

    <GameSettingsAdultContentSwitch/>
  </div>
</template>