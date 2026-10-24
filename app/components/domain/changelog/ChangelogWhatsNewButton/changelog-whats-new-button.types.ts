type ChangelogWhatsNewButtonVariant = "button" | "menu";

type ChangelogWhatsNewButtonProps = {
  displayVariant?: ChangelogWhatsNewButtonVariant;
  isChangelogUnread: boolean;
};

type ChangelogWhatsNewButtonEmits = {
  openChangelog: [];
};

export type { ChangelogWhatsNewButtonEmits, ChangelogWhatsNewButtonProps, ChangelogWhatsNewButtonVariant };