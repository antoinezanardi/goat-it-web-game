const GAME_SETTINGS_ADULT_CONTENT_ENABLED_COOKIE_FIXTURE_SET = [
  {
    name: "game_settings",
    value: encodeURIComponent(JSON.stringify({ isAdultContentEnabled: true })),
  },
] as const;

export {
  GAME_SETTINGS_ADULT_CONTENT_ENABLED_COOKIE_FIXTURE_SET,
};