import { init } from "@sentry/nuxt";

import { buildSentryInitConfig } from "#shared/utils/helpers/sentry/configuration/build-sentry-init-config.helpers";
import { resolveSentryEnvironment } from "#shared/utils/helpers/sentry/environment/sentry-environment.helpers";
import { scrubSentryBreadcrumb, scrubSentryEvent } from "#shared/utils/helpers/sentry/scrubbing/scrub-sentry-data.helpers";
import { resolveSiteEnvironment } from "#shared/utils/helpers/site/site-environment.helpers";

const environment = resolveSentryEnvironment(resolveSiteEnvironment(process.env));
const dsn = process.env.NUXT_PUBLIC_SENTRY_DSN ?? "";
const isSentryDisabled = process.env.NUXT_PUBLIC_SENTRY_DISABLED === "true";
const sentryConfig = buildSentryInitConfig({ enabled: !import.meta.dev && !isSentryDisabled, dsn, environment });

if (sentryConfig !== undefined) {
  init({
    ...sentryConfig,
    enableNitroErrorHandler: true,
    beforeSend: (event, hint) => scrubSentryEvent(event, hint.originalException),
    beforeBreadcrumb: breadcrumb => scrubSentryBreadcrumb(breadcrumb),
  });
}