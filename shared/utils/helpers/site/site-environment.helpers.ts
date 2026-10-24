/**
 * Returns the site environment from `NUXT_SITE_ENV` when non-empty, otherwise derives it from `NODE_ENV`.
 *
 * Anything other than `"production"` resolves to `"development"`.
 */
function resolveSiteEnvironment(environment: NodeJS.ProcessEnv): string {
  const configuredSiteEnvironment = environment.NUXT_SITE_ENV?.trim();

  if (configuredSiteEnvironment !== undefined && configuredSiteEnvironment !== "") {
    return configuredSiteEnvironment;
  }
  return environment.NODE_ENV === "production" ? "production" : "development";
}

export { resolveSiteEnvironment };