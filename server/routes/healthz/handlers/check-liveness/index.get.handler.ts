import { setResponseHeader } from "h3";
import type { H3Event } from "h3";

type LivenessResponse = {
  status: "ok";
};

function checkLivenessHandler(event: H3Event): LivenessResponse {
  setResponseHeader(event, "Cache-Control", "no-store");

  return { status: "ok" };
}

export {
  checkLivenessHandler,
};