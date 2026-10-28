import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { createFakeH3Event } from "~~/tests/unit/utils/faketories/shared/h3/h3-event.faketory";

import { checkGoatItApiReadiness } from "#server/utils/goat-it-api/helpers/goat-it-api-readiness/goat-it-api-readiness.helpers";
import { HttpStatusCode } from "#server/utils/http/http.enums";

vi.stubGlobal("useRuntimeConfig", vi.fn());
vi.stubGlobal("fetch", vi.fn<typeof fetch>());

const MOCKED_GOAT_IT_API_BASE_URL = "https://api.goat-it.com";

let checkFreshGoatItApiReadiness: typeof checkGoatItApiReadiness;

function createReadinessResponse(statusCode: number): Response {
  return { status: statusCode } as Response;
}

describe(checkGoatItApiReadiness, () => {
  const mockedEvent = createFakeH3Event();

  beforeEach(async() => {
    vi.mocked(useRuntimeConfig).mockReturnValue({
      goatItApi: { baseUrl: MOCKED_GOAT_IT_API_BASE_URL, gameKey: "test-game-key" },
    } as unknown as ReturnType<typeof useRuntimeConfig>);
    vi.mocked(fetch).mockResolvedValue(createReadinessResponse(HttpStatusCode.OK));
    vi.resetModules();
    ({ checkGoatItApiReadiness: checkFreshGoatItApiReadiness } = await import("#server/utils/goat-it-api/helpers/goat-it-api-readiness/goat-it-api-readiness.helpers"));
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("should probe the configured goat it api health endpoint without credentials when called.", async() => {
    await checkFreshGoatItApiReadiness(mockedEvent);

    expect(fetch).toHaveBeenCalledExactlyOnceWith(`${MOCKED_GOAT_IT_API_BASE_URL}/health`, {
      method: "GET",
      redirect: "error",
      signal: expect.any(AbortSignal) as AbortSignal,
    });
  });

  it("should return true when the upstream health endpoint answers successfully.", async() => {
    const isReady = await checkFreshGoatItApiReadiness(mockedEvent);

    expect(isReady).toBe(true);
  });

  it("should return false when the upstream health endpoint answers with a non 200 status.", async() => {
    vi.mocked(fetch).mockResolvedValue(createReadinessResponse(HttpStatusCode.SERVICE_UNAVAILABLE));

    const isReady = await checkFreshGoatItApiReadiness(mockedEvent);

    expect(isReady).toBe(false);
  });

  it.each<{ description: string; probeError: Error }>([
    { description: "a connection failure", probeError: new TypeError("fetch failed") },
    { description: "a probe timeout", probeError: new DOMException("The operation was aborted due to timeout", "TimeoutError") },
  ])("should return false when the upstream probe fails with $description.", async({ probeError }) => {
    vi.mocked(fetch).mockRejectedValue(probeError);

    const isReady = await checkFreshGoatItApiReadiness(mockedEvent);

    expect(isReady).toBe(false);
  });

  it("should reuse the cached readiness without probing again when called twice within the cache ttl.", async() => {
    await checkFreshGoatItApiReadiness(mockedEvent);
    await checkFreshGoatItApiReadiness(mockedEvent);

    expect(fetch).toHaveBeenCalledOnce();
  });

  it("should cache a failed readiness within the cache ttl when the upstream probe fails.", async() => {
    vi.mocked(fetch).mockRejectedValue(new TypeError("fetch failed"));
    const isFirstReady = await checkFreshGoatItApiReadiness(mockedEvent);
    vi.mocked(fetch).mockResolvedValue(createReadinessResponse(HttpStatusCode.OK));
    const isSecondReady = await checkFreshGoatItApiReadiness(mockedEvent);

    expect([isFirstReady, isSecondReady]).toStrictEqual([false, false]);
  });

  it("should probe again when the cached readiness has expired.", async() => {
    vi.useFakeTimers();
    await checkFreshGoatItApiReadiness(mockedEvent);
    vi.advanceTimersByTime(5001);
    await checkFreshGoatItApiReadiness(mockedEvent);

    expect(fetch).toHaveBeenCalledTimes(2);
  });

  it("should return the fresh readiness when the cached failure has expired.", async() => {
    vi.useFakeTimers();
    vi.mocked(fetch).mockResolvedValue(createReadinessResponse(HttpStatusCode.SERVICE_UNAVAILABLE));
    await checkFreshGoatItApiReadiness(mockedEvent);
    vi.advanceTimersByTime(5001);
    vi.mocked(fetch).mockResolvedValue(createReadinessResponse(HttpStatusCode.OK));

    const isReady = await checkFreshGoatItApiReadiness(mockedEvent);

    expect(isReady).toBe(true);
  });

  it("should resolve every concurrent caller when two calls miss the cache at the same time.", async() => {
    const { promise: pendingProbe, resolve: resolveProbe } = Promise.withResolvers<Response>();
    vi.mocked(fetch).mockReturnValue(pendingProbe);

    const firstReadiness = checkFreshGoatItApiReadiness(mockedEvent);
    const secondReadiness = checkFreshGoatItApiReadiness(mockedEvent);
    resolveProbe(createReadinessResponse(HttpStatusCode.OK));
    const readinessResults = await Promise.all([firstReadiness, secondReadiness]);

    expect(readinessResults).toStrictEqual([true, true]);
  });

  it("should share a single in-flight probe when two calls miss the cache at the same time.", async() => {
    const { promise: pendingProbe, resolve: resolveProbe } = Promise.withResolvers<Response>();
    vi.mocked(fetch).mockReturnValue(pendingProbe);

    const firstReadiness = checkFreshGoatItApiReadiness(mockedEvent);
    const secondReadiness = checkFreshGoatItApiReadiness(mockedEvent);
    resolveProbe(createReadinessResponse(HttpStatusCode.OK));
    await Promise.all([firstReadiness, secondReadiness]);

    expect(fetch).toHaveBeenCalledOnce();
  });
});