import unicorn from "eslint-plugin-unicorn";
import type { Linter } from "eslint";

const ESLINT_TESTS_COMPOSABLES_MOCKS_FLAT_CONFIG: Linter.Config = {
  name: "goat-it/tests/composables-mocks",
  files: ["tests/unit/utils/mocks/composables/**"],
  plugins: { unicorn },
  rules: {
    "unicorn/filename-case": [
      "error",
      { case: "camelCase", multipleFileExtensions: true },
    ],
  },
} as const;

export { ESLINT_TESTS_COMPOSABLES_MOCKS_FLAT_CONFIG };