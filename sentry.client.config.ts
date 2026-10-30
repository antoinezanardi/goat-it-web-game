import { init } from "@sentry/nuxt";

import { useRuntimeConfig } from "#imports";
import { buildSentryInitConfig } from "#shared/utils/helpers/sentry/configuration/build-sentry-init-config.helpers";
import { isSentryEnabled } from "#shared/utils/helpers/sentry/configuration/is-sentry-enabled.helpers";
import { resolveSentryEnvironment } from "#shared/utils/helpers/sentry/environment/sentry-environment.helpers";
import { scrubSentryBreadcrumb, scrubSentryEvent } from "#shared/utils/helpers/sentry/scrubbing/scrub-sentry-data.helpers";

const { dsn, environment: siteEnvironment, disabled: isSentryDisabled } = useRuntimeConfig().public.sentry;
const environment = resolveSentryEnvironment(siteEnvironment);
const isEnabled = isSentryEnabled({ isDevelopment: import.meta.dev, disabled: isSentryDisabled });
const sentryConfig = buildSentryInitConfig({ enabled: isEnabled, dsn, environment });

if (sentryConfig !== undefined) {
  init({
    ...sentryConfig,
    beforeSend: (event, hint) => scrubSentryEvent(event, hint.originalException),
    beforeBreadcrumb: breadcrumb => scrubSentryBreadcrumb(breadcrumb),
  });
}