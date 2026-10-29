import { init } from "@sentry/nuxt";

import { useRuntimeConfig } from "#imports";
import { buildSentryInitConfig } from "#shared/utils/helpers/sentry/configuration/build-sentry-init-config.helpers";
import { scrubSentryBreadcrumb, scrubSentryEvent } from "#shared/utils/helpers/sentry/scrubbing/scrub-sentry-data.helpers";

const { dsn, environment, release } = useRuntimeConfig().public.sentry;
const isSentryEnabled = !import.meta.dev && !import.meta.test;
const sentryConfig = buildSentryInitConfig({ enabled: isSentryEnabled, dsn, environment, release });

if (sentryConfig !== undefined) {
  init({
    ...sentryConfig,
    enableNitroErrorHandler: true,
    beforeSend: (event, hint) => scrubSentryEvent(event, hint.originalException),
    beforeBreadcrumb: breadcrumb => scrubSentryBreadcrumb(breadcrumb),
  });
}