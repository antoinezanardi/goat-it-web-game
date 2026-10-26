type StatusScreenTitleTag = "h1" | "h2" | "p";

type StatusScreenVariant = "page" | "section";

type StatusScreenProps = {
  icon?: string;
  iconClass?: string;
  title: string;
  description?: string;
  titleTag?: StatusScreenTitleTag;
  variant?: StatusScreenVariant;
  testId?: string;
};

type StatusScreenSlots = {
  icon?: () => unknown;
  title?: () => unknown;
  description?: () => unknown;
  actions?: () => unknown;
};

export type { StatusScreenProps, StatusScreenSlots, StatusScreenTitleTag, StatusScreenVariant };