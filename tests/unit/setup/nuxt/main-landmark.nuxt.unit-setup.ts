import { afterEach, beforeEach } from "vitest";

import { createMainLandmark, removeMainLandmark } from "~~/tests/unit/utils/helpers/main-landmark.helpers";

beforeEach(() => {
  createMainLandmark();
});

afterEach(() => {
  removeMainLandmark();
});