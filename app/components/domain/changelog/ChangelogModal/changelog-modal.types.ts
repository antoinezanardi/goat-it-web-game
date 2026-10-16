import type { Collections } from "@nuxt/content";

type ChangelogCollectionName = Extract<keyof Collections, `changelog_${string}`>;

export type { ChangelogCollectionName };