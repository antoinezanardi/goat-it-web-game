import { describe, expect, it, vi } from "vitest";

import { createFakeH3Event } from "~~/tests/unit/utils/faketories/shared/h3/h3-event.faketory";

import { resolveRequestBodyRejectionStatusCode } from "#server/utils/security/helpers/request-body-guard/request-body-guard.helpers";
import { HttpStatusCode } from "#shared/enums/http-status-code.enums";

vi.stubGlobal("getRequestHeader", vi.fn());

const mockedEvent = createFakeH3Event();

type HeadersToMock = {
  "content-length"?: string;
  "content-type"?: string;
};

function mockRequestHeaders(headers: HeadersToMock): void {
  vi.mocked(getRequestHeader).mockImplementation((_event, name) => headers[name as keyof HeadersToMock]);
}

describe(resolveRequestBodyRejectionStatusCode, () => {
  it("should not report a rejection when the content length and content type are valid.", () => {
    mockRequestHeaders({ "content-length": "1024", "content-type": "application/json; charset=utf-8" });

    const statusCode = resolveRequestBodyRejectionStatusCode(mockedEvent);

    expect(statusCode).toBeUndefined();
  });

  it.each<{ description: string; headers: HeadersToMock; expectedStatusCode: HttpStatusCode }>([
    {
      description: "the content length header is missing",
      headers: { "content-type": "application/json" },
      expectedStatusCode: HttpStatusCode.LENGTH_REQUIRED,
    },
    {
      description: "the content length header is not a non negative integer",
      headers: { "content-length": "abc", "content-type": "application/json" },
      expectedStatusCode: HttpStatusCode.LENGTH_REQUIRED,
    },
    {
      description: "the content length exceeds the maximum",
      headers: { "content-length": "600000", "content-type": "application/json" },
      expectedStatusCode: HttpStatusCode.PAYLOAD_TOO_LARGE,
    },
    {
      description: "the content type is not json",
      headers: { "content-length": "1024", "content-type": "text/plain" },
      expectedStatusCode: HttpStatusCode.UNSUPPORTED_MEDIA_TYPE,
    },
    {
      description: "the content type header is missing",
      headers: { "content-length": "1024" },
      expectedStatusCode: HttpStatusCode.UNSUPPORTED_MEDIA_TYPE,
    },
  ])("should report the expected rejection status when $description.", ({ headers, expectedStatusCode }) => {
    mockRequestHeaders(headers);

    const statusCode = resolveRequestBodyRejectionStatusCode(mockedEvent);

    expect(statusCode).toBe(expectedStatusCode);
  });
});