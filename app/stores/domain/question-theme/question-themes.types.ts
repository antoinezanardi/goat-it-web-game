/**
 * Lifecycle of the question-theme catalog.
 *
 * `loading` while no active theme is available and the current fetch is idle or in flight, `refreshing`
 * while an available catalog is being re-fetched, `ready` when a catalog is available, no fetch is in
 * flight, and the last fetch did not fail, `stale` when an available catalog's last fetch failed, and
 * `unavailable` when a finished fetch leaves no active theme.
 */
type QuestionThemeCatalogStatus = "loading" | "refreshing" | "ready" | "stale" | "unavailable";

export type { QuestionThemeCatalogStatus };