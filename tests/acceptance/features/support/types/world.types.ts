import { World } from "@cucumber/cucumber";
import type { Db, MongoClient } from "mongodb";
import type { APIResponse, BrowserContext, Page } from "playwright-core";

class GoatItWorld extends World {
  public page!: Page;

  public context!: BrowserContext;

  public openedTabPage?: Page;

  public mongoClient!: MongoClient;

  public mongoDb!: Db;

  public completedFixtureKeys?: Set<string>;

  public lastApiResponse?: APIResponse;

  public cspViolations: string[] = [];

  public constructor(options: ConstructorParameters<typeof World>[0]) {
    super(options);
  }
}

export { GoatItWorld };