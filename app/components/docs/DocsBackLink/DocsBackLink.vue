<template>
  <UButton
    data-testid="docs-back-link"
    icon="i-lucide-arrow-left"
    :label="$t('docs.backHome')"
    to="/"
    :ui="{ 'base': 'text-fg-primary' }"
    variant="ghost"
  />
</template>