import type { Linter } from "eslint";

const ESLINT_PAGES_FLAT_CONFIG: Linter.Config = {
  name: "goat-it/pages",
  files: ["app/pages/**/*.vue"],
  rules: {
    "import/unambiguous": "off",
    "unicorn/filename-case": [
      "error",
      { case: "kebabCase", multipleFileExtensions: true },
    ],
  },
} as const;

export { ESLINT_PAGES_FLAT_CONFIG };