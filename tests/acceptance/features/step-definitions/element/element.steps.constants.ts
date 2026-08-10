const VALID_LOCATOR_ROLES: ReadonlySet<string> = new Set([
  "button",
  "img",
  "heading",
  "navigation",
  "link",
  "region",
  "paragraph",
  "tab",
  "alertdialog",
  "dialog",
  "progressbar",
]);

const ROLE_ALTERNATION_PATTERN = [...VALID_LOCATOR_ROLES].join("|");

export { ROLE_ALTERNATION_PATTERN, VALID_LOCATOR_ROLES };