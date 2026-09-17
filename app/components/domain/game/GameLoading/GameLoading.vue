<script setup lang="ts">
import type { GameLoadingProps } from "@/components/domain/game/GameLoading/game-loading.types";

const props = withDefaults(defineProps<GameLoadingProps>(), {
  isTranslating: false,
});

const { t } = useI18n();

const spinnerLabel = computed<string>(() => t(props.isTranslating ? "game.translatingQuestions" : "game.loadingQuestions"));
</script>

<template>
  <div class="flex flex-1 items-center justify-center">
    <LoadingSpinner :label="spinnerLabel"/>
  </div>
</template>