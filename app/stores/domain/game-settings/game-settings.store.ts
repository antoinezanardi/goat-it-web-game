export const useGameSettingsStore = defineStore(StoreNames.GAME_SETTINGS, () => {
  const isAdultContentEnabled = ref<boolean>(false);

  function setAdultContentEnabled(value: boolean): void {
    isAdultContentEnabled.value = value;
  }
  return {
    isAdultContentEnabled,
    setAdultContentEnabled,
  };
});