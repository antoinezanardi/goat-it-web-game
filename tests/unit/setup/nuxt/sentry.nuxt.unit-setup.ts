import { vi } from "vitest";

vi.mock(import("@sentry/nuxt"), () => ({
  captureException: vi.fn<(error: unknown) => string>(),
}));