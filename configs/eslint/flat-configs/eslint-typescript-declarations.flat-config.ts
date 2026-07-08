import type { Linter } from "eslint";

const ESLINT_TYPESCRIPT_DECLARATIONS_FLAT_CONFIG: Linter.Config = {
  name: "goat-it/typescript-declarations",
  files: ["**/*.d.ts"],
  rules: {
    "@typescript-eslint/consistent-type-definitions": "off",
    "unicorn/filename-case": [
      "error",
      { case: "kebabCase", multipleFileExtensions: true },
    ],
    "unicorn/require-module-specifiers": "off",
    "import/unambiguous": "off",
  },
} as const;

export { ESLINT_TYPESCRIPT_DECLARATIONS_FLAT_CONFIG };