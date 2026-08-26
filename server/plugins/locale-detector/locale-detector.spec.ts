import { getCookie } from "h3";
import { describe, it, expect, vi, beforeEach, beforeAll } from "vitest";

// Acceptable as import() form causes TypeScript type mismatches with mock factory return types
// oxlint-disable-next-line vitest/prefer-import-in-mock
vi.mock("nitropack/runtime", () => ({
  // Acceptable as defineNitroPlugin is an identity wrapper for testing the inner plugin logic
  // oxlint-disable-next-line typescript/explicit-function-return-type
  defineNitroPlugin: (plugin: (nitro: unknown) => void) => plugin,
}));

// Acceptable as import() form causes TypeScript type mismatches with mock factory return types
// oxlint-disable-next-line vitest/prefer-import-in-mock
vi.mock("h3", () => ({
  getCookie: vi.fn<(event: unknown, name: string) => string | undefined>(),
}));

type RenderBeforeContext = {
  event: {
    context: {
      nuxtI18n: {
        vueI18nOptions: { defaultLocale: string };
        detectLocale?: string;
      };
    };
  };
};

function createRenderBeforeContext(overrides?: Partial<RenderBeforeContext["event"]["context"]["nuxtI18n"]>): RenderBeforeContext {
  return {
    event: {
      context: {
        nuxtI18n: {
          vueI18nOptions: { defaultLocale: "en" },
          ...overrides,
        },
      },
    },
  };
}

let pluginFunction: (nitro: Record<string, unknown>) => void;

describe("Locale Detector Nitro Plugin", () => {
  let hookHandler: ((context: RenderBeforeContext) => void) | undefined;
  let nitroHook: ReturnType<typeof vi.fn>;

  beforeAll(async() => {
    const localeDetectorModule = await import("./locale-detector");
    pluginFunction = localeDetectorModule.default as unknown as (nitro: Record<string, unknown>) => void;
  });

  beforeEach(() => {
    vi.clearAllMocks();
    nitroHook = vi.fn<() => void>();
    pluginFunction({ hooks: { hook: nitroHook } });
    hookHandler = nitroHook.mock.calls[0]?.[1] as ((context: RenderBeforeContext) => void) | undefined;
  });

  it("should set detectLocale to the cookie locale when i18n_redirected cookie is valid.", () => {
    vi.mocked(getCookie).mockReturnValue("fr");
    const context = createRenderBeforeContext();

    hookHandler?.(context);

    expect(context.event.context.nuxtI18n.detectLocale).toBe("fr");
  });

  it("should set detectLocale to the default locale when i18n_redirected cookie is missing.", () => {
    vi.mocked(getCookie).mockReturnValue(undefined);
    const context = createRenderBeforeContext();

    hookHandler?.(context);

    expect(context.event.context.nuxtI18n.detectLocale).toBe("en");
  });

  it("should set detectLocale to the default locale when i18n_redirected cookie is invalid.", () => {
    vi.mocked(getCookie).mockReturnValue("FR");
    const context = createRenderBeforeContext();

    hookHandler?.(context);

    expect(context.event.context.nuxtI18n.detectLocale).toBe("en");
  });

  it("should return without error when nuxtI18n is absent from event context.", () => {
    const context = { event: { context: {} } } as unknown as RenderBeforeContext;

    expect(() => hookHandler?.(context)).not.toThrow();
  });
});