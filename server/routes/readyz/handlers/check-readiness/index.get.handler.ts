import { setResponseHeader, setResponseStatus } from "h3";
import type { H3Event } from "h3";

import { checkGoatItApiReadiness } from "#server/utils/goat-it-api/helpers/goat-it-api-readiness/goat-it-api-readiness.helpers";
import { HttpStatusCode } from "#server/utils/http/http.enums";

type ReadinessResponse = {
  status: "ready" | "not_ready";
};

async function checkReadinessHandler(event: H3Event): Promise<ReadinessResponse> {
  setResponseHeader(event, "Cache-Control", "no-store");

  const isReady = await checkGoatItApiReadiness(event);

  if (!isReady) {
    setResponseStatus(event, HttpStatusCode.SERVICE_UNAVAILABLE);

    return { status: "not_ready" };
  }
  return { status: "ready" };
}

export {
  checkReadinessHandler,
};