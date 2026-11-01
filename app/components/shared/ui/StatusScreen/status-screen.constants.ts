import type { StatusScreenTitleTag, StatusScreenVariant } from "@/components/shared/ui/StatusScreen/status-screen.types";

const STATUS_SCREEN_VARIANT_CLASSES = {
  page: {
    actions: "flex flex-wrap gap-3 items-center justify-center",
    copy: "flex flex-col gap-2 items-center max-w-md",
    description: "text-center text-fg-secondary",
    header: "flex flex-col gap-6 items-center",
    icon: "size-16",
    iconColor: "text-fg-secondary",
    root: "bg-app-bg flex flex-col gap-6 items-center justify-center min-h-dvh px-6 text-center",
    title: "font-bold text-3xl text-fg-primary",
  },
  section: {
    actions: "flex flex-wrap gap-3 items-center justify-center",
    copy: "flex flex-col gap-2 items-center max-w-md",
    description: "text-center text-fg-secondary",
    header: "flex flex-col gap-6 items-center",
    icon: "size-20",
    iconColor: undefined,
    root: "flex flex-1 flex-col gap-6 items-center justify-center px-4 py-6",
    title: "font-medium text-center text-fg-primary text-xl",
  },
} as const;

const STATUS_SCREEN_VARIANT_TITLE_TAGS = {
  page: "h1",
  section: "h2",
} as const satisfies Record<StatusScreenVariant, StatusScreenTitleTag>;

export { STATUS_SCREEN_VARIANT_CLASSES, STATUS_SCREEN_VARIANT_TITLE_TAGS };