import type { PageMeta } from "nuxt/app";

type RouteMock = {
  path: string;
  name?: string | symbol | number;
  meta: PageMeta;
};

export type { RouteMock };