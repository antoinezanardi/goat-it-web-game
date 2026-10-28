<template>
  <StatusScreen
    icon="i-lucide-party-popper"
    test-id="game-no-more-questions"
    :title="$t('game.noMoreQuestions')"
  >
    <template #actions>
      <UButton
        :label="$t('game.backToHome')"
        size="xl"
        to="/"
      />
    </template>
  </StatusScreen>
</template>