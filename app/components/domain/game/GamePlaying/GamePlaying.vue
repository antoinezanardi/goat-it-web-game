<script lang="ts" setup>
import type { GamePlayingEmits, GamePlayingProps } from "@/components/domain/game/GamePlaying/game-playing.types";

const props = defineProps<GamePlayingProps>();
const emit = defineEmits<GamePlayingEmits>();

function onNextGameQuestion(): void {
  emit("next");
}

function onPreviousGameQuestion(): void {
  emit("previous");
}
</script>

<template>
  <div class="flex flex-1 flex-col">
    <div class="flex flex-1 items-center justify-center py-6">
      <GameQuestionCard
        class="w-full"
        :question="props.question"
      />
    </div>

    <div class="bottom-0 flex gap-3 items-center max-w-3xl md:justify-between mx-auto pb-[max(1.5rem,env(safe-area-inset-bottom))] pt-3 sticky w-full">
      <div class="h-10 shrink-0 w-10">
        <Transition name="fade">
          <GamePreviousQuestionButton
            v-if="props.canGoBack"
            @click="onPreviousGameQuestion"
          />
        </Transition>
      </div>

      <GameNextQuestionButton
        class="flex-1 md:flex-none md:self-end md:w-auto"
        @click="onNextGameQuestion"
      />
    </div>
  </div>
</template>