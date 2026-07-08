import type { Linter } from "eslint";

const ESLINT_TYPES_FLAT_CONFIG: Linter.Config = {
  name: "goat-it/types",
  files: ["**/*.types.ts"],
  rules: {
    // Type files should always be kebab-case
    "unicorn/filename-case": [
      "error",
      { case: "kebabCase", multipleFileExtensions: true },
    ],
  },
} as const;

export { ESLINT_TYPES_FLAT_CONFIG };