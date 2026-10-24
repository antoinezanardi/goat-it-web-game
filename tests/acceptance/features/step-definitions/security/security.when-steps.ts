import { When } from "@cucumber/cucumber";

import type { GoatItWorld } from "#acceptance/features/support/types/world.types.ts";
import { postJsonBodyAsClient, postNonJsonBodyAsClient, requestRouteAsClient, visitPage } from "#acceptance/features/step-definitions/security/helpers/security.when-steps.helpers.ts";

When(
  /^the user requests the "(?<route>[^"]*)" route as client "(?<clientIp>[^"]*)"$/u,
  async function(this: GoatItWorld, route: string, clientIp: string): Promise<void> {
    this.lastApiResponse = await requestRouteAsClient(this, route, clientIp);
  },
);

When(
  /^the user posts a json body of (?<bodySizeInBytes>\d+) bytes to the "(?<route>[^"]*)" route as client "(?<clientIp>[^"]*)"$/u,
  async function(this: GoatItWorld, bodySizeInBytes: string, route: string, clientIp: string): Promise<void> {
    this.lastApiResponse = await postJsonBodyAsClient(this, route, Number(bodySizeInBytes), clientIp);
  },
);

When(
  /^the user posts a non json body to the "(?<route>[^"]*)" route as client "(?<clientIp>[^"]*)"$/u,
  async function(this: GoatItWorld, route: string, clientIp: string): Promise<void> {
    this.lastApiResponse = await postNonJsonBodyAsClient(this, route, clientIp);
  },
);

When(
  /^the user visits the "(?<path>[^"]*)" page$/u,
  async function(this: GoatItWorld, path: string): Promise<void> {
    await visitPage(this, path);
  },
);