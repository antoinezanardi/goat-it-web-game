import type { AsyncDataRequestStatus } from "#app";
import type { ChangelogEntry } from "@/composables/domain/useChangelog/use-changelog.types";

type ChangelogModalContentProps = {
  changelogEntries: ChangelogEntry[];
  changelogEntriesStatus: AsyncDataRequestStatus;
};

export type { ChangelogModalContentProps };