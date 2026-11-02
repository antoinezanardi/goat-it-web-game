import { When } from "@cucumber/cucumber";

import { VALID_HTTP_METHODS } from "#acceptance/features/support/constants/http.constants.ts";
import type { HttpMethod } from "#acceptance/features/support/types/http.types.ts";
import type { GoatItWorld } from "#acceptance/features/support/types/world.types.ts";
import { sendHttpRequest } from "#acceptance/features/step-definitions/http/helpers/http.when-steps.helpers.ts";

When(
  new RegExp(`^the user sends a (?<method>${VALID_HTTP_METHODS.join("|")}) request to the "(?<route>[^"]*)" route$`, "u"),
  async function(this: GoatItWorld, method: HttpMethod, route: string): Promise<void> {
    this.lastApiResponse = await sendHttpRequest(this.context.request, method, route);
  },
);