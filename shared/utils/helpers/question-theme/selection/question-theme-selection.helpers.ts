function resolveSelectedThemeIds(savedThemeIds: readonly string[] | undefined, activeThemeIds: readonly string[]): string[] | undefined {
  if (activeThemeIds.length === 0) {
    return savedThemeIds === undefined ? undefined : [...savedThemeIds];
  }
  const activeSelection = activeThemeIds.filter(themeId => savedThemeIds?.includes(themeId) ?? false);
  if (activeSelection.length === 0) {
    return [...activeThemeIds];
  }
  return activeSelection;
}

export { resolveSelectedThemeIds };