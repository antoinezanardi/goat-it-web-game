import { z } from "zod";

const ACCESSIBILITY_IGNORE_ROW_SCHEMA = z.strictObject({
  violation: z.string(),
});

type AccessibilityIgnoreRow = z.infer<typeof ACCESSIBILITY_IGNORE_ROW_SCHEMA>;

export { ACCESSIBILITY_IGNORE_ROW_SCHEMA };

export type { AccessibilityIgnoreRow };