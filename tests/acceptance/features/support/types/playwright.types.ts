import type { Page } from "@playwright/test";

type LocatorRole = Parameters<Page["getByRole"]>[0];

export type { LocatorRole };