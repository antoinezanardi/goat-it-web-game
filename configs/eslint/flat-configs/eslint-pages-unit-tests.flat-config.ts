import type { Linter } from "eslint";

const ESLINT_PAGES_UNIT_TESTS_FLAT_CONFIG: Linter.Config = {
  name: "goat-it/pages-unit-tests",
  files: ["app/pages/**/*.spec.ts"],
  rules: {
    "unicorn/filename-case": [
      "error",
      { case: "kebabCase", multipleFileExtensions: true },
    ],
  },
} as const;

export { ESLINT_PAGES_UNIT_TESTS_FLAT_CONFIG };