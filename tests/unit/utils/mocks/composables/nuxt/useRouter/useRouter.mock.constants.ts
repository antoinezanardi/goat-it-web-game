import type { RouteMock } from "~~/tests/unit/utils/mocks/composables/nuxt/useRouter/useRouter.mock.types";

const DEFAULT_MOCKED_ROUTE: RouteMock = {
  path: "/",
  name: "home",
  meta: {
    titleKey: "home.pageTitle",
    icon: "i-lucide-home",
    order: 1,
  },
} as const;

const MOCKED_ROUTES = [
  {
    path: "/question/:id",
    meta: {},
  },
  {
    name: "questions",
    path: "/questions",
    meta: {
      order: 2,
    },
  },
  {
    path: "/settings",
    name: "settings",
    meta: {},
  },
  DEFAULT_MOCKED_ROUTE,
] as const satisfies readonly RouteMock[];

export {
  DEFAULT_MOCKED_ROUTE,
  MOCKED_ROUTES,
};