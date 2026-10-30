/**
 * Maps a site environment to the Sentry environment label used by deployed builds.
 *
 * Development and test environments return `undefined`, because error tracking never initializes there.
 */
function resolveSentryEnvironment(siteEnvironment: string): "production" | "staging" | undefined {
  if (siteEnvironment === "production" || siteEnvironment === "staging") {
    return siteEnvironment;
  }
  return undefined;
}

export { resolveSentryEnvironment };