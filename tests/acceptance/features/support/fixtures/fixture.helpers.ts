import type { Document } from "mongodb";

import { DOMAIN_TO_COLLECTION_MAP, FIXTURE_REGISTRY } from "#acceptance/features/support/fixtures/fixture.constants.ts";
import type { FixtureDefinition, FixtureDomain, FixtureKey, FixtureReference } from "#acceptance/features/support/fixtures/fixture.types.ts";
import type { GoatItWorld } from "#acceptance/features/support/types/world.types.ts";

async function loadFixtureDependencies(
  world: GoatItWorld,
  dependencies: readonly FixtureReference<FixtureDomain>[],
  inProgress: Set<string>,
): Promise<void> {
  for (const [dependencyDomain, dependencyName] of dependencies) {
    // Acceptable as dependencies must be loaded sequentially and in order
    // oxlint-disable-next-line no-await-in-loop
    await loadFixture(world, dependencyDomain, dependencyName, inProgress);
  }
}

async function loadFixture<Domain extends FixtureDomain>(
  world: GoatItWorld,
  domain: Domain,
  name: FixtureKey<Domain>,
  inProgress: Set<string> = new Set(),
): Promise<void> {
  // Acceptable as completedFixtureKeys must be initialized once per world instance for cross-call deduplication
  // oxlint-disable-next-line no-param-reassign
  world.completedFixtureKeys ??= new Set();

  const key = `${domain}:${String(name)}`;

  if (world.completedFixtureKeys.has(key)) {
    return;
  }

  if (inProgress.has(key)) {
    throw new Error(`Circular fixture dependency detected: "${key}" is already being loaded.`);
  }
  inProgress.add(key);

  // Acceptable as TypeScript cannot resolve the correlated union type for FIXTURE_REGISTRY[domain][name]
  // oxlint-disable-next-line typescript/no-unsafe-type-assertion
  const fixture = FIXTURE_REGISTRY[domain][name] as unknown as FixtureDefinition<unknown>;

  if (fixture.dependencies) {
    // Acceptable as TypeScript cannot correlate fixture.dependencies' domain-key pairs
    // oxlint-disable-next-line typescript/no-unsafe-type-assertion
    const dependencies = fixture.dependencies as readonly FixtureReference<FixtureDomain>[];
    await loadFixtureDependencies(world, dependencies, inProgress);
  }

  const collectionName = DOMAIN_TO_COLLECTION_MAP[domain];

  // Acceptable as fixture.data is read-only unknown[] and Document[] is the correct MongoDB document type
  // oxlint-disable-next-line typescript/no-unsafe-type-assertion
  await world.mongoDb.collection(collectionName).insertMany(fixture.data as Document[]);

  inProgress.delete(key);
  world.completedFixtureKeys.add(key);
}

export {
  loadFixture,
};