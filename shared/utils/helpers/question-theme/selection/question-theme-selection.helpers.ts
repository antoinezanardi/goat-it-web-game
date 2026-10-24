/**
 * Reconciles saved theme ids with the active catalog.
 *
 * Returns `undefined` when no theme filter should be sent (no saved ids and no
 * active catalog), the saved ids when they still intersect the catalog, and
 * every active id when the saved selection is stale or empty.
 *
 * @example
 * const activeThemeIds = ["theme-a", "theme-b"];
 * resolveSelectedThemeIds(["theme-a", "stale"], activeThemeIds); // ["theme-a"]
 * resolveSelectedThemeIds(["stale"], activeThemeIds); // ["theme-a", "theme-b"]
 */
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