import type { H3Event } from "h3";
import { describe, expect, it, vi } from "vitest";
import type { Mock } from "vitest";

import { checkLivenessHandler } from "#server/routes/healthz/handlers/check-liveness/index.get.handler";

type SetHeaderMock = Mock<(name: string, value: string) => void>;

function createEventWithResponseHeaders(): { event: H3Event; setHeader: SetHeaderMock } {
  const setHeader = vi.fn<(name: string, value: string) => void>();
  // Acceptable as only the response header setter is needed to exercise the handler
  // oxlint-disable-next-line typescript/no-unsafe-type-assertion
  const event = { node: { res: { setHeader } } } as unknown as H3Event;

  return { event, setHeader };
}

describe("Server Health Liveness Get Handler", () => {
  describe(checkLivenessHandler, () => {
    it("should set the no-store cache control header when called.", () => {
      const { event, setHeader } = createEventWithResponseHeaders();

      checkLivenessHandler(event);

      expect(setHeader).toHaveBeenCalledExactlyOnceWith("Cache-Control", "no-store");
    });

    it("should return an ok status without any dependency check when called.", () => {
      const { event } = createEventWithResponseHeaders();

      const result = checkLivenessHandler(event);

      expect(result).toStrictEqual({ status: "ok" });
    });
  });
});