import type { Linter } from "eslint";

const ESLINT_SCRIPTS_FLAT_CONFIG: Linter.Config = {
  name: "goat-it/scripts",
  files: ["scripts/**/*.ts"],
  rules: {
    "no-console": "off",
  },
} as const;

export { ESLINT_SCRIPTS_FLAT_CONFIG };