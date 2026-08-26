export default defineNuxtPlugin(async() => {
  await useLocaleSuggestion();
});