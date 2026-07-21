import type { Document } from "mongodb";

import { FIXTURE_REGISTRY } from "#acceptance/features/support/fixtures/fixture.constants.ts";
import type { FixtureDefinition, FixtureDomain, FixtureKey, FixtureReference } from "#acceptance/features/support/fixtures/fixture.types.ts";
import type { GoatItWorld } from "#acceptance/features/support/types/world.types.ts";

const DOMAIN_TO_COLLECTION_MAP: Record<FixtureDomain, string> = {
  "question": "questions",
  "question-theme": "question_themes",
};

async function loadFixtureDependencies(
  world: GoatItWorld,
  dependencies: readonly FixtureReference<FixtureDomain>[],
  loaded: Set<string>,
): Promise<void> {
  for (const [dependencyDomain, dependencyName] of dependencies) {
    // Acceptable as dependencies must be loaded sequentially and in order
    // oxlint-disable-next-line no-await-in-loop
    await loadFixture(world, dependencyDomain, dependencyName, loaded);
  }
}

async function loadFixture<Domain extends FixtureDomain>(
  world: GoatItWorld,
  domain: Domain,
  name: FixtureKey<Domain>,
  loadedKeys: Set<string> = new Set(),
): Promise<void> {
  const key = `${domain}:${String(name)}`;

  if (loadedKeys.has(key)) {
    throw new Error(`Circular fixture dependency detected: Trying to load already loaded fixture "${key}".`);
  }
  loadedKeys.add(key);

  // Acceptable as TypeScript cannot resolve the correlated union type for FIXTURE_REGISTRY[domain][name]
  // oxlint-disable-next-line typescript/no-unsafe-type-assertion
  const fixture = FIXTURE_REGISTRY[domain][name] as unknown as FixtureDefinition<unknown>;

  if (fixture.dependencies) {
    // Acceptable as TypeScript cannot correlate fixture.dependencies' domain-key pairs
    // oxlint-disable-next-line typescript/no-unsafe-type-assertion
    const dependencies = fixture.dependencies as readonly FixtureReference<FixtureDomain>[];
    await loadFixtureDependencies(world, dependencies, loadedKeys);
  }

  const collectionName = DOMAIN_TO_COLLECTION_MAP[domain];

  // Acceptable as fixture.data is read-only unknown[] and Document[] is the correct MongoDB document type
  // oxlint-disable-next-line typescript/no-unsafe-type-assertion
  await world.mongoDb.collection(collectionName).insertMany(fixture.data as Document[]);
}

export {
  loadFixture,
};