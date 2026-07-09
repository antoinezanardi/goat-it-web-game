function isNonEmptyString(input?: string): input is string {
  return typeof input === "string" && input !== "";
}

export {
  isNonEmptyString,
};