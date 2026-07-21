import type { Linter } from "eslint";

const ESLINT_ACCEPTANCE_TESTS_FLAT_CONFIG: Linter.Config = {
  name: "goat-it/acceptance-tests",
  files: ["tests/acceptance/**/*.ts"],
  rules: {
    // Acceptance test infrastructure uses console.info for informational logging (e.g., screenshot paths, cleanup messages)
    "no-console": ["error", { allow: ["info", "error"] }],
  },
} as const;

export { ESLINT_ACCEPTANCE_TESTS_FLAT_CONFIG };