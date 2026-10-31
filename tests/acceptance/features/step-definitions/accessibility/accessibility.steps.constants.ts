const DESKTOP_VIEWPORT = { width: 1920, height: 800 } as const;

const MOBILE_VIEWPORT = { width: 375, height: 667 } as const;

const AXE_TAGS = [
  "wcag2a",
  "wcag2aa",
  "wcag21a",
  "wcag21aa",
  "wcag22aa",
  "best-practice",
  "ACT",
] as const;

export {
  AXE_TAGS,
  DESKTOP_VIEWPORT,
  MOBILE_VIEWPORT,
};