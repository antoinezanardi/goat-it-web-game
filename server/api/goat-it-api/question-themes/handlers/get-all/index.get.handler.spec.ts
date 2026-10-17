import { vi, describe, it, expect, beforeEach } from "vitest";
import { ZodError } from "zod";
import { FIND_QUESTION_THEMES_QUERY_DTO, QUESTION_THEME_DTO } from "@goat-it/schemas/question-theme";
import { createFakeQuestionThemeDto } from "@goat-it/schemas/testing/question-theme";

import { createFakeH3Event } from "~~/tests/unit/utils/faketories/shared/h3/h3-event.faketory";
import { createFakeQuestionTheme } from "~~/tests/unit/utils/faketories/question-theme/question-theme.entity.faketory";

import { createQuestionThemeFromQuestionThemeDto } from "#server/utils/goat-it-api/mappers/question-theme/question-theme.mappers";
import { createGoatItApiEndpoint, createGoatItApiFetchOptions } from "#server/utils/goat-it-api/helpers/goat-it-api.helpers";
import { parseAndMapGoatItApiResponse, validateGoatItApiQuery } from "#server/utils/goat-it-api/helpers/goat-it-api-validation.helpers";
import { throwGoatItApiError } from "#server/utils/goat-it-api/helpers/goat-it-api-error.helpers";
import { HttpStatusCode } from "#server/utils/http/http.enums";
import { getQuestionThemesHandler } from "#server/api/goat-it-api/question-themes/handlers/get-all/index.get.handler";

vi.mock(import("#server/utils/goat-it-api/helpers/goat-it-api.helpers"));
vi.mock(import("#server/utils/goat-it-api/helpers/goat-it-api-validation.helpers"));
vi.mock(import("#server/utils/goat-it-api/helpers/goat-it-api-error.helpers"));

describe("Server Goat It API Question Themes Get Handler", () => {
  const mockedEvent = createFakeH3Event();

  beforeEach(() => {
    vi.mocked(validateGoatItApiQuery).mockResolvedValue({ "sort-by": "slug", "sort-order": "asc", "limit": 50 });
    vi.mocked($fetch).mockResolvedValue([
      createFakeQuestionThemeDto(),
      createFakeQuestionThemeDto(),
      createFakeQuestionThemeDto(),
    ]);
  });

  describe(getQuestionThemesHandler, () => {
    it("should create goat it api endpoint when called.", async() => {
      await getQuestionThemesHandler(mockedEvent);

      expect(createGoatItApiEndpoint).toHaveBeenCalledExactlyOnceWith("question-themes");
    });

    it("should create goat it api fetch options with the get method when called.", async() => {
      await getQuestionThemesHandler(mockedEvent);

      expect(createGoatItApiFetchOptions).toHaveBeenCalledExactlyOnceWith(mockedEvent, { method: "GET" });
    });

    it("should validate the query through the goat it api query validator when called.", async() => {
      await getQuestionThemesHandler(mockedEvent);

      expect(validateGoatItApiQuery).toHaveBeenCalledExactlyOnceWith(mockedEvent, FIND_QUESTION_THEMES_QUERY_DTO);
    });

    it("should fetch question themes from goat it api with correct endpoint, fetch options and query when called.", async() => {
      const expectedEndpoint = "/question-themes";
      const expectedFetchOptions = {
        baseURL: "https://api.goat-it.com",
        headers: {
          "goat-it-api-key": "test-game-key",
        },
      };
      vi.mocked(createGoatItApiEndpoint).mockReturnValue(expectedEndpoint);
      vi.mocked(createGoatItApiFetchOptions).mockReturnValue(expectedFetchOptions);
      await getQuestionThemesHandler(mockedEvent);

      expect($fetch).toHaveBeenCalledExactlyOnceWith(expectedEndpoint, { ...expectedFetchOptions, query: { "sort-by": "slug", "sort-order": "asc", "limit": 50 } });
    });

    it.each<{ providedLimit: number; expectedLimit: number }>([
      { providedLimit: 0, expectedLimit: 100 },
      { providedLimit: 5000, expectedLimit: 100 },
      { providedLimit: 5, expectedLimit: 5 },
      { providedLimit: 100, expectedLimit: 100 },
    ])("should clamp the forwarded limit to $expectedLimit when the provided limit is $providedLimit.", async({ providedLimit, expectedLimit }) => {
      const expectedEndpoint = "/question-themes";
      const expectedFetchOptions = {
        baseURL: "https://api.goat-it.com",
        headers: {
          "goat-it-api-key": "test-game-key",
        },
      };
      vi.mocked(createGoatItApiEndpoint).mockReturnValue(expectedEndpoint);
      vi.mocked(createGoatItApiFetchOptions).mockReturnValue(expectedFetchOptions);
      vi.mocked(validateGoatItApiQuery).mockResolvedValue({ "sort-by": "slug", "sort-order": "asc", "limit": providedLimit });

      await getQuestionThemesHandler(mockedEvent);

      expect($fetch).toHaveBeenCalledExactlyOnceWith(expectedEndpoint, { ...expectedFetchOptions, query: { "sort-by": "slug", "sort-order": "asc", "limit": expectedLimit } });
    });

    it("should reject with a bad request error when the query validator rejects the query.", async() => {
      vi.mocked(validateGoatItApiQuery).mockRejectedValue(Object.assign(new Error("Validation Error"), { statusCode: HttpStatusCode.BAD_REQUEST }));

      await expect(getQuestionThemesHandler(mockedEvent)).rejects.toMatchObject({ statusCode: HttpStatusCode.BAD_REQUEST });
    });

    it("should parse and map the fetched data with the question theme dto and mapper when called.", async() => {
      const rawData = [createFakeQuestionThemeDto()];
      vi.mocked($fetch).mockResolvedValue(rawData);

      await getQuestionThemesHandler(mockedEvent);

      expect(parseAndMapGoatItApiResponse).toHaveBeenCalledExactlyOnceWith(rawData, QUESTION_THEME_DTO, createQuestionThemeFromQuestionThemeDto);
    });

    it("should return the parsed and mapped question themes when called.", async() => {
      const expectedQuestionThemes = [
        createFakeQuestionTheme(),
        createFakeQuestionTheme(),
      ];
      vi.mocked(parseAndMapGoatItApiResponse).mockReturnValue(expectedQuestionThemes);

      const result = await getQuestionThemesHandler(mockedEvent);

      expect(result).toStrictEqual(expectedQuestionThemes);
    });

    it("should call throwGoatItApiError when $fetch throws an error.", async() => {
      const fetchError = new Error("Network error");
      vi.mocked($fetch).mockRejectedValue(fetchError);

      try {
        await getQuestionThemesHandler(mockedEvent);
      } catch(error: unknown) {
        void error;
      }

      expect(throwGoatItApiError).toHaveBeenCalledExactlyOnceWith(fetchError);
    });

    it("should call throwGoatItApiError with the zod error when parsing the fetched data fails.", async() => {
      const zodError = new ZodError([]);
      vi.mocked(parseAndMapGoatItApiResponse).mockImplementation(() => {
        throw zodError;
      });

      try {
        await getQuestionThemesHandler(mockedEvent);
      } catch(error: unknown) {
        void error;
      }

      expect(throwGoatItApiError).toHaveBeenCalledExactlyOnceWith(zodError);
    });
  });
});