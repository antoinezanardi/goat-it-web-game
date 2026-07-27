import { describe, expect, it } from "vitest";
import { createFakeQuestionThemeDto } from "@goat-it/schemas/testing/question-theme";

import { createFakeQuestionTheme } from "~~/tests/unit/utils/faketories/question-theme/question-theme.entity.faketory";

import { createQuestionThemeFromQuestionThemeDto } from "#server/utils/goat-it-api/mappers/question-theme/question-theme.mappers";

describe("Goat It Api Mappers", () => {
  describe(createQuestionThemeFromQuestionThemeDto, () => {
    it("should create question theme from question theme dto with correct properties when called.", () => {
      const questionThemeDto = createFakeQuestionThemeDto();
      const expectedQuestionTheme = createFakeQuestionTheme({
        ...questionThemeDto,
        createdAt: new Date(questionThemeDto.createdAt),
        updatedAt: new Date(questionThemeDto.updatedAt),
      });
      const questionTheme = createQuestionThemeFromQuestionThemeDto(questionThemeDto);

      expect(questionTheme).toStrictEqual(expectedQuestionTheme);
    });
  });
});