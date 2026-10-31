import { describe, expect, it } from "vitest";

import { resolveSelectedThemeIds } from "#shared/utils/helpers/question-theme/selection/question-theme-selection.helpers";

describe(resolveSelectedThemeIds, () => {
  it("should return undefined when no active catalog is available and no theme ids are saved.", () => {
    expect(resolveSelectedThemeIds(undefined, [])).toBeUndefined();
  });

  it("should return the saved theme ids unchanged when no active catalog is available.", () => {
    expect(resolveSelectedThemeIds(["theme-a", "stale"], [])).toStrictEqual(["theme-a", "stale"]);
  });

  it("should keep only the saved theme ids that are still active when a catalog is available.", () => {
    expect(resolveSelectedThemeIds(["theme-a", "stale", "theme-b"], ["theme-b", "theme-a"])).toStrictEqual(["theme-b", "theme-a"]);
  });

  it("should return every active theme when all the saved theme ids are stale.", () => {
    expect(resolveSelectedThemeIds(["stale-1", "stale-2"], ["theme-a", "theme-b"])).toStrictEqual(["theme-a", "theme-b"]);
  });

  it.each<{ savedIdsState: string; savedThemeIds: Parameters<typeof resolveSelectedThemeIds>[0] }>([
    { savedIdsState: "are undefined", savedThemeIds: undefined },
    { savedIdsState: "are empty", savedThemeIds: [] },
  ])("should return every active theme when the saved theme ids $savedIdsState and a catalog is available.", ({ savedThemeIds }) => {
    expect(resolveSelectedThemeIds(savedThemeIds, ["theme-a", "theme-b"])).toStrictEqual(["theme-a", "theme-b"]);
  });
});