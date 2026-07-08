import type { Linter } from "eslint";

import { NAMING_CONVENTION_DEFAULT_CONFIG } from "../eslint.constants";

const ESLINT_REPOSITORIES_FLAT_CONFIG: Linter.Config = {
  name: "goat-it/repository",
  files: ["app/repositories/**/*.repository.ts"],
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

export { ESLINT_REPOSITORIES_FLAT_CONFIG };