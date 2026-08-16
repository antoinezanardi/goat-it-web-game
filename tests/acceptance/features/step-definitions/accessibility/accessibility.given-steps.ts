import { Given } from "@cucumber/cucumber";

import type { GoatItWorld } from "#acceptance/features/support/types/world.types.ts";
import {
  DESKTOP_VIEWPORT,
  MOBILE_VIEWPORT,
} from "#acceptance/features/step-definitions/accessibility/accessibility.steps.constants.ts";

Given(
  /^the user has a (?<mode>desktop|mobile) viewport$/u,
  async function(this: GoatItWorld, mode: "desktop" | "mobile"): Promise<void> {
    await this.page.setViewportSize(mode === "desktop" ? DESKTOP_VIEWPORT : MOBILE_VIEWPORT);
  },
);

Given(/^the user has reduced motion$/u, async function(this: GoatItWorld): Promise<void> {
  await this.page.emulateMedia({ reducedMotion: "reduce" });
});