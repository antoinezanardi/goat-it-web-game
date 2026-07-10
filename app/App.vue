<script lang="ts" setup>
const questionThemesStore = useQuestionThemesStore();
const { fetchAndStoreQuestionThemes } = questionThemesStore;

const { t } = useI18n();

void callOnce(fetchAndStoreQuestionThemes);
</script>

<template>
  <main>
    <h1>{{ t("home.pageTitle") }}</h1>
  </main>
</template>