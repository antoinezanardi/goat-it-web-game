import { describe, expect, it } from "vitest";
import { createFakeQuestionDto } from "@goat-it/schemas/testing/question";

import { createFakeQuestion } from "~~/tests/unit/utils/faketories/question/question.entity.faketory";
import { createFakeQuestionTheme } from "~~/tests/unit/utils/faketories/question-theme/question-theme.entity.faketory";

import { createQuestionFromQuestionDto } from "#server/utils/goat-it-api/mappers/question/question.mappers";

describe(createQuestionFromQuestionDto, () => {
  it("should create question from question dto with correct properties when called.", () => {
    const dto = createFakeQuestionDto();
    const result = createQuestionFromQuestionDto(dto);
    const expected = createFakeQuestion({
      id: dto.id,
      category: dto.category,
      themes: dto.themes.map(themeAssignment => ({
        theme: createFakeQuestionTheme({
          ...themeAssignment.theme,
          createdAt: new Date(themeAssignment.theme.createdAt),
          updatedAt: new Date(themeAssignment.theme.updatedAt),
        }),
        isPrimary: themeAssignment.isPrimary,
        isHint: themeAssignment.isHint,
      })),
      content: dto.content,
      cognitiveDifficulty: dto.cognitiveDifficulty,
      author: dto.author,
      status: dto.status,
      rejection: dto.rejection,
      sourceUrls: dto.sourceUrls,
      createdAt: new Date(dto.createdAt),
      updatedAt: new Date(dto.updatedAt),
    });

    expect(result).toStrictEqual(expected);
  });
});