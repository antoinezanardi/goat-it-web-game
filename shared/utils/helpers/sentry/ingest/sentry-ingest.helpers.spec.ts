import { describe, expect, it } from "vitest";

import { getSentryIngestOrigin } from "#shared/utils/helpers/sentry/ingest/sentry-ingest.helpers";

describe(getSentryIngestOrigin, () => {
  it.each<{ description: string; dsn: string; expectedOrigin: string | undefined }>([
    {
      description: "a US ingest dsn",
      dsn: "https://public@o123.ingest.us.sentry.io/456",
      expectedOrigin: "https://o123.ingest.us.sentry.io",
    },
    {
      description: "an EU ingest dsn",
      dsn: "https://public@o123.ingest.de.sentry.io/456",
      expectedOrigin: "https://o123.ingest.de.sentry.io",
    },
    { description: "an empty dsn", dsn: "", expectedOrigin: undefined },
    { description: "a malformed dsn", dsn: "http://[", expectedOrigin: undefined },
    { description: "a non https dsn", dsn: "http://o123.ingest.us.sentry.io/456", expectedOrigin: undefined },
    { description: "a non ingest sentry host", dsn: "https://de.sentry.io/456", expectedOrigin: undefined },
    { description: "an ingest host outside sentry", dsn: "https://o1.ingest.evil.com/456", expectedOrigin: undefined },
  ])("should return the expected origin when the dsn is $description.", ({ dsn, expectedOrigin }) => {
    expect(getSentryIngestOrigin(dsn)).toBe(expectedOrigin);
  });
});