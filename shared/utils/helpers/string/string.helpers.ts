/**
 * Returns whether the input is a string with at least one character.
 */
function isNonEmptyString(input?: string): input is string {
  return typeof input === "string" && input !== "";
}

export {
  isNonEmptyString,
};