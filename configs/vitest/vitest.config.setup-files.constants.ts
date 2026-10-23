import path from "node:path";

import { PROCESS_CWD } from "./vitest.config.constants.ts";

const VITEST_NUXT_PROJECT_SETUP_FILES = [
  path.resolve(PROCESS_CWD, "tests/unit/setup/nuxt/vtu-auto-unmount.nuxt.unit-setup.ts"),
  path.resolve(PROCESS_CWD, "tests/unit/setup/nuxt/reka-ui-dismissable-layer.nuxt.unit-setup.ts"),
  path.resolve(PROCESS_CWD, "tests/unit/setup/nuxt/main-landmark.nuxt.unit-setup.ts"),
  path.resolve(PROCESS_CWD, "tests/unit/setup/nuxt/vtu-config.nuxt.unit-setup.ts"),
  path.resolve(PROCESS_CWD, "tests/unit/setup/nuxt/use-i18n.nuxt.unit-setup.ts"),
  path.resolve(PROCESS_CWD, "tests/unit/setup/nuxt/use-router.nuxt.unit-setup.ts"),
  path.resolve(PROCESS_CWD, "tests/unit/setup/nuxt/fetch.nuxt.unit-setup.ts"),
  path.resolve(PROCESS_CWD, "tests/unit/setup/nuxt/use-toast.nuxt.unit-setup.ts"),
  path.resolve(PROCESS_CWD, "tests/unit/setup/nuxt/h3.nuxt.unit-setup.ts"),
  path.resolve(PROCESS_CWD, "tests/unit/setup/nuxt/create-error.nuxt.unit-setup.ts"),
  path.resolve(PROCESS_CWD, "tests/unit/setup/nuxt/use-head.nuxt.unit-setup.ts"),
  path.resolve(PROCESS_CWD, "tests/unit/setup/nuxt/use-seo-meta.nuxt.unit-setup.ts"),
  path.resolve(PROCESS_CWD, "tests/unit/setup/nuxt/use-schema-org.nuxt.unit-setup.ts"),
  path.resolve(PROCESS_CWD, "tests/unit/setup/nuxt/call-once.nuxt.unit-setup.ts"),
  path.resolve(PROCESS_CWD, "tests/unit/setup/nuxt/define-page-meta.nuxt.unit-setup.ts"),
  path.resolve(PROCESS_CWD, "tests/unit/setup/nuxt/virtualizer.nuxt.unit-setup.ts"),
] as const;

const VITEST_COMPOSABLES_MOCK_SETUP_FILES: readonly string[] = [
  path.resolve(PROCESS_CWD, "tests/unit/setup/nuxt/composables/use-fetch-status.nuxt.unit-setup.ts"),
  path.resolve(PROCESS_CWD, "tests/unit/setup/nuxt/composables/use-async-data.nuxt.unit-setup.ts"),
  path.resolve(PROCESS_CWD, "tests/unit/setup/nuxt/composables/query-collection.nuxt.unit-setup.ts"),
  path.resolve(PROCESS_CWD, "tests/unit/setup/nuxt/composables/use-async-action.nuxt.unit-setup.ts"),
  path.resolve(PROCESS_CWD, "tests/unit/setup/nuxt/composables/use-app-toast.nuxt.unit-setup.ts"),
  path.resolve(PROCESS_CWD, "tests/unit/setup/nuxt/composables/use-goat-it-api-error-toast.nuxt.unit-setup.ts"),
  path.resolve(PROCESS_CWD, "tests/unit/setup/nuxt/composables/use-gsap.nuxt.unit-setup.ts"),
  path.resolve(PROCESS_CWD, "tests/unit/setup/nuxt/composables/use-game.nuxt.unit-setup.ts"),
  path.resolve(PROCESS_CWD, "tests/unit/setup/nuxt/composables/use-game-question-translation.nuxt.unit-setup.ts"),
  path.resolve(PROCESS_CWD, "tests/unit/setup/nuxt/composables/use-overlay.nuxt.unit-setup.ts"),
  path.resolve(PROCESS_CWD, "tests/unit/setup/nuxt/composables/use-window-scroll.nuxt.unit-setup.ts"),
  path.resolve(PROCESS_CWD, "tests/unit/setup/nuxt/composables/use-preferred-reduced-motion.nuxt.unit-setup.ts"),
  path.resolve(PROCESS_CWD, "tests/unit/setup/nuxt/composables/use-preferred-languages.nuxt.unit-setup.ts"),
  path.resolve(PROCESS_CWD, "tests/unit/setup/nuxt/composables/use-document-visibility.nuxt.unit-setup.ts"),
  path.resolve(PROCESS_CWD, "tests/unit/setup/nuxt/composables/use-cookie.nuxt.unit-setup.ts"),
  path.resolve(PROCESS_CWD, "tests/unit/setup/nuxt/composables/use-question-card-highlight.nuxt.unit-setup.ts"),
] as const;

const VITEST_REPOSITORIES_MOCK_SETUP_FILES: readonly string[] = [
  path.resolve(
    PROCESS_CWD,
    "tests/unit/setup/nuxt/repositories/question-themes-repository.nuxt.unit-setup.ts",
  ),
  path.resolve(
    PROCESS_CWD,
    "tests/unit/setup/nuxt/repositories/questions-repository.nuxt.unit-setup.ts",
  ),
] as const;

const VITEST_NODE_PROJECT_SETUP_FILES = [
  path.resolve(PROCESS_CWD, "tests/unit/setup/node/nitro-auto-imports.node.unit-setup.ts"),
  path.resolve(PROCESS_CWD, "tests/unit/setup/node/h3.node.unit-setup.ts"),
];

const VITEST_STORES_PROJECT_SETUP_FILE = path.resolve(PROCESS_CWD, "tests/unit/setup/nuxt/stores.nuxt.unit-setup.ts");

export {
  VITEST_NUXT_PROJECT_SETUP_FILES,
  VITEST_COMPOSABLES_MOCK_SETUP_FILES,
  VITEST_REPOSITORIES_MOCK_SETUP_FILES,
  VITEST_NODE_PROJECT_SETUP_FILES,
  VITEST_STORES_PROJECT_SETUP_FILE,
};