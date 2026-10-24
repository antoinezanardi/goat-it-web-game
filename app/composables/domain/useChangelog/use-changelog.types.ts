import type { MaybeRefOrGetter, Ref } from "vue";

type ChangelogEntry = {
  version: string;
  date: string;
  title: string;
  description: string;
  /** Content path of the changelog document. */
  path: string;
  /** Parsed body of the changelog document, rendered by the changelog modal. */
  body: unknown;
};

type UseChangelogOptions = {
  /** Undefined while the changelog content is unavailable; nothing is announced and the unread flag stays false. */
  latestVersion: MaybeRefOrGetter<string | undefined>;
};

/**
 * Changelog modal controls and shared open state returned by `useChangelog`.
 */
type UseChangelog = {
  /** Shared through Nuxt state, so every consumer observes the same modal. */
  isChangelogOpen: Ref<boolean>;
  openChangelog: () => void;
  closeChangelog: () => void;
};

export type { ChangelogEntry, UseChangelog, UseChangelogOptions };