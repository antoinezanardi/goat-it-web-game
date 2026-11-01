import { existsSync, readFileSync } from "node:fs";

import {
  BUNDLE_SIZE_CHECKS,
  BYTES_PER_KIBIBYTE,
  COMPARISON_UNAVAILABLE_TEXT,
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
} from "./compare-bundles.constants.ts";
import type {
  BundleSizeCheck,
  BundleSizeCheckKey,
  BundleSizeComparisonInput,
  BundleSizeComparisonResult,
  MeasurementParseResult,
  SizeLimitResult,
} from "./compare-bundles.types.ts";

const PR_SIDE_LABEL = "PR";
const BASE_SIDE_LABEL = "Base";
const DOWNLOAD_FAILURE_MESSAGES = {
  pr: "the PR client-bundle artifact was not downloaded.",
  base: "the base client-bundle artifact was not downloaded.",
} as const;

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function getErrorMessage(error: unknown): string {
  return error instanceof Error ? error.message : String(error);
}

function isBundleSizeCheckKey(value: unknown): value is BundleSizeCheckKey {
  return BUNDLE_SIZE_CHECKS.some(({ key }) => key === value);
}

function createMeasurementError(side: string, message: string): MeasurementParseResult {
  return { ok: false, error: `${side}: ${message}` };
}

function validateSizeLimitResult(entry: Record<string, unknown>, name: BundleSizeCheckKey, side: string): SizeLimitResult | MeasurementParseResult {
  if (typeof entry.size !== "number" || !Number.isFinite(entry.size) || entry.size < 0) {
    return createMeasurementError(side, `"${name}" has an invalid size.`);
  }
  if (entry.size === 0) {
    return createMeasurementError(side, `"${name}" measured 0 bytes; its glob matched no files.`);
  }
  if (typeof entry.sizeLimit !== "number" || !Number.isFinite(entry.sizeLimit) || entry.sizeLimit <= 0) {
    return createMeasurementError(side, `"${name}" has no valid absolute cap.`);
  }
  if (typeof entry.passed !== "boolean") {
    return createMeasurementError(side, `"${name}" has no boolean pass state.`);
  }
  return { name, size: entry.size, sizeLimit: entry.sizeLimit, passed: entry.passed };
}

function parseEntry(entry: unknown, checks: Map<BundleSizeCheckKey, SizeLimitResult>, side: string): MeasurementParseResult | undefined {
  if (!isRecord(entry)) {
    return createMeasurementError(side, "a result entry is not an object.");
  }
  if (typeof entry.name !== "string" || !isBundleSizeCheckKey(entry.name)) {
    return createMeasurementError(side, `unexpected result name "${String(entry.name)}".`);
  }
  if (checks.has(entry.name)) {
    return createMeasurementError(side, `duplicate result name "${entry.name}".`);
  }
  const sizeLimitResult = validateSizeLimitResult(entry, entry.name, side);
  if ("ok" in sizeLimitResult) {
    return sizeLimitResult;
  }
  checks.set(entry.name, sizeLimitResult);

  return undefined;
}

function validateAllChecksPresent(checks: ReadonlyMap<BundleSizeCheckKey, SizeLimitResult>, side: string): MeasurementParseResult {
  for (const { key } of BUNDLE_SIZE_CHECKS) {
    if (!checks.has(key)) {
      return createMeasurementError(side, `missing result for "${key}".`);
    }
  }
  return { ok: true, checks };
}

function validateResultArray(parsed: unknown[], side: string): MeasurementParseResult {
  if (parsed.length !== BUNDLE_SIZE_CHECKS.length) {
    return createMeasurementError(side, `expected exactly ${BUNDLE_SIZE_CHECKS.length} results, received ${parsed.length}.`);
  }

  const checks: Map<BundleSizeCheckKey, SizeLimitResult> = new Map();
  for (const entry of parsed) {
    const entryError = parseEntry(entry, checks, side);
    if (entryError) {
      return entryError;
    }
  }
  return validateAllChecksPresent(checks, side);
}

function createNonArrayError(parsed: unknown, side: string): MeasurementParseResult {
  if (isRecord(parsed) && "error" in parsed) {
    return createMeasurementError(side, `Size Limit returned an error object instead of a result array. Size Limit reported: ${String(parsed.error)}`);
  }
  return createMeasurementError(side, "Size Limit returned a non-array result instead of a result array.");
}

function parseSizeLimitReport(raw: string, side: string): MeasurementParseResult {
  if (raw.length === 0) {
    return createMeasurementError(side, "the Size Limit result file is empty.");
  }

  let parsed: unknown;
  try {
    parsed = JSON.parse(raw);
  } catch(error) {
    return createMeasurementError(side, `Size Limit emitted invalid JSON (${getErrorMessage(error)}).`);
  }
  return Array.isArray(parsed) ? validateResultArray(parsed, side) : createNonArrayError(parsed, side);
}

function readSizeLimitReport(filePath: string | undefined, side: string): MeasurementParseResult {
  if (filePath === undefined || filePath.length === 0 || !existsSync(filePath)) {
    return createMeasurementError(side, "the Size Limit result file is missing.");
  }

  let raw: string;
  try {
    raw = readFileSync(filePath, "utf8").trim();
  } catch(error) {
    return createMeasurementError(side, `the Size Limit result file could not be read (${getErrorMessage(error)}).`);
  }
  return parseSizeLimitReport(raw, side);
}

function formatKibibytes(bytes: number, fractionDigits: number): string {
  const normalizedBytes = bytes === 0 ? 0 : bytes;
  const formatter = new Intl.NumberFormat(EN_US_LOCALE, {
    minimumFractionDigits: fractionDigits,
    maximumFractionDigits: fractionDigits,
  });

  return `${formatter.format(normalizedBytes / BYTES_PER_KIBIBYTE)} ${KIBIBYTE_UNIT}`;
}

function formatSignedKibibytes(bytes: number): string {
  const prefix = bytes > 0 ? "+" : "";

  return `${prefix}${formatKibibytes(bytes, KIBIBYTE_DELTA_FRACTION_DIGITS)}`;
}

function formatPercent(delta: number, base: number): string {
  if (base === 0) {
    return NOT_APPLICABLE;
  }
  const percent = delta / base * PERCENT_MULTIPLIER;
  const prefix = percent > 0 ? "+" : "";

  return `${prefix}${percent.toFixed(PERCENT_FRACTION_DIGITS)}${PERCENT_UNIT}`;
}

function formatHeadroom(headroom: number): string {
  if (headroom >= 0) {
    return `${formatKibibytes(headroom, KIBIBYTE_DELTA_FRACTION_DIGITS)} ${HEADROOM_LABEL}`;
  }
  return `${formatKibibytes(Math.abs(headroom), KIBIBYTE_DELTA_FRACTION_DIGITS)} ${OVER_CAP_LABEL}`;
}

function getRequiredCheck(checks: ReadonlyMap<BundleSizeCheckKey, SizeLimitResult>, key: BundleSizeCheckKey): SizeLimitResult {
  const check = checks.get(key);
  if (!check) {
    throw new Error(`Missing Size Limit result for "${key}".`);
  }
  return check;
}

function buildSummaryTable(prChecks: ReadonlyMap<BundleSizeCheckKey, SizeLimitResult>, baseChecks: ReadonlyMap<BundleSizeCheckKey, SizeLimitResult>): string {
  const lines = [
    "| Asset | Base (Brotli) | PR (Brotli) | Δ (KiB) | Δ % | Cap | PR headroom | PR status |",
    "| --- | ---: | ---: | ---: | ---: | ---: | ---: | :---: |",
  ];

  for (const { key, label } of BUNDLE_SIZE_CHECKS) {
    const base = getRequiredCheck(baseChecks, key);
    const pr = getRequiredCheck(prChecks, key);
    const delta = pr.size - base.size;
    const headroom = pr.sizeLimit - pr.size;
    const cells = [
      label,
      formatKibibytes(base.size, KIBIBYTE_SIZE_FRACTION_DIGITS),
      formatKibibytes(pr.size, KIBIBYTE_SIZE_FRACTION_DIGITS),
      formatSignedKibibytes(delta),
      formatPercent(delta, base.size),
      formatKibibytes(pr.sizeLimit, KIBIBYTE_SIZE_FRACTION_DIGITS),
      formatHeadroom(headroom),
      pr.passed ? "✅ pass" : "❌ fail",
    ];
    lines.push(`| ${cells.join(" | ")} |`);
  }
  return lines.join("\n");
}

function buildMetadataLine(input: BundleSizeComparisonInput): string {
  const headSha = input.headSha ?? UNKNOWN_VALUE;
  const baseReference = input.baseRef ?? UNKNOWN_VALUE;
  const baseSha = input.baseSha ?? UNKNOWN_VALUE;

  return `**PR head:** \`${headSha}\` · **Target branch:** \`${baseReference}\` · **Base commit:** \`${baseSha}\``;
}

function collectDownloadFailures(input: BundleSizeComparisonInput): string[] {
  const failures: string[] = [];
  if (input.prDownloadOutcome !== DOWNLOAD_SUCCESS_OUTCOME) {
    failures.push(DOWNLOAD_FAILURE_MESSAGES.pr);
  }
  if (input.baseDownloadOutcome !== DOWNLOAD_SUCCESS_OUTCOME) {
    failures.push(DOWNLOAD_FAILURE_MESSAGES.base);
  }
  return failures;
}

function buildUnavailableSummary(message: string): BundleSizeComparisonResult {
  return {
    markdown: `${SUMMARY_HEADING}\n\n${COMPARISON_UNAVAILABLE_TEXT}\n\n${message}\n`,
    exitCode: EXIT_FAILURE,
  };
}

function buildBaseFailureNote(baseFailures: readonly BundleSizeCheck[]): string {
  return `> Base measurement exceeds its cap for ${baseFailures.map(({ key }) => `\`${key}\``).join(", ")}. This is informational and does not fail the gate.`;
}

function buildResultLine(prFailures: readonly BundleSizeCheck[]): string {
  if (prFailures.length === 0) {
    return "**Result:** PR bundle is within both absolute caps.";
  }
  return `**Result:** PR bundle exceeds the absolute cap for ${prFailures.map(({ key }) => `\`${key}\``).join(", ")}.`;
}

function getFailedChecks(checks: ReadonlyMap<BundleSizeCheckKey, SizeLimitResult>): BundleSizeCheck[] {
  return BUNDLE_SIZE_CHECKS.filter(({ key }) => !getRequiredCheck(checks, key).passed);
}

function buildAvailableSummary(
  input: BundleSizeComparisonInput,
  prChecks: ReadonlyMap<BundleSizeCheckKey, SizeLimitResult>,
  baseChecks: ReadonlyMap<BundleSizeCheckKey, SizeLimitResult>,
): BundleSizeComparisonResult {
  const prFailures = getFailedChecks(prChecks);
  const baseFailures = getFailedChecks(baseChecks);
  const lines = [
    SUMMARY_HEADING,
    "",
    buildMetadataLine(input),
    "",
    buildSummaryTable(prChecks, baseChecks),
  ];

  if (baseFailures.length > 0) {
    lines.push("", buildBaseFailureNote(baseFailures));
  }

  lines.push("", buildResultLine(prFailures));

  return {
    markdown: lines.join("\n"),
    exitCode: prFailures.length > 0 ? EXIT_FAILURE : EXIT_SUCCESS,
  };
}

function buildComparisonSummary(input: BundleSizeComparisonInput): BundleSizeComparisonResult {
  const downloadFailures = collectDownloadFailures(input);
  if (downloadFailures.length > 0) {
    return buildUnavailableSummary(downloadFailures.join(" "));
  }

  const prMeasurement = readSizeLimitReport(input.prJsonPath, PR_SIDE_LABEL);
  if (!prMeasurement.ok) {
    return buildUnavailableSummary(prMeasurement.error);
  }

  const baseMeasurement = readSizeLimitReport(input.baseJsonPath, BASE_SIDE_LABEL);
  if (!baseMeasurement.ok) {
    return buildUnavailableSummary(baseMeasurement.error);
  }
  return buildAvailableSummary(input, prMeasurement.checks, baseMeasurement.checks);
}

export { buildComparisonSummary };