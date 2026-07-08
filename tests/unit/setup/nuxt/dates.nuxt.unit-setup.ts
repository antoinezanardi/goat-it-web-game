import { beforeAll, afterAll, vi } from "vitest";

process.env.TZ = "UTC";

beforeAll(() => {
  const dateForUnitTests = new Date("2026-04-14");
  vi.useFakeTimers();
  vi.setSystemTime(dateForUnitTests);
});

afterAll(() => {
  vi.useRealTimers();
});