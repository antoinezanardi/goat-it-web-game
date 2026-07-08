import unicorn from "eslint-plugin-unicorn";
import type { Linter } from "eslint";

const ESLINT_TESTS_FLAT_CONFIG: Linter.Config = {
  name: "goat-it/tests",
  files: ["tests/**"],
  plugins: { unicorn },
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

export { ESLINT_TESTS_FLAT_CONFIG };