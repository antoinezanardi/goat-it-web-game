import type { Linter } from "eslint";

const ESLINT_ACCEPTANCE_TESTS_HOOKS_FLAT_CONFIG: Linter.Config = {
  name: "goat-it/acceptance-tests-hooks",
  files: ["tests/acceptance/features/support/hooks.ts"],
  rules: {
    "init-declarations": "off",
  },
} as const;

export { ESLINT_ACCEPTANCE_TESTS_HOOKS_FLAT_CONFIG };