type BundleSizeCheckKey = "nuxt-js" | "nuxt-css";

type BundleSizeCheck = {
  readonly key: BundleSizeCheckKey;
  readonly label: string;
};

type SizeLimitResult = {
  readonly name: BundleSizeCheckKey;
  readonly size: number;
  readonly sizeLimit: number;
  readonly passed: boolean;
};

type MeasurementParseResult =
  | {
    readonly ok: true;
    readonly checks: ReadonlyMap<BundleSizeCheckKey, SizeLimitResult>;
  } |
  {
    readonly ok: false;
    readonly error: string;
  };

type BundleSizeComparisonInput = {
  readonly prJsonPath: string | undefined;
  readonly baseJsonPath: string | undefined;
  readonly prDownloadOutcome: string | undefined;
  readonly baseDownloadOutcome: string | undefined;
  readonly baseRef: string | undefined;
  readonly baseSha: string | undefined;
  readonly headSha: string | undefined;
};

type BundleSizeComparisonResult = {
  readonly markdown: string;
  readonly exitCode: 0 | 1;
};

export type {
  BundleSizeCheck,
  BundleSizeCheckKey,
  BundleSizeComparisonInput,
  BundleSizeComparisonResult,
  MeasurementParseResult,
  SizeLimitResult,
};