import { mockNuxtImport } from "@nuxt/test-utils/runtime";
import { createTestingPinia } from "@pinia/testing";
import { flushPromises } from "@vue/test-utils";
import { beforeEach, describe, expect, it } from "vitest";
import { nextTick } from "vue";

import { createUseGoatItApiErrorToastMock } from "~~/tests/unit/utils/mocks/composables/domain/useGoatItApiErrorToast/useGoatItApiErrorToast.mock";
import type { UseGoatItApiErrorToastMock } from "~~/tests/unit/utils/mocks/composables/domain/useGoatItApiErrorToast/useGoatItApiErrorToast.mock";
import { mockStore } from "~~/tests/unit/utils/mocks/stores/store.mock";
import { createFakeQuestion } from "~~/tests/unit/utils/faketories/question/question.entity.faketory";

import type { AsyncResult } from "#shared/types/async-result.types";
import type { useGameQuestionTranslation as UseGameQuestionTranslationType } from "@/composables/domain/useGameQuestionTranslation/useGameQuestionTranslation";
import type { Question } from "#shared/types/question.types";
import { useGameStore } from "@/stores/domain/game/game.store";

let useGoatItApiErrorToastMock: UseGoatItApiErrorToastMock;

mockNuxtImport("useGoatItApiErrorToast", () => (): UseGoatItApiErrorToastMock => useGoatItApiErrorToastMock);

let useGameQuestionTranslation: typeof UseGameQuestionTranslationType;

describe("useGameQuestionTranslation", () => {
  beforeEach(async() => {
    useGoatItApiErrorToastMock = createUseGoatItApiErrorToastMock();
    createTestingPinia();
    ({ useGameQuestionTranslation } = await import("@/composables/domain/useGameQuestionTranslation/useGameQuestionTranslation"));
  });

  describe("ID selection", () => {
    it("should select all loaded IDs when the array has 100 or fewer entries.", async() => {
      const store = mockStore(useGameStore);
      const fakeQuestions = Array.from({ length: 50 }, () => createFakeQuestion());
      const questions = ref<Question[]>(fakeQuestions);
      store.fetchQuestionsByIds.mockResolvedValue({ ok: true, value: [] });
      const { locale } = useI18n();
      useGameQuestionTranslation(questions, () => true);

      locale.value = "fr";
      await flushPromises();

      expect(store.fetchQuestionsByIds).toHaveBeenCalledExactlyOnceWith(fakeQuestions.map(question => question.id));
    });

    it("should select exactly the final 100 entries when the array is longer than 100.", async() => {
      const store = mockStore(useGameStore);
      const fakeQuestions = Array.from({ length: 150 }, () => createFakeQuestion());
      const questions = ref<Question[]>(fakeQuestions);
      store.fetchQuestionsByIds.mockResolvedValue({ ok: true, value: [] });
      const { locale } = useI18n();
      useGameQuestionTranslation(questions, () => true);

      locale.value = "fr";
      await flushPromises();

      const expectedIds = fakeQuestions.slice(-100).map(question => question.id);

      expect(store.fetchQuestionsByIds).toHaveBeenCalledExactlyOnceWith(expectedIds);
    });
  });

  describe("merge", () => {
    it("should restore returned records to original positions regardless of response order when locale changes.", async() => {
      const store = mockStore(useGameStore);
      const firstQuestion = createFakeQuestion();
      const secondQuestion = createFakeQuestion();
      const thirdQuestion = createFakeQuestion();
      const questions = ref<Question[]>([firstQuestion, secondQuestion, thirdQuestion]);
      const translatedFirst = createFakeQuestion({ id: firstQuestion.id });
      const translatedSecond = createFakeQuestion({ id: secondQuestion.id });
      const translatedThird = createFakeQuestion({ id: thirdQuestion.id });
      store.fetchQuestionsByIds.mockResolvedValue({ ok: true, value: [translatedThird, translatedFirst, translatedSecond] });
      const { locale } = useI18n();
      useGameQuestionTranslation(questions, () => true);

      locale.value = "fr";
      await flushPromises();

      expect(store.replaceQuestions).toHaveBeenCalledExactlyOnceWith([translatedFirst, translatedSecond, translatedThird]);
    });

    it("should retain missing IDs untouched when the response does not cover all selected IDs.", async() => {
      const store = mockStore(useGameStore);
      const firstQuestion = createFakeQuestion();
      const secondQuestion = createFakeQuestion();
      const thirdQuestion = createFakeQuestion();
      const questions = ref<Question[]>([firstQuestion, secondQuestion, thirdQuestion]);
      const translatedFirst = createFakeQuestion({ id: firstQuestion.id });
      store.fetchQuestionsByIds.mockResolvedValue({ ok: true, value: [translatedFirst] });
      const { locale } = useI18n();
      useGameQuestionTranslation(questions, () => true);

      locale.value = "fr";
      await flushPromises();

      expect(store.replaceQuestions).toHaveBeenCalledExactlyOnceWith([translatedFirst, secondQuestion, thirdQuestion]);
    });

    it("should ignore unexpected IDs in the response when the response contains IDs not in the selection.", async() => {
      const store = mockStore(useGameStore);
      const firstQuestion = createFakeQuestion();
      const secondQuestion = createFakeQuestion();
      const questions = ref<Question[]>([firstQuestion, secondQuestion]);
      const translatedFirst = createFakeQuestion({ id: firstQuestion.id });
      const unexpectedQuestion = createFakeQuestion();
      store.fetchQuestionsByIds.mockResolvedValue({ ok: true, value: [translatedFirst, unexpectedQuestion] });
      const { locale } = useI18n();
      useGameQuestionTranslation(questions, () => true);

      locale.value = "fr";
      await flushPromises();

      expect(store.replaceQuestions).toHaveBeenCalledExactlyOnceWith([translatedFirst, secondQuestion]);
    });

    it("should keep the first record when the response contains duplicate IDs for the same question.", async() => {
      const store = mockStore(useGameStore);
      const firstQuestion = createFakeQuestion();
      const questions = ref<Question[]>([firstQuestion]);
      const firstTranslated = createFakeQuestion({ id: firstQuestion.id });
      const secondTranslated = createFakeQuestion({ id: firstQuestion.id });
      store.fetchQuestionsByIds.mockResolvedValue({ ok: true, value: [firstTranslated, secondTranslated] });
      const { locale } = useI18n();
      useGameQuestionTranslation(questions, () => true);

      locale.value = "fr";
      await flushPromises();

      expect(store.replaceQuestions).toHaveBeenCalledExactlyOnceWith([firstTranslated]);
    });
  });

  describe("guard", () => {
    it("should not call fetchQuestionsByIds when canTranslateQuestions is false on locale change.", async() => {
      const store = mockStore(useGameStore);
      const questions = ref<Question[]>([createFakeQuestion()]);
      const { locale } = useI18n();
      useGameQuestionTranslation(questions, () => false);

      locale.value = "fr";
      await flushPromises();

      expect(store.fetchQuestionsByIds).not.toHaveBeenCalled();
    });

    it("should call fetchQuestionsByIds when canTranslateQuestions is true on locale change.", async() => {
      const store = mockStore(useGameStore);
      const questions = ref<Question[]>([createFakeQuestion()]);
      store.fetchQuestionsByIds.mockResolvedValue({ ok: true, value: [] });
      const { locale } = useI18n();
      useGameQuestionTranslation(questions, () => true);

      locale.value = "fr";
      await flushPromises();

      expect(store.fetchQuestionsByIds).toHaveBeenCalledOnce();
    });
  });

  describe("isTranslating", () => {
    it.each<{ isFetchingQuestionsByIds: boolean; expected: boolean }>([
      { isFetchingQuestionsByIds: false, expected: false },
      { isFetchingQuestionsByIds: true, expected: true },
    ])("should be $expected when store isFetchingQuestionsByIds is $isFetchingQuestionsByIds.", ({ isFetchingQuestionsByIds, expected }) => {
      const store = mockStore(useGameStore);
      store.isFetchingQuestionsByIds = isFetchingQuestionsByIds;
      const questions = ref<Question[]>([]);
      const { isTranslating } = useGameQuestionTranslation(questions, () => true);

      expect(isTranslating.value).toBe(expected);
    });
  });

  describe("failure path", () => {
    it("should show the API error toast when the by ids fetch fails.", async() => {
      const store = mockStore(useGameStore);
      const questions = ref<Question[]>([createFakeQuestion()]);
      const error = new Error("fetch failed");
      store.fetchQuestionsByIds.mockResolvedValue({ ok: false, error });
      const { locale } = useI18n();
      useGameQuestionTranslation(questions, () => true);

      locale.value = "fr";
      await flushPromises();

      expect(useGoatItApiErrorToastMock.handleGoatItApiError).toHaveBeenCalledExactlyOnceWith(error, { title: "questions.cantFetch", context: "questions-translation" });
    });

    it("should not replace the questions when the by ids fetch fails.", async() => {
      const store = mockStore(useGameStore);
      const questions = ref<Question[]>([createFakeQuestion()]);
      store.fetchQuestionsByIds.mockResolvedValue({ ok: false, error: new Error("fetch failed") });
      const { locale } = useI18n();
      useGameQuestionTranslation(questions, () => true);

      locale.value = "fr";
      await flushPromises();

      expect(store.replaceQuestions).not.toHaveBeenCalled();
    });

    it("should not show the API error toast when the by ids fetch is superseded.", async() => {
      const store = mockStore(useGameStore);
      const questions = ref<Question[]>([createFakeQuestion()]);
      store.fetchQuestionsByIds.mockResolvedValue({ ok: false, superseded: true });
      const { locale } = useI18n();
      useGameQuestionTranslation(questions, () => true);

      locale.value = "fr";
      await flushPromises();

      expect(useGoatItApiErrorToastMock.handleGoatItApiError).not.toHaveBeenCalled();
    });

    it("should not replace the questions when the by ids fetch is superseded.", async() => {
      const store = mockStore(useGameStore);
      const questions = ref<Question[]>([createFakeQuestion()]);
      store.fetchQuestionsByIds.mockResolvedValue({ ok: false, superseded: true });
      const { locale } = useI18n();
      useGameQuestionTranslation(questions, () => true);

      locale.value = "fr";
      await flushPromises();

      expect(store.replaceQuestions).not.toHaveBeenCalled();
    });
  });

  describe("concurrency", () => {
    it("should ignore a second locale change when a translation is already pending.", async() => {
      const store = mockStore(useGameStore);
      const firstQuestion = createFakeQuestion();
      const secondQuestion = createFakeQuestion();
      const fakeQuestions = [firstQuestion, secondQuestion];
      const questions = ref<Question[]>([...fakeQuestions]);
      let isTranslationInProgress = false;
      let resolvePendingTranslation: ((value: AsyncResult<Question[]>) => void) | undefined;
      store.fetchQuestionsByIds.mockImplementationOnce(async() => {
        isTranslationInProgress = true;

        return new Promise<AsyncResult<Question[]>>(resolve => {
          resolvePendingTranslation = resolve;
        });
      });
      store.fetchQuestionsByIds.mockResolvedValue({ ok: true, value: [] });
      const { locale } = useI18n();
      useGameQuestionTranslation(questions, () => !isTranslationInProgress);

      locale.value = "fr";
      await nextTick();
      locale.value = "de";
      await nextTick();
      resolvePendingTranslation?.({ ok: true, value: [createFakeQuestion({ id: firstQuestion.id }), createFakeQuestion({ id: secondQuestion.id })] });
      await flushPromises();

      expect(store.fetchQuestionsByIds).toHaveBeenCalledExactlyOnceWith(fakeQuestions.map(question => question.id));
    });
  });
});