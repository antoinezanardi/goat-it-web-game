import { describe, expect, it, vi } from "vitest";

import { sleep } from "#shared/utils/helpers/time/time.helpers";

describe(sleep, () => {
  it("should call setTimeout with the specified delay when called.", () => {
    const delayInMs = 500;
    const setTimeoutSpy = vi.spyOn(globalThis, "setTimeout");

    void sleep(delayInMs);

    expect(setTimeoutSpy).toHaveBeenCalledExactlyOnceWith(expect.any(Function), delayInMs);
  });

  it("should resolve the promise when the specified delay has elapsed.", async() => {
    const delayInMs = 500;

    const promise = sleep(delayInMs);
    vi.advanceTimersByTime(delayInMs);

    await expect(promise).resolves.toBeUndefined();
  });

  it("should resolve immediately when zero milliseconds are specified.", async() => {
    const promise = sleep(0);
    vi.advanceTimersByTime(0);

    await expect(promise).resolves.toBeUndefined();
  });
});