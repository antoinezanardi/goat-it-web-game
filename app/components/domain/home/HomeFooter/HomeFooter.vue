<script lang="ts" setup>
import { HOME_HOW_TO_PLAY_BUTTON_UI } from "@/components/domain/home/HomeFooter/home-footer.constants";
</script>

<template>
  <footer
    class="flex items-center justify-between px-6 py-4"
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

    <div class="flex flex-col-reverse gap-2 items-center sm:flex-row">
      <VersionButton/>

      <ChangelogWhatsNewButton data-testid="home-changelog-button"/>
    </div>
  </footer>
</template>