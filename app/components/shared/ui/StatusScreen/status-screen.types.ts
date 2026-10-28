type StatusScreenTitleTag = "h1" | "h2";

type StatusScreenVariant = "page" | "section";

type StatusScreenProps = {
  icon: string;
  iconClass?: string;
  title: string;
  description?: string;
  variant?: StatusScreenVariant;
  testId?: string;
};

type StatusScreenSlots = {
  title?: () => unknown;
  description?: () => unknown;
  actions?: () => unknown;
};

export type { StatusScreenProps, StatusScreenSlots, StatusScreenTitleTag, StatusScreenVariant };