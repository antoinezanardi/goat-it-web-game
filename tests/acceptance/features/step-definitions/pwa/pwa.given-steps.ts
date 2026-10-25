import { Given } from "@cucumber/cucumber";

import type { GoatItWorld } from "#acceptance/features/support/types/world.types.ts";
import {
  routeRandomQuestionsNetworkFailure,
  routeRandomQuestionsServerError,
  waitForOfflineFallbackPrecache,
} from "#acceptance/features/step-definitions/pwa/helpers/pwa.given-steps.helpers.ts";

Given(
  /^the service worker has precached the offline fallback$/u,
  async function(this: GoatItWorld): Promise<void> {
    await waitForOfflineFallbackPrecache(this.page);
  },
);

Given(
  /^the random questions request returns a server error$/u,
  async function(this: GoatItWorld): Promise<void> {
    await routeRandomQuestionsServerError(this.context);
  },
);

Given(
  /^the random questions request fails without a response$/u,
  async function(this: GoatItWorld): Promise<void> {
    await routeRandomQuestionsNetworkFailure(this.context);
  },
);