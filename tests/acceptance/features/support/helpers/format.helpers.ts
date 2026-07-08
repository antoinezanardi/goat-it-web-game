const JSON_STRINGIFY_INDENT = 2;

function prettyStringify(value: unknown): string {
  return JSON.stringify(value, undefined, JSON_STRINGIFY_INDENT);
}

export { prettyStringify };