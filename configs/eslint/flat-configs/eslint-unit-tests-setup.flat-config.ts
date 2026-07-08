import type { Linter } from "eslint";

const ESLINT_UNIT_TESTS_SETUP_FLAT_CONFIG: Linter.Config = {
  name: "goat-it/unit-tests-setup",
  files: ["tests/unit/setup/**/*.unit-setup.ts"],
  rules: {
    "unicorn/consistent-function-scoping": "off",
  },
} as const;

export { ESLINT_UNIT_TESTS_SETUP_FLAT_CONFIG };