<template>
  <div
    class="flex flex-1 flex-col gap-6 items-center justify-center px-4 py-6"
    data-testid="game-no-more-questions"
  >
    <UIcon
      aria-hidden="true"
      class="size-20"
      name="i-lucide-party-popper"
    />

    <p class="font-medium text-center text-fg-primary text-xl">
      {{ $t("game.noMoreQuestions") }}
    </p>

    <UButton
      :label="$t('game.backToHome')"
      size="xl"
      to="/"
    />
  </div>
</template>