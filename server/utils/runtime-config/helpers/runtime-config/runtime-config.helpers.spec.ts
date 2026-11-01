import { beforeEach, describe, expect, it, vi } from "vitest";

import { createFakeH3Event } from "~~/tests/unit/utils/faketories/shared/h3/h3-event.faketory";

import type { AppRuntimeConfig } from "#shared/types/runtime-config.types";
import { getRuntimeConfig } from "#server/utils/runtime-config/helpers/runtime-config/runtime-config.helpers";

vi.stubGlobal("useRuntimeConfig", vi.fn());

describe(getRuntimeConfig, () => {
  const mockedEvent = createFakeH3Event();

  beforeEach(() => {
    vi.mocked(useRuntimeConfig).mockReturnValue({} as unknown as ReturnType<typeof useRuntimeConfig>);
  });

  it("should read the runtime config from the event when called.", () => {
    getRuntimeConfig(mockedEvent);

    expect(useRuntimeConfig).toHaveBeenCalledExactlyOnceWith(mockedEvent);
  });

  it("should read the runtime config without an event when called without one.", () => {
    getRuntimeConfig();

    expect(useRuntimeConfig).toHaveBeenCalledExactlyOnceWith(undefined);
  });

  it("should return the runtime config typed as an app runtime config when called.", () => {
    const runtimeConfigMock = { goatItApi: { baseUrl: "https://api.goat-it.com", gameKey: "test-game-key" } } as unknown as ReturnType<typeof useRuntimeConfig>;
    vi.mocked(useRuntimeConfig).mockReturnValue(runtimeConfigMock);

    const config = getRuntimeConfig(mockedEvent);

    expect(config).toStrictEqual(runtimeConfigMock as unknown as AppRuntimeConfig);
  });
});