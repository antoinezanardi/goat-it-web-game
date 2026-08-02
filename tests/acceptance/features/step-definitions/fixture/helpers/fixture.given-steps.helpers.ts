import { loadFixture } from "#acceptance/features/support/fixtures/fixture.helpers.ts";
import type { FixtureDomain, FixtureKey } from "#acceptance/features/support/fixtures/fixture.types.ts";
import type { GoatItWorld } from "#acceptance/features/support/types/world.types.ts";

async function loadFixtureByDomain(world: GoatItWorld, domain: FixtureDomain, setName: string): Promise<void> {
  // Acceptable as setName comes from a regex capture group and is validated at runtime
  // oxlint-disable-next-line typescript/no-unsafe-type-assertion
  await loadFixture(world, domain, setName as FixtureKey<typeof domain>);
}

export {
  loadFixtureByDomain,
};