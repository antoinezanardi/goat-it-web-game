import type { Linter } from "eslint";

const ESLINT_FIXTURES_FLAT_CONFIG: Linter.Config = {
  name: "goat-it/fixtures",
  files: ["tests/acceptance/features/support/fixtures/**/*.fixture-set.ts"],
  rules: {
    "@stylistic/max-len": "off",
  },
} as const;

export { ESLINT_FIXTURES_FLAT_CONFIG };