import { Given } from "@cucumber/cucumber";

import type { GoatItWorld } from "#acceptance/features/support/types/world.types.ts";
import { enableClientForwarding, exhaustRateLimitForClient } from "#acceptance/features/step-definitions/security/helpers/security.given-steps.helpers.ts";
import { SECURITY_CSP_CONSOLE_MATCH } from "#acceptance/features/step-definitions/security/security.steps.constants.ts";

Given(
  /^the rate limit budget for client "(?<clientIp>[^"]*)" is exhausted$/u,
  async function(this: GoatItWorld, clientIp: string): Promise<void> {
    this.lastApiResponse = await exhaustRateLimitForClient(this, clientIp);
  },
);

Given(
  /^the client "(?<clientIp>[^"]*)" is used for every browser request$/u,
  async function(this: GoatItWorld, clientIp: string): Promise<void> {
    await enableClientForwarding(this, clientIp);
  },
);

Given(
  /^content security policy violations are being monitored$/u,
  function(this: GoatItWorld): void {
    this.cspViolations = [];
    this.page.on("console", message => {
      if (message.type() === "error" && message.text().includes(SECURITY_CSP_CONSOLE_MATCH)) {
        this.cspViolations.push(message.text());
      }
    });
  },
);