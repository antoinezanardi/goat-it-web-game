import type { BundleSizeCheck } from "./compare-bundles.types.ts";

const BUNDLE_SIZE_CHECKS = [
  {
    key: "nuxt-js",
    label: "JavaScript (`nuxt-js`)",
  },
  {
    key: "nuxt-css",
    label: "CSS (`nuxt-css`)",
  },
] as const satisfies readonly BundleSizeCheck[];

const BYTES_PER_KIBIBYTE = 1024;
const PERCENT_MULTIPLIER = 100;
const KIBIBYTE_SIZE_FRACTION_DIGITS = 1;
const KIBIBYTE_DELTA_FRACTION_DIGITS = 2;
const PERCENT_FRACTION_DIGITS = 2;
const EXIT_SUCCESS = 0;
const EXIT_FAILURE = 1;
const DOWNLOAD_SUCCESS_OUTCOME = "success";
const DEFAULT_SUMMARY_PATH = "/dev/stdout";
const UNKNOWN_VALUE = "unknown";
const KIBIBYTE_UNIT = "KiB";
const PERCENT_UNIT = "%";
const HEADROOM_LABEL = "headroom";
const OVER_CAP_LABEL = "over cap";
const NOT_APPLICABLE = "N/A";
const EN_US_LOCALE = "en-US";
const SUMMARY_HEADING = "## 📏 Bundle Size Budget";
const COMPARISON_UNAVAILABLE_TEXT = "**Comparison unavailable.**";

export {
  BUNDLE_SIZE_CHECKS,
  BYTES_PER_KIBIBYTE,
  COMPARISON_UNAVAILABLE_TEXT,
  DEFAULT_SUMMARY_PATH,
  DOWNLOAD_SUCCESS_OUTCOME,
  EN_US_LOCALE,
  EXIT_FAILURE,
  EXIT_SUCCESS,
  HEADROOM_LABEL,
  KIBIBYTE_DELTA_FRACTION_DIGITS,
  KIBIBYTE_SIZE_FRACTION_DIGITS,
  KIBIBYTE_UNIT,
  NOT_APPLICABLE,
  OVER_CAP_LABEL,
  PERCENT_FRACTION_DIGITS,
  PERCENT_MULTIPLIER,
  PERCENT_UNIT,
  SUMMARY_HEADING,
  UNKNOWN_VALUE,
};