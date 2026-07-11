<script lang="ts" setup>
const questionThemesStore = useQuestionThemesStore();
const { fetchAndStoreQuestionThemes } = questionThemesStore;

void callOnce(fetchAndStoreQuestionThemes);
</script>

<template>
  <UApp>
    <NuxtPage/>
  </UApp>
</template>