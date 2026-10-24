type ChangelogWhatsNewButtonVariant = "button" | "menu";

type ChangelogWhatsNewButtonProps = {
  variant?: ChangelogWhatsNewButtonVariant;
  isUnread: boolean;
};

type ChangelogWhatsNewButtonEmits = {
  openChangelog: [];
};

export type { ChangelogWhatsNewButtonEmits, ChangelogWhatsNewButtonProps, ChangelogWhatsNewButtonVariant };