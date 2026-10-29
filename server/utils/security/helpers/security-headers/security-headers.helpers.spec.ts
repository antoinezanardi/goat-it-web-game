import type { H3Event } from "h3";
import type { NitroApp } from "nitropack/types";
import { beforeEach, describe, expect, it, vi } from "vitest";
import type { Mock } from "vitest";

import {
  buildContentSecurityPolicy,
  generateCspNonce,
  getSentryIngestOrigin,
  registerCspNonceHook,
  stampNonceOnInlineScripts,
} from "#server/utils/security/helpers/security-headers/security-headers.helpers";
import type { CspMode } from "#shared/types/runtime-config.types";

vi.stubGlobal("useRuntimeConfig", vi.fn());

type RenderHtmlContext = {
  head: string[];
  body: string[];
  bodyPrepend: string[];
  bodyAppend: string[];
};

type RenderHtmlHandlerOptions = {
  event: H3Event;
  streaming: boolean;
};

type RenderHtmlHandler = (htmlContext: RenderHtmlContext, options: RenderHtmlHandlerOptions) => void;

type RenderHtmlHookMock = Mock<(event: string, handler: RenderHtmlHandler) => void>;

type SetHeaderMock = Mock<(name: string, value: string) => void>;

const HTML_CHUNKS = {
  head: ["<script>head</script>"],
  body: ["<script>body</script>"],
  bodyPrepend: ["<script>bodyPrepend</script>"],
  bodyAppend: ["<script>bodyAppend</script>"],
} as const;

function createHtmlContext(): RenderHtmlContext {
  return {
    head: [...HTML_CHUNKS.head],
    body: [...HTML_CHUNKS.body],
    bodyPrepend: [...HTML_CHUNKS.bodyPrepend],
    bodyAppend: [...HTML_CHUNKS.bodyAppend],
  };
}

function createEventWithResponseHeaders(): { event: H3Event; setHeader: SetHeaderMock } {
  const setHeader = vi.fn<(name: string, value: string) => void>();
  // Acceptable as only the response header setter is needed to exercise the render hook
  // oxlint-disable-next-line typescript/no-unsafe-type-assertion
  const event = { node: { res: { setHeader } } } as unknown as H3Event;

  return { event, setHeader };
}

function registerRenderHtmlHook(cspMode: CspMode, sentryDsn = ""): { hookMock: RenderHtmlHookMock; handler: RenderHtmlHandler } {
  const hookMock = vi.fn<(event: string, handler: RenderHtmlHandler) => void>();
  // Acceptable as only the hook registration surface is needed to capture the render handler
  // oxlint-disable-next-line typescript/no-unsafe-type-assertion
  const nitroApp = { hooks: { hook: hookMock } } as unknown as NitroApp;

  vi.mocked(useRuntimeConfig).mockReturnValue({
    security: { cspMode },
    public: { sentry: { dsn: sentryDsn } },
  } as unknown as ReturnType<typeof useRuntimeConfig>);
  registerCspNonceHook(nitroApp);

  const hookCall = hookMock.mock.calls[0];

  if (hookCall === undefined) {
    throw new Error("The render html hook was not registered");
  }
  return { hookMock, handler: hookCall[1] };
}

describe(getSentryIngestOrigin, () => {
  it.each<{ description: string; dsn: string; expectedOrigin: string | undefined }>([
    {
      description: "a US ingest dsn",
      dsn: "https://public@o123.ingest.us.sentry.io/456",
      expectedOrigin: "https://o123.ingest.us.sentry.io",
    },
    {
      description: "an EU ingest dsn",
      dsn: "https://public@o123.ingest.de.sentry.io/456",
      expectedOrigin: "https://o123.ingest.de.sentry.io",
    },
    { description: "an empty dsn", dsn: "", expectedOrigin: undefined },
    { description: "a malformed dsn", dsn: "http://[", expectedOrigin: undefined },
    { description: "a non https dsn", dsn: "http://o123.ingest.us.sentry.io/456", expectedOrigin: undefined },
    { description: "a non ingest sentry host", dsn: "https://de.sentry.io/456", expectedOrigin: undefined },
    { description: "an ingest host outside sentry", dsn: "https://o1.ingest.evil.com/456", expectedOrigin: undefined },
  ])("should return the expected origin when the dsn is $description.", ({ dsn, expectedOrigin }) => {
    expect(getSentryIngestOrigin(dsn)).toBe(expectedOrigin);
  });
});

describe(buildContentSecurityPolicy, () => {
  it("should build the agreed content security policy when called with a nonce.", () => {
    const nonce = "2f1c9a3e-0000-4000-8000-000000000001";

    const policy = buildContentSecurityPolicy(nonce);

    expect(policy).toBe("default-src 'self'; " +
      `script-src 'self' 'wasm-unsafe-eval' 'nonce-${nonce}'; ` +
      "style-src 'self' 'unsafe-inline'; " +
      "img-src 'self' data:; " +
      "font-src 'self'; " +
      "connect-src 'self'; " +
      "worker-src 'self' blob:; " +
      "manifest-src 'self'; " +
      "frame-ancestors 'none'; " +
      "base-uri 'self'; " +
      "form-action 'self'; " +
      "object-src 'none'");
  });

  it("should append the sentry ingest origin to the connect src directive when a dsn is provided.", () => {
    const policy = buildContentSecurityPolicy("nonce-value", "https://public@o123.ingest.us.sentry.io/456");

    expect(policy).toContain("connect-src 'self' https://o123.ingest.us.sentry.io");
  });
});

describe(generateCspNonce, () => {
  it("should generate a uuid nonce when called.", () => {
    const nonce = generateCspNonce();

    expect(nonce).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/u);
  });
});

describe(stampNonceOnInlineScripts, () => {
  it("should add the nonce to every script tag when no nonce is present.", () => {
    const chunks = [
      "<script type=\"importmap\">{\"imports\":{}}</script>",
      "<script>window.__NUXT__={}</script>",
    ];

    const stampedChunks = stampNonceOnInlineScripts(chunks, "nonce-value");

    expect(stampedChunks).toStrictEqual([
      "<script nonce=\"nonce-value\" type=\"importmap\">{\"imports\":{}}</script>",
      "<script nonce=\"nonce-value\">window.__NUXT__={}</script>",
    ]);
  });

  it.each<{ description: string; chunks: string[]; expectedChunks: string[] }>([
    {
      description: "a script tag already has a nonce",
      chunks: ["<script nonce=\"existing\" src=\"/app.js\"></script>"],
      expectedChunks: ["<script nonce=\"existing\" src=\"/app.js\"></script>"],
    },
    {
      description: "the chunk contains no script tag",
      chunks: ["<style>:root{color:red}</style>"],
      expectedChunks: ["<style>:root{color:red}</style>"],
    },
    {
      description: "a script tag is uppercase without a nonce",
      chunks: ["<SCRIPT>window.__NUXT__={}</SCRIPT>"],
      expectedChunks: ["<script nonce=\"nonce-value\">window.__NUXT__={}</SCRIPT>"],
    },
  ])("should return the expected chunks when $description.", ({ chunks, expectedChunks }) => {
    const stampedChunks = stampNonceOnInlineScripts(chunks, "nonce-value");

    expect(stampedChunks).toStrictEqual(expectedChunks);
  });
});

describe(registerCspNonceHook, () => {
  beforeEach(() => {
    vi.mocked(useRuntimeConfig).mockReset();
  });

  it("should register the render html hook when called.", () => {
    const { hookMock } = registerRenderHtmlHook("enforce");

    expect(hookMock).toHaveBeenCalledExactlyOnceWith("render:html", expect.any(Function));
  });

  it("should leave the html chunks untouched when the csp mode is off.", () => {
    const { handler } = registerRenderHtmlHook("off");
    const htmlContext = createHtmlContext();
    const { event } = createEventWithResponseHeaders();

    handler(htmlContext, { event, streaming: false });

    expect(htmlContext).toStrictEqual(createHtmlContext());
  });

  it("should not set a policy header when the csp mode is off.", () => {
    const { handler } = registerRenderHtmlHook("off");
    const { event, setHeader } = createEventWithResponseHeaders();

    handler(createHtmlContext(), { event, streaming: false });

    expect(setHeader).not.toHaveBeenCalled();
  });

  it("should stamp the head chunk when the csp mode is enforced.", () => {
    const { handler } = registerRenderHtmlHook("enforce");
    const htmlContext = createHtmlContext();
    const { event } = createEventWithResponseHeaders();

    handler(htmlContext, { event, streaming: false });

    expect(htmlContext.head[0]).toContain("nonce=");
  });

  it("should stamp the body prepend chunk when the csp mode is enforced.", () => {
    const { handler } = registerRenderHtmlHook("enforce");
    const htmlContext = createHtmlContext();
    const { event } = createEventWithResponseHeaders();

    handler(htmlContext, { event, streaming: false });

    expect(htmlContext.bodyPrepend[0]).toContain("nonce=");
  });

  it("should stamp the body append chunk when the csp mode is enforced and the render is not streaming.", () => {
    const { handler } = registerRenderHtmlHook("enforce");
    const htmlContext = createHtmlContext();
    const { event } = createEventWithResponseHeaders();

    handler(htmlContext, { event, streaming: false });

    expect(htmlContext.bodyAppend[0]).toContain("nonce=");
  });

  it("should not stamp the app rendered body chunk when the csp mode is enforced.", () => {
    const { handler } = registerRenderHtmlHook("enforce");
    const htmlContext = createHtmlContext();
    const { event } = createEventWithResponseHeaders();

    handler(htmlContext, { event, streaming: false });

    expect(htmlContext.body).toStrictEqual([...HTML_CHUNKS.body]);
  });

  it("should not stamp the body append chunk when the render is streaming.", () => {
    const { handler } = registerRenderHtmlHook("enforce");
    const htmlContext = createHtmlContext();
    const { event } = createEventWithResponseHeaders();

    handler(htmlContext, { event, streaming: true });

    expect(htmlContext.bodyAppend).toStrictEqual([...HTML_CHUNKS.bodyAppend]);
  });

  it("should set the enforced policy header with the generated nonce when the csp mode is enforced.", () => {
    const { handler } = registerRenderHtmlHook("enforce");
    const { event, setHeader } = createEventWithResponseHeaders();

    handler(createHtmlContext(), { event, streaming: false });

    expect(setHeader).toHaveBeenCalledExactlyOnceWith("Content-Security-Policy", expect.stringContaining("'nonce-"));
  });

  it("should append the sentry ingest origin to the policy when a sentry dsn is configured.", () => {
    const { handler } = registerRenderHtmlHook("enforce", "https://public@o123.ingest.us.sentry.io/456");
    const { event, setHeader } = createEventWithResponseHeaders();

    handler(createHtmlContext(), { event, streaming: false });

    expect(setHeader).toHaveBeenCalledExactlyOnceWith(
      "Content-Security-Policy",
      expect.stringContaining("connect-src 'self' https://o123.ingest.us.sentry.io"),
    );
  });

  it("should set the report only policy header when the csp mode is report-only.", () => {
    const { handler } = registerRenderHtmlHook("report-only");
    const { event, setHeader } = createEventWithResponseHeaders();

    handler(createHtmlContext(), { event, streaming: false });

    expect(setHeader).toHaveBeenCalledExactlyOnceWith("Content-Security-Policy-Report-Only", expect.stringContaining("'nonce-"));
  });
});