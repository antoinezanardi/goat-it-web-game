const VITEST_COMPOSABLES_PROJECT_INCLUDES = ["app/composables/**/*.spec.ts"];

const VITEST_STORES_PROJECT_INCLUDES = ["app/**/*.store.spec.ts"];

const VITEST_REPOSITORIES_PROJECT_INCLUDES = ["app/**/*.repository.spec.ts"];

const VITEST_NODE_PROJECT_INCLUDES = [
  "app/**/*.mappers.spec.ts",
  "app/**/*.helpers.spec.ts",
  "app/**/*.translations.spec.ts",
  "server/**/*.mappers.spec.ts",
  "server/**/*.helpers.spec.ts",
  "shared/**/*.mappers.spec.ts",
  "shared/**/*.helpers.spec.ts",
  "shared/**/*.schemas.spec.ts",
];

const VITEST_DOM_PROJECT_INCLUDES = [
  "app/**/*.dom.helpers.spec.ts",
  "server/**/*.dom.helpers.spec.ts",
  "shared/**/*.dom.helpers.spec.ts",
];

export {
  VITEST_COMPOSABLES_PROJECT_INCLUDES,
  VITEST_STORES_PROJECT_INCLUDES,
  VITEST_REPOSITORIES_PROJECT_INCLUDES,
  VITEST_NODE_PROJECT_INCLUDES,
  VITEST_DOM_PROJECT_INCLUDES,
};