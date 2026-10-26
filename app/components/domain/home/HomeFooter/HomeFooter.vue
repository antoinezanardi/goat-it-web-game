<script lang="ts" setup>
import { HOME_HOW_TO_PLAY_BUTTON_UI } from "@/components/domain/home/HomeFooter/home-footer.constants";
</script>

<template>
  <footer
    class="flex items-center justify-between pb-[max(1rem,env(safe-area-inset-bottom))] pl-[max(1.5rem,env(safe-area-inset-left))] pr-[max(1.5rem,env(safe-area-inset-right))] pt-4"
    data-testid="home-footer"
  >
    <UButton
      data-testid="home-how-to-play-button"
      icon="i-lucide-help-circle"
      :label="$t('home.howToPlay')"
      size="lg"
      to="/rules"
      :ui="HOME_HOW_TO_PLAY_BUTTON_UI"
      variant="solid"
    />
  </footer>
</template>