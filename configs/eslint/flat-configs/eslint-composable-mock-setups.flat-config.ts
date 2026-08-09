import type { Linter } from "eslint";

import { NAMING_CONVENTION_DEFAULT_CONFIG } from "../eslint.constants";

const ESLINT_COMPOSABLE_MOCK_SETUPS_FLAT_CONFIG: Linter.Config = {
  name: "goat-it/composable-mock-setups",
  files: ["tests/unit/setup/nuxt/composables/*.nuxt.unit-setup.ts"],
  rules: {
    "@typescript-eslint/naming-convention": [
      "error",
      {
        selector: ["variable"],
        modifiers: ["exported"],
        format: ["camelCase"],
      },
      ...NAMING_CONVENTION_DEFAULT_CONFIG,
    ],
  },
} as const;

export { ESLINT_COMPOSABLE_MOCK_SETUPS_FLAT_CONFIG };