import { faker } from "@faker-js/faker";

import type { ChangelogEntry } from "~/composables/domain/useChangelog/use-changelog.types";

function createFakeChangelogEntry(changelogEntry: Partial<ChangelogEntry> = {}): ChangelogEntry {
  const version = faker.system.semver();

  return {
    version,
    date: faker.date.past().toISOString().slice(0, 10),
    title: faker.lorem.sentence(),
    description: faker.lorem.paragraph(),
    path: `/${version}`,
    body: {},
    ...changelogEntry,
  };
}

export {
  createFakeChangelogEntry,
};