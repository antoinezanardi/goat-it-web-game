<script lang="ts" setup>
import { HOME_PLAY_BUTTON_UI } from "@/components/domain/home/HomePlayButton/home-play-button.constants";
</script>

<template>
  <div
    id="home-play-button-container"
    class="mt-4"
    data-testid="home-play-button"
  >
    <UButton
      :label="$t('home.playButton')"
      size="xl"
      to="/game"
      :ui="HOME_PLAY_BUTTON_UI"
    />
  </div>
</template>

<style scoped>
#home-play-button-container {
  position: relative;
  z-index: 0;
  width: fit-content;
  padding: 5px;
  background: linear-gradient(90deg, #03a9f4, #f441a5);
  border-radius: 0.9em;
  transition: all 0.4s ease;
}

#home-play-button-container::before {
  content: '';
  position: absolute;
  inset: 0;
  margin: auto;
  border-radius: 0.9em;
  z-index: -1;
  background: linear-gradient(90deg, #03a9f4, #f441a5);
  filter: blur(0);
  transition: opacity 0.6s ease, filter 0.4s ease;
  opacity: 0;
}

#home-play-button-container:hover::before {
  filter: blur(0.8em);
  opacity: 1;
}
</style>