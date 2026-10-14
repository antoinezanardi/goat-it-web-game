const CHANGELOG_OUTDATED_COOKIE_FIXTURE_SET = [
  {
    name: "changelog_state",
    value: encodeURIComponent(JSON.stringify({ lastSeenVersion: "1.8.0", lastNotifiedVersion: "1.8.0" })),
  },
] as const;

export {
  CHANGELOG_OUTDATED_COOKIE_FIXTURE_SET,
};