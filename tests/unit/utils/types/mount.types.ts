import type { mountSuspended } from "@nuxt/test-utils/runtime";

type MountSuspendedOptions<Component> = Parameters<typeof mountSuspended<Component>>[1];

export type { MountSuspendedOptions };