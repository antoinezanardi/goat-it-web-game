import type { ChangelogEntry } from "@/composables/domain/useChangelog/use-changelog.types";

function compareSemverDescending(left: string, right: string): number {
  const leftParts = left.split(".").map(Number);
  const rightParts = right.split(".").map(Number);
  const partsCount = Math.max(leftParts.length, rightParts.length);

  for (let index = 0; index < partsCount; index += 1) {
    const leftPart = leftParts[index] ?? 0;
    const rightPart = rightParts[index] ?? 0;

    if (leftPart !== rightPart) {
      return rightPart - leftPart;
    }
  }
  return 0;
}

function compareChangelogEntriesDescending(left: ChangelogEntry, right: ChangelogEntry): number {
  if (left.date === right.date) {
    return compareSemverDescending(left.version, right.version);
  }
  return right.date.localeCompare(left.date);
}

function sortChangelogEntries(entries: ChangelogEntry[]): ChangelogEntry[] {
  return [...entries].toSorted(compareChangelogEntriesDescending);
}

export { sortChangelogEntries };