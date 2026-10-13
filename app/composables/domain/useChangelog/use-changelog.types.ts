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
  isOpen: Ref<boolean>;
  open: () => void;
  close: () => void;
};

export type { ChangelogEntry, UseChangelog, UseChangelogOptions };