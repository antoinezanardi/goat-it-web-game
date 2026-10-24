import type { MaybeRefOrGetter, Ref } from "vue";

type ChangelogEntry = {
  version: string;
  date: string;
  title: string;
  description: string;
  path: string;
  body: unknown;
};

type UseChangelogOptions = {
  latestVersion: MaybeRefOrGetter<string | undefined>;
};

type UseChangelog = {
  isChangelogOpen: Ref<boolean>;
  openChangelog: () => void;
  closeChangelog: () => void;
};

export type { ChangelogEntry, UseChangelog, UseChangelogOptions };