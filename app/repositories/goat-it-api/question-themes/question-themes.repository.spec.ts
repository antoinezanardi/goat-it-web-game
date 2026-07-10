import { vi, describe, it, expect, beforeEach } from "vitest";
import type { $Fetch } from "nitropack";

import { createFakeFindQuestionThemesQueryDto } from "~~/tests/unit/utils/faketories/question-theme/find-question-themes-query.dto.faketory";
import { createFakeQuestionTheme } from "~~/tests/unit/utils/faketories/question-theme/question-theme.entity.faketory";

import { questionThemesRepository } from "@/repositories/goat-it-api/question-themes/question-themes.repository";

describe(questionThemesRepository, () => {
  let fetchMock: ReturnType<typeof vi.fn<$Fetch>>;

  beforeEach(() => {
    fetchMock = vi.fn<$Fetch>();
  });

  it("should return the repository object when called.", () => {
    const repository = questionThemesRepository(fetchMock as $Fetch);

    expect(repository).toStrictEqual({
      getAll: expect.any(Function) as () => Promise<QuestionTheme[]>,
    });
  });

  describe("getAll", () => {
    it("should call fetch with the correct endpoint and undefined query when called without params.", async() => {
      const repository = questionThemesRepository(fetchMock as $Fetch);
      fetchMock.mockResolvedValue([]);

      await repository.getAll();

      expect(fetchMock).toHaveBeenCalledExactlyOnceWith("/api/goat-it-api/question-themes", { query: undefined });
    });

    it("should call fetch with the correct endpoint and query when called with query params.", async() => {
      const repository = questionThemesRepository(fetchMock as $Fetch);
      fetchMock.mockResolvedValue([]);
      const query = createFakeFindQuestionThemesQueryDto({
        "sort-by": "slug",
        "sort-order": "asc",
        "limit": 10,
      });

      await repository.getAll(query);

      expect(fetchMock).toHaveBeenCalledExactlyOnceWith("/api/goat-it-api/question-themes", { query });
    });

    it("should return question themes from fetch when called.", async() => {
      const fakeQuestionThemes: QuestionTheme[] = [
        createFakeQuestionTheme(),
        createFakeQuestionTheme(),
      ];
      const repository = questionThemesRepository(fetchMock as $Fetch);
      fetchMock.mockResolvedValue(fakeQuestionThemes);

      const result = await repository.getAll();

      expect(result).toStrictEqual(fakeQuestionThemes);
    });
  });
});