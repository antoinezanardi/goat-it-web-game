function resolveSiteEnvironment(environment: NodeJS.ProcessEnv): string {
  const configuredSiteEnvironment = environment.NUXT_SITE_ENV?.trim();

  if (configuredSiteEnvironment !== undefined && configuredSiteEnvironment !== "") {
    return configuredSiteEnvironment;
  }
  return environment.NODE_ENV === "production" ? "production" : "development";
}

export { resolveSiteEnvironment };