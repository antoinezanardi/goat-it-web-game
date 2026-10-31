import { When } from "@cucumber/cucumber";

import type { GoatItWorld } from "#acceptance/features/support/types/world.types.ts";
import { clickVisibleLocator } from "#acceptance/features/support/helpers/locator.helpers.ts";
import {
  navigateDirectly,
  reloadDirectly,
  setBrowserOffline,
  skipQuestionsUntilRandomQuestionsRequestFails,
} from "#acceptance/features/step-definitions/pwa/helpers/pwa.when-steps.helpers.ts";
import { PWA_OFFLINE_RETRY_LINK_TEST_ID } from "#acceptance/features/step-definitions/pwa/pwa.steps.constants.ts";

When(
  /^the browser goes offline$/u,
  async function(this: GoatItWorld): Promise<void> {
    await setBrowserOffline(this.context, this.page, true);
  },
);

When(
  /^the browser goes online$/u,
  async function(this: GoatItWorld): Promise<void> {
    await setBrowserOffline(this.context, this.page, false);
  },
);

When(
  /^the user navigates directly to the "(?<path>[^"]*)" page$/u,
  async function(this: GoatItWorld, path: string): Promise<void> {
    await navigateDirectly(this.page, path);
  },
);

When(
  /^the user reloads the current page$/u,
  async function(this: GoatItWorld): Promise<void> {
    await reloadDirectly(this.page);
  },
);

When(
  /^the user clicks the offline retry link$/u,
  async function(this: GoatItWorld): Promise<void> {
    await clickVisibleLocator(this.page.getByTestId(PWA_OFFLINE_RETRY_LINK_TEST_ID));
  },
);

When(
  /^the user skips (?<count>\d+) questions while the random questions request fails$/u,
  { timeout: 300_000 },
  async function(this: GoatItWorld, count: string): Promise<void> {
    await skipQuestionsUntilRandomQuestionsRequestFails(this, Math.trunc(Number(count)));
  },
);