import { Given } from "@cucumber/cucumber";

import type { GoatItWorld } from "#acceptance/features/support/types/world.types.ts";

Given(
  /^the user browser languages are "(?<languages>[^"]*)"$/u,
  async function(this: GoatItWorld, languages: string): Promise<void> {
    const browserLanguages = languages.split(",");

    await this.page.addInitScript(injectedLanguages => {
      Object.defineProperty(navigator, "languages", {
        configurable: true,
        get: (): string[] => injectedLanguages,
      });
    }, browserLanguages);
  },
);