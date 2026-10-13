import type { ComputedRef, MaybeRefOrGetter, Ref } from "vue";

type ChangelogEntry = {
  version: string;
  date: string;
  title: string;
  description: string;
  path: string;
  body: unknown;
};

type UseChangelogOptions = {
  entries: MaybeRefOrGetter<ChangelogEntry[]>;
};

type UseChangelog = {
  entries: ComputedRef<ChangelogEntry[]>;
  isOpen: Ref<boolean>;
  open: () => void;
  close: () => void;
};

export type { ChangelogEntry, UseChangelog, UseChangelogOptions };