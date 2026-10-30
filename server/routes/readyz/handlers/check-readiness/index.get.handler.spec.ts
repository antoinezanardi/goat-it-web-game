import type { H3Event } from "h3";
import { beforeEach, describe, expect, it, vi } from "vitest";
import type { Mock } from "vitest";

import { checkGoatItApiReadiness } from "#server/utils/goat-it-api/helpers/goat-it-api-readiness/goat-it-api-readiness.helpers";
import { HttpStatusCode } from "#shared/enums/http-status-code.enums";
import { checkReadinessHandler } from "#server/routes/readyz/handlers/check-readiness/index.get.handler";

vi.mock(import("#server/utils/goat-it-api/helpers/goat-it-api-readiness/goat-it-api-readiness.helpers"));

type SetHeaderMock = Mock<(name: string, value: string) => void>;

function createEventWithResponseHeaders(): { event: H3Event; setHeader: SetHeaderMock } {
  const setHeader = vi.fn<(name: string, value: string) => void>();
  // Acceptable as only the response header and status surface is needed to exercise the handler
  // oxlint-disable-next-line typescript/no-unsafe-type-assertion
  const event = { node: { res: { setHeader, statusCode: 200 } } } as unknown as H3Event;

  return { event, setHeader };
}

describe("Server Health Readiness Get Handler", () => {
  beforeEach(() => {
    vi.mocked(checkGoatItApiReadiness).mockResolvedValue(true);
  });

  describe(checkReadinessHandler, () => {
    it("should set the no-store cache control header when called.", async() => {
      const { event, setHeader } = createEventWithResponseHeaders();

      await checkReadinessHandler(event);

      expect(setHeader).toHaveBeenCalledExactlyOnceWith("Cache-Control", "no-store");
    });

    it("should check the goat it api readiness with the request event when called.", async() => {
      const { event } = createEventWithResponseHeaders();

      await checkReadinessHandler(event);

      expect(checkGoatItApiReadiness).toHaveBeenCalledExactlyOnceWith(event);
    });

    it("should return a ready status when the readiness check succeeds.", async() => {
      const { event } = createEventWithResponseHeaders();

      const result = await checkReadinessHandler(event);

      expect(result).toStrictEqual({ status: "ready" });
    });

    it("should keep the success status when the readiness check succeeds.", async() => {
      const { event } = createEventWithResponseHeaders();

      await checkReadinessHandler(event);

      expect(event.node.res.statusCode).toBe(HttpStatusCode.OK);
    });

    it("should set the service unavailable status when the readiness check fails.", async() => {
      vi.mocked(checkGoatItApiReadiness).mockResolvedValue(false);
      const { event } = createEventWithResponseHeaders();

      await checkReadinessHandler(event);

      expect(event.node.res.statusCode).toBe(HttpStatusCode.SERVICE_UNAVAILABLE);
    });

    it("should return a not ready status without any upstream detail when the readiness check fails.", async() => {
      vi.mocked(checkGoatItApiReadiness).mockResolvedValue(false);
      const { event } = createEventWithResponseHeaders();

      const result = await checkReadinessHandler(event);

      expect(result).toStrictEqual({ status: "not_ready" });
    });

    it("should reject when the readiness check throws an unexpected error.", async() => {
      vi.mocked(checkGoatItApiReadiness).mockRejectedValue(new Error("Invalid runtime configuration"));
      const { event } = createEventWithResponseHeaders();

      await expect(checkReadinessHandler(event)).rejects.toThrow("Invalid runtime configuration");
    });
  });
});