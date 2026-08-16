import type { Linter } from "eslint";

const ESLINT_CONFIG_FILES_FLAT_CONFIG: Linter.Config = {
  name: "goat-it/config-files",
  files: [
    "nuxt.config.ts",
    "app/app.config.ts",
    "eslint.config.ts",
    "content.config.ts",
    "configs/**/*.{js,mjs,ts}",
    "app/config/**/*",
  ],
  rules: {
    "@typescript-eslint/no-restricted-imports": "off",
    "@typescript-eslint/no-unsafe-type-assertion": "off",
    "import/max-dependencies": [
      "error",
      {
        max: 30,
        ignoreTypeImports: true,
      },
    ],
    "import/no-default-export": "off",
    "import/no-internal-modules": "off",
    "import/no-anonymous-default-export": "off",
    "camelcase": "off",
    "unicorn/filename-case": [
      "error",
      {
        case: "kebabCase",
        multipleFileExtensions: false,
      },
    ],
  },
} as const;

export { ESLINT_CONFIG_FILES_FLAT_CONFIG };