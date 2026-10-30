import { getValidatedQuery, readValidatedBody } from "h3";
import { ZodError, z } from "zod";
import { QUESTION_DTO } from "@goat-it/schemas/question";
import { createFakeQuestionDto } from "@goat-it/schemas/testing/question";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { createFakeH3Event } from "~~/tests/unit/utils/faketories/shared/h3/h3-event.faketory";

import { createQuestionFromQuestionDto } from "#server/utils/goat-it-api/mappers/question/question.mappers";
import {
  parseAndMapGoatItApiResponse,
  stripUnrecognizedKeys,
  validateGoatItApiBody,
  validateGoatItApiQuery,
} from "#server/utils/goat-it-api/helpers/goat-it-api-validation/goat-it-api-validation.helpers";
import { HttpStatusCode } from "#shared/enums/http-status-code.enums";
import { getServerLogger } from "#server/utils/logging/helpers/server-logger/server-logger.helpers";
import { ServerLogEventName } from "#server/utils/logging/server-log.enums";

const mockedEvent = createFakeH3Event();

vi.stubGlobal("useRuntimeConfig", vi.fn());

describe(parseAndMapGoatItApiResponse, () => {
  beforeEach(() => {
    vi.mocked(useRuntimeConfig).mockReturnValue({ logger: { level: "info" } } as unknown as ReturnType<typeof useRuntimeConfig>);
    vi.spyOn(getServerLogger(), "warn").mockReturnValue(undefined);
  });

  it("should return the mapped domain objects when the raw data matches the dto schema.", () => {
    const fakeQuestionDtos = [
      createFakeQuestionDto(),
      createFakeQuestionDto(),
      createFakeQuestionDto(),
    ];
    const expectedQuestions = fakeQuestionDtos.map(createQuestionFromQuestionDto);

    const questions = parseAndMapGoatItApiResponse(fakeQuestionDtos, QUESTION_DTO, createQuestionFromQuestionDto);

    expect(questions).toStrictEqual(expectedQuestions);
  });

  it("should return an empty array when the raw data is an empty array.", () => {
    const questions = parseAndMapGoatItApiResponse([], QUESTION_DTO, createQuestionFromQuestionDto);

    expect(questions).toStrictEqual([]);
  });

  it("should return the mapped domain objects when an additive upstream field is present.", () => {
    const fakeQuestionDto = createFakeQuestionDto();
    const rawData = [{ ...fakeQuestionDto, additiveField: "value" }];

    const questions = parseAndMapGoatItApiResponse(rawData, QUESTION_DTO, createQuestionFromQuestionDto);

    expect(questions).toStrictEqual([createQuestionFromQuestionDto(fakeQuestionDto)]);
  });

  it("should return the mapped domain objects when an additive nested upstream field is present.", () => {
    const fakeQuestionDto = createFakeQuestionDto();
    const rawData = [{ ...fakeQuestionDto, author: { ...fakeQuestionDto.author, additiveField: "value" } }];

    const questions = parseAndMapGoatItApiResponse(rawData, QUESTION_DTO, createQuestionFromQuestionDto);

    expect(questions).toStrictEqual([createQuestionFromQuestionDto(fakeQuestionDto)]);
  });

  it("should log the stripped paths when an additive upstream field is present.", () => {
    const warnSpy = vi.spyOn(getServerLogger(), "warn").mockReturnValue(undefined);
    const rawData = [{ ...createFakeQuestionDto(), additiveField: "value" }];

    parseAndMapGoatItApiResponse(rawData, QUESTION_DTO, createQuestionFromQuestionDto);

    expect(warnSpy).toHaveBeenCalledExactlyOnceWith({
      event: ServerLogEventName.GOAT_IT_API_SCHEMA_DRIFT,
      reason: "0.additiveField",
    });
  });

  it("should throw a zod error when an additive field is present alongside an invalid field.", () => {
    const invalidQuestionDto = { ...createFakeQuestionDto(), id: "invalid-id", additiveField: "value" };

    expect(() => parseAndMapGoatItApiResponse([invalidQuestionDto], QUESTION_DTO, createQuestionFromQuestionDto)).toThrow(ZodError);
  });

  it("should throw a zod error when the raw data is not an array.", () => {
    expect(() => parseAndMapGoatItApiResponse({ id: "invalid-id" }, QUESTION_DTO, createQuestionFromQuestionDto)).toThrow(ZodError);
  });
});

describe(stripUnrecognizedKeys, () => {
  function createUnrecognizedKeysIssue(path: PropertyKey[], keys: string[]): z.core.$ZodIssueUnrecognizedKeys {
    return { code: "unrecognized_keys", keys, path, message: "Unrecognized key" };
  }

  it("should remove the reported keys from the matching nested containers when called.", () => {
    const rawData = [{ id: "abc", author: { name: "x", extra: "y" } }];

    const strippedData = stripUnrecognizedKeys(rawData, [createUnrecognizedKeysIssue([0, "author"], ["extra"])]);

    expect(strippedData).toStrictEqual([{ id: "abc", author: { name: "x" } }]);
  });

  it("should leave the data untouched when the reported path does not resolve to a container.", () => {
    const rawData = { author: "not-an-object" };

    const strippedData = stripUnrecognizedKeys(rawData, [createUnrecognizedKeysIssue(["author", "deeper"], ["extra"])]);

    expect(strippedData).toStrictEqual({ author: "not-an-object" });
  });
});

describe(validateGoatItApiQuery, () => {
  const querySchema = z.strictObject({ limit: z.number() });

  it("should read the query through the h3 validated query helper when called.", async() => {
    vi.mocked(getValidatedQuery).mockResolvedValue({ limit: 5 });

    await validateGoatItApiQuery(mockedEvent, querySchema);

    expect(getValidatedQuery).toHaveBeenCalledExactlyOnceWith(mockedEvent, expect.any(Function));
  });

  it("should return the schema parsed query when the query is valid.", async() => {
    vi.mocked(getValidatedQuery).mockImplementation(async(_event, validate) => {
      const parsedQuery = await validate({ limit: 5 });

      return parsedQuery;
    });

    const query = await validateGoatItApiQuery(mockedEvent, querySchema);

    expect(query).toStrictEqual({ limit: 5 });
  });

  it("should reject with a bad request error carrying the invalid request code when the query is invalid.", async() => {
    vi.mocked(getValidatedQuery).mockRejectedValue(Object.assign(new Error("Validation Error"), { statusCode: HttpStatusCode.BAD_REQUEST }));

    await expect(validateGoatItApiQuery(mockedEvent, querySchema)).rejects.toMatchObject({
      statusCode: HttpStatusCode.BAD_REQUEST,
      data: { errorCode: "invalid-request" },
    });
  });

  it("should rethrow the original error when the h3 validated query helper rejects with a non validation error.", async() => {
    const originalError = new Error("boom");
    vi.mocked(getValidatedQuery).mockRejectedValue(originalError);

    await expect(validateGoatItApiQuery(mockedEvent, querySchema)).rejects.toThrow(originalError);
  });
});

describe(validateGoatItApiBody, () => {
  const bodySchema = z.strictObject({ limit: z.number() });

  it("should read the body through the h3 validated body helper when called.", async() => {
    vi.mocked(readValidatedBody).mockResolvedValue({ limit: 5 });

    await validateGoatItApiBody(mockedEvent, bodySchema);

    expect(readValidatedBody).toHaveBeenCalledExactlyOnceWith(mockedEvent, expect.any(Function));
  });

  it("should return the schema parsed body when the body is valid.", async() => {
    vi.mocked(readValidatedBody).mockImplementation(async(_event, validate) => {
      const parsedBody = await validate({ limit: 5 });

      return parsedBody;
    });

    const body = await validateGoatItApiBody(mockedEvent, bodySchema);

    expect(body).toStrictEqual({ limit: 5 });
  });

  it("should reject with a bad request error carrying the invalid request code when the body is invalid.", async() => {
    vi.mocked(readValidatedBody).mockRejectedValue(Object.assign(new Error("Validation Error"), { statusCode: HttpStatusCode.BAD_REQUEST }));

    await expect(validateGoatItApiBody(mockedEvent, bodySchema)).rejects.toMatchObject({
      statusCode: HttpStatusCode.BAD_REQUEST,
      data: { errorCode: "invalid-request" },
    });
  });

  it("should rethrow the original error when the h3 validated body helper rejects with a non validation error.", async() => {
    const originalError = new Error("boom");
    vi.mocked(readValidatedBody).mockRejectedValue(originalError);

    await expect(validateGoatItApiBody(mockedEvent, bodySchema)).rejects.toThrow(originalError);
  });
});