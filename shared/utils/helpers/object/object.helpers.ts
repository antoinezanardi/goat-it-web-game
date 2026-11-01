/**
 * Returns whether the input is a non-null, non-array object.
 */
function isRecord(input: unknown): input is Record<string, unknown> {
  return typeof input === "object" && input !== null && !Array.isArray(input);
}

export {
  isRecord,
};