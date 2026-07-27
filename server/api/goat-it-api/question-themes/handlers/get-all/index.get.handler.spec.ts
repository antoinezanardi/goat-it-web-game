import { vi, describe, it, expect, beforeEach } from "vitest";
import { ZodError } from "zod";
import { createFakeQuestionThemeDto } from "@goat-it/schemas/testing/question-theme";

import { createFakeH3Event } from "~~/tests/unit/utils/faketories/shared/h3/h3-event.faketory";

import { createQuestionThemeFromQuestionThemeDto } from "#server/utils/goat-it-api/mappers/question-theme/question-theme.mappers";
import { createGoatItApiEndpoint, createGoatItApiFetchOptions, handleGoatItApiError } from "#server/utils/goat-it-api/helpers/goat-it-api.helpers";
import { getQuestionThemesHandler } from "#server/api/goat-it-api/question-themes/handlers/get-all/index.get.handler";

vi.mock(import("#server/utils/goat-it-api/helpers/goat-it-api.helpers"));

describe("Server Goat It API Question Themes Get Handler", () => {
  const mockedEvent = createFakeH3Event();

  beforeEach(() => {
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

    it("should create goat it api fetch options with event when called.", async() => {
      await getQuestionThemesHandler(mockedEvent);

      expect(createGoatItApiFetchOptions).toHaveBeenCalledExactlyOnceWith(mockedEvent);
    });

    it("should get query from event when called.", async() => {
      await getQuestionThemesHandler(mockedEvent);

      expect(getQuery).toHaveBeenCalledExactlyOnceWith(mockedEvent);
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

      expect($fetch).toHaveBeenCalledExactlyOnceWith(expectedEndpoint, { ...expectedFetchOptions, query: { "sort-by": "slug", "sort-order": "asc", "limit": 0 } });
    });

    it("should throw zod error when query params are invalid.", async() => {
      vi.mocked(getQuery).mockReturnValue({ "sort-by": "invalid-field" });

      await expect(getQuestionThemesHandler(mockedEvent)).rejects.toThrow(ZodError);
    });

    it("should return mapped question themes when called.", async() => {
      const fakeQuestionThemes = [
        createFakeQuestionThemeDto(),
        createFakeQuestionThemeDto(),
        createFakeQuestionThemeDto(),
      ];
      vi.mocked($fetch).mockResolvedValue(fakeQuestionThemes);
      const expectedQuestionThemes = fakeQuestionThemes.map(createQuestionThemeFromQuestionThemeDto);
      const result = await getQuestionThemesHandler(mockedEvent);

      expect(result).toStrictEqual(expectedQuestionThemes);
    });

    it("should call handleGoatItApiError when $fetch throws an error.", async() => {
      const fetchError = new Error("Network error");
      vi.mocked($fetch).mockRejectedValue(fetchError);

      try {
        await getQuestionThemesHandler(mockedEvent);
      } catch(error: unknown) {
        void error;
      }

      expect(handleGoatItApiError).toHaveBeenCalledExactlyOnceWith(fetchError);
    });

    it("should call handleGoatItApiError with zod error when the fetched data is invalid.", async() => {
      vi.mocked($fetch).mockResolvedValue([
        {
          id: "invalid-id",
          name: "Invalid Question Theme",
          description: "This question theme has an invalid ID.",
        },
      ]);

      try {
        await getQuestionThemesHandler(mockedEvent);
      } catch(error: unknown) {
        void error;
      }

      expect(handleGoatItApiError).toHaveBeenCalledExactlyOnceWith(expect.any(ZodError));
    });
  });
});