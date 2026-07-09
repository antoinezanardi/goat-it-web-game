import { describe, expect, it } from "vitest";

import { createFakeQuestionThemeDto } from "~~/tests/unit/utils/faketories/question-theme.dto.faketory";
import { createFakeQuestionTheme } from "~~/tests/unit/utils/faketories/question-theme.entity.faketory";

import { createQuestionThemeFromQuestionThemeDto } from "#server/utils/goat-it-api/mappers/goat-it-api.mappers";

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