import { describe, expect, it } from "vitest";

import { createFakeChangelogEntry } from "~~/tests/unit/utils/faketories/changelog/changelog-entry.entity.faketory";

import { sortChangelogEntries } from "@/components/domain/changelog/ChangelogModal/helpers/changelog-sorting/changelog-sorting.helpers";
import type { ChangelogEntry } from "@/composables/domain/useChangelog/use-changelog.types";

describe(sortChangelogEntries, () => {
  it("should sort entries by date descending when dates differ.", () => {
    const older = createFakeChangelogEntry({ version: "2.0.0", date: "2026-08-01" });
    const newer = createFakeChangelogEntry({ version: "1.0.0", date: "2026-09-25" });

    expect(sortChangelogEntries([older, newer]).map(entry => entry.date)).toStrictEqual(["2026-09-25", "2026-08-01"]);
  });

  it("should rank a higher minor version above a lower one regardless of string order when dates are equal.", () => {
    const ten = createFakeChangelogEntry({ version: "1.10.0", date: "2026-09-25" });
    const nine = createFakeChangelogEntry({ version: "1.9.0", date: "2026-09-25" });

    expect(sortChangelogEntries([nine, ten]).map(entry => entry.version)).toStrictEqual(["1.10.0", "1.9.0"]);
  });

  it.each<{ versions: [string, string] }>([
    { versions: ["1.9", "1.9.1"] },
    { versions: ["1.9.1", "1.9"] },
  ])("should pad a missing semver segment with zero when versions are $versions.", ({ versions }) => {
    const first = createFakeChangelogEntry({ version: versions[0], date: "2026-09-25" });
    const second = createFakeChangelogEntry({ version: versions[1], date: "2026-09-25" });

    expect(sortChangelogEntries([first, second]).map(entry => entry.version)).toStrictEqual(["1.9.1", "1.9"]);
  });

  it("should treat entries with equal dates and versions as equal when sorting.", () => {
    const first = createFakeChangelogEntry({ version: "1.9.0", date: "2026-09-25", title: "First" });
    const second = createFakeChangelogEntry({ version: "1.9.0", date: "2026-09-25", title: "Second" });

    expect(sortChangelogEntries([first, second]).map(entry => entry.title)).toStrictEqual(["First", "Second"]);
  });

  it("should not mutate the source array when sorting.", () => {
    const entries: ChangelogEntry[] = [
      createFakeChangelogEntry({ date: "2026-08-01" }),
      createFakeChangelogEntry({ date: "2026-09-25" }),
    ];

    sortChangelogEntries(entries);

    expect(entries[0]?.date).toBe("2026-08-01");
  });
});