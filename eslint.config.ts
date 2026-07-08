import oxlint from "eslint-plugin-oxlint";
import type { Linter } from "eslint";

import { ESLINT_STORES_FLAT_CONFIG } from "./configs/eslint/flat-configs/eslint-stores.flat-config";
import { ESLINT_TESTS_COMPOSABLES_MOCKS_FLAT_CONFIG } from "./configs/eslint/flat-configs/eslint-tests-composables-mocks.flat-config";
import { ESLINT_TYPESCRIPT_DECLARATIONS_FLAT_CONFIG } from "./configs/eslint/flat-configs/eslint-typescript-declarations.flat-config";
import { withNuxt } from "./.nuxt/eslint.config.mjs";
import { ESLINT_GLOBAL_FLAT_CONFIG } from "./configs/eslint/flat-configs/eslint-global.flat-config";
import { ESLINT_TYPESCRIPT_FLAT_CONFIG } from "./configs/eslint/flat-configs/eslint-typescript.flat-config";
import { ESLINT_UNIT_TESTS_FLAT_CONFIG } from "./configs/eslint/flat-configs/eslint-unit-tests.config";
import { ESLINT_CONFIG_FILES_FLAT_CONFIG } from "./configs/eslint/flat-configs/eslint-config-files.flat-config";
import { ESLINT_VUE_FLAT_CONFIG } from "./configs/eslint/flat-configs/eslint-vue.flat-config";
import { ESLINT_IMPORT_FLAT_CONFIG } from "./configs/eslint/flat-configs/eslint-import.flat-config";
import { ESLINT_PAGES_FLAT_CONFIG } from "./configs/eslint/flat-configs/eslint-pages.flat-config";
import { ESLINT_PAGES_UNIT_TESTS_FLAT_CONFIG } from "./configs/eslint/flat-configs/eslint-pages-unit-tests.flat-config";
import { ESLINT_CONSTANTS_FLAT_CONFIG } from "./configs/eslint/flat-configs/eslint-constants.flat-config";
import { ESLINT_TYPES_FLAT_CONFIG } from "./configs/eslint/flat-configs/eslint-types-flat-config";
import { ESLINT_UNIT_TESTS_SETUP_FLAT_CONFIG } from "./configs/eslint/flat-configs/eslint-unit-tests-setup.flat-config";
import { ESLINT_LAYOUTS_FLAT_CONFIG } from "./configs/eslint/flat-configs/eslint-layouts.flat-config";
import { ESLINT_UNICORN_FLAT_CONFIG } from "./configs/eslint/flat-configs/eslint-unicorn.flat-config";
import { ESLINT_TESTS_FLAT_CONFIG } from "./configs/eslint/flat-configs/eslint-tests.flat-config";
import { ESLINT_STYLISTIC_FLAT_CONFIG } from "./configs/eslint/flat-configs/eslint-stylistic.flat-config";
import { ESLINT_REPOSITORIES_FLAT_CONFIG } from "./configs/eslint/flat-configs/eslint-repositories.flat-config";
import { ESLINT_ACCEPTANCE_TESTS_FLAT_CONFIG } from "./configs/eslint/flat-configs/eslint-acceptance-tests.flat-config";
import { ESLINT_SCRIPTS_FLAT_CONFIG } from "./configs/eslint/flat-configs/eslint-scripts.flat-config";

export default withNuxt(
  ESLINT_UNICORN_FLAT_CONFIG,
  ESLINT_UNIT_TESTS_FLAT_CONFIG,
  ESLINT_PAGES_FLAT_CONFIG,
  ESLINT_PAGES_UNIT_TESTS_FLAT_CONFIG,
  ESLINT_STORES_FLAT_CONFIG,
  ESLINT_CONSTANTS_FLAT_CONFIG,
  ESLINT_TYPES_FLAT_CONFIG,
  ESLINT_LAYOUTS_FLAT_CONFIG,
  ESLINT_CONFIG_FILES_FLAT_CONFIG,
  ESLINT_UNIT_TESTS_SETUP_FLAT_CONFIG,
  ESLINT_TESTS_FLAT_CONFIG,
  ESLINT_TYPESCRIPT_DECLARATIONS_FLAT_CONFIG,
  ESLINT_TESTS_COMPOSABLES_MOCKS_FLAT_CONFIG,
  ESLINT_REPOSITORIES_FLAT_CONFIG,
  ESLINT_ACCEPTANCE_TESTS_FLAT_CONFIG,
  ESLINT_SCRIPTS_FLAT_CONFIG,
  ...oxlint.buildFromOxlintConfigFile("./configs/oxlint/oxlint.config.jsonc") as Linter.Config[],
)
  .override("nuxt/javascript", {
    rules: ESLINT_GLOBAL_FLAT_CONFIG.rules,
  })
  .override("nuxt/typescript/rules", {
    rules: ESLINT_TYPESCRIPT_FLAT_CONFIG.rules,
  })
  .override("nuxt/vue/rules", {
    rules: ESLINT_VUE_FLAT_CONFIG.rules,
  }).override("nuxt/import/rules", {
    rules: ESLINT_IMPORT_FLAT_CONFIG.rules,
  }).override("nuxt/stylistic", {
    rules: ESLINT_STYLISTIC_FLAT_CONFIG.rules,
  }) as Linter.Config;