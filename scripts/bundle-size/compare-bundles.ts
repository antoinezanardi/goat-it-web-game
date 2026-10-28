import { appendFileSync } from "node:fs";

import { DEFAULT_SUMMARY_PATH } from "./compare-bundles.constants.ts";
import { buildComparisonSummary } from "./compare-bundles.helpers.ts";
import type { BundleSizeComparisonInput } from "./compare-bundles.types.ts";

const input: BundleSizeComparisonInput = {
  prJsonPath: process.env.PR_JSON,
  baseJsonPath: process.env.BASE_JSON,
  prDownloadOutcome: process.env.PR_DOWNLOAD_OUTCOME,
  baseDownloadOutcome: process.env.BASE_DOWNLOAD_OUTCOME,
  baseRef: process.env.BASE_REF,
  baseSha: process.env.BASE_SHA,
  headSha: process.env.HEAD_SHA,
};

const summaryPath = process.env.GITHUB_STEP_SUMMARY ?? DEFAULT_SUMMARY_PATH;
const result = buildComparisonSummary(input);

appendFileSync(summaryPath, `${result.markdown}\n`);

process.exitCode = result.exitCode;