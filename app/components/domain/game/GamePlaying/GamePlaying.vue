<script lang="ts" setup>
import type { GamePlayingEmits, GamePlayingProps } from "@/components/domain/game/GamePlaying/game-playing.types";

const props = defineProps<GamePlayingProps>();
const emit = defineEmits<GamePlayingEmits>();

function onNext(): void {
  emit("next");
}
</script>

<template>
  <div class="flex flex-col min-h-dvh">
    <div class="flex flex-1 items-center justify-center py-6">
      <GameQuestionCard
        class="w-full"
        :question="props.question"
      />
    </div>

    <div class="bottom-0 flex flex-col max-w-3xl mx-auto pb-[max(1.5rem,env(safe-area-inset-bottom))] pt-3 sticky w-full">
      <GameNextButton @click="onNext"/>
    </div>
  </div>
</template>