import type { Linter } from "eslint";

const ESLINT_LAYOUTS_FLAT_CONFIG: Linter.Config = {
  name: "goat-it/layouts",
  files: ["app/layouts/**/*.vue"],
  rules: {
    "import/unambiguous": "off",
  },
} as const;

export { ESLINT_LAYOUTS_FLAT_CONFIG };