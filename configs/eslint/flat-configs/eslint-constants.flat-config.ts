import type { Linter } from "eslint";

const ESLINT_CONSTANTS_FLAT_CONFIG: Linter.Config = {
  name: "goat-it/constants",
  files: ["**/*.constants.ts"],
  rules: {
    "unicorn/filename-case": [
      "error",
      {
        case: "kebabCase",
        multipleFileExtensions: true,
      },
    ],
  },
} as const;

export { ESLINT_CONSTANTS_FLAT_CONFIG };