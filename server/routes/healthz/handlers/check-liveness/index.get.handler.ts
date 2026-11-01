import { setResponseHeader } from "h3";
import type { H3Event } from "h3";

import type { LivenessResponse } from "#server/routes/healthz/handlers/check-liveness/check-liveness.types";

function checkLivenessHandler(event: H3Event): LivenessResponse {
  setResponseHeader(event, "Cache-Control", "no-store");

  return { status: "ok" };
}

export {
  checkLivenessHandler,
};