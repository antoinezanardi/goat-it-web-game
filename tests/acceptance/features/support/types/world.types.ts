import { World } from "@cucumber/cucumber";
import type { IWorldOptions } from "@cucumber/cucumber";
import type { BrowserContext, Page } from "playwright-core";

class GoatItWorld extends World {
  public page!: Page;

  public context!: BrowserContext;

  public openedTabPage?: Page;

  public constructor(options: IWorldOptions<unknown>) {
    super(options);
  }
}

export { GoatItWorld };