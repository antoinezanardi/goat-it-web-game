import type { VueWrapper } from "@vue/test-utils";
import { mockNuxtImport, mountSuspended } from "@nuxt/test-utils/runtime";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { nextTick, ref } from "vue";
import type { Ref } from "vue";
import type { Mock } from "vitest";

import type { MountSuspendedOptions } from "~~/tests/unit/utils/types/mount.types";
import { createFakeQuestion } from "~~/tests/unit/utils/faketories/question/question.entity.faketory";

import type { Question } from "#shared/types/question.types";
import GamePage from "@/pages/game.vue";

const DEFAULT_FETCH_QUERY = {
  "sort-by": "createdAt",
  "sort-order": "desc",
  "limit": 25,
} as const;

type FetchQuery = { "sort-by": string; "sort-order": string; "limit": number };

let questions: Ref<Question[]>;
let isPending: Ref<boolean>;
let fetchAndAppendRandomQuestions: Mock<(query?: FetchQuery) => Promise<void>>;

mockNuxtImport(
  "useQuestionsStore",
  () => (): { questions: Ref<Question[]>; isPending: Ref<boolean>; fetchAndAppendRandomQuestions: Mock<(query?: FetchQuery) => Promise<void>> } => ({
    questions,
    isPending,
    fetchAndAppendRandomQuestions,
  }),
);

describe("Game Page", () => {
  let wrapper: VueWrapper;

  async function mountGamePage(options: MountSuspendedOptions<typeof GamePage> = {}): Promise<VueWrapper> {
    return mountSuspended(GamePage, { shallow: true, ...options });
  }

  beforeEach(async() => {
    questions = ref([]);
    isPending = ref(false);
    fetchAndAppendRandomQuestions = vi.fn<(...arguments_: unknown[]) => Promise<void>>();
    wrapper = await mountGamePage();
  });

  it("should call callOnce with a function that triggers the initial fetch when invoked.", () => {
    const initialFetchFunction = vi.mocked(callOnce).mock.calls[0]?.[0] as () => void;

    initialFetchFunction();

    expect(fetchAndAppendRandomQuestions).toHaveBeenCalledExactlyOnceWith(DEFAULT_FETCH_QUERY);
  });

  it("should show loading text when questions array is empty and fetch is pending.", async() => {
    questions.value = [];
    isPending.value = true;
    await nextTick();

    expect(wrapper.text()).toContain("game.loadingQuestions");
  });

  it("should display the current question statement when fetch succeeds.", async() => {
    const fakeQuestions = [createFakeQuestion()];
    questions.value = fakeQuestions;
    await nextTick();

    // Acceptable as the array was just created with one element so index 0 is always defined
    // oxlint-disable-next-line typescript/no-non-null-assertion
    expect(wrapper.find("[data-testid='game-question-statement']").text()).toBe(fakeQuestions[0]!.content.statement);
  });

  it("should display the current question answer when fetch succeeds.", async() => {
    const fakeQuestions = [createFakeQuestion()];
    questions.value = fakeQuestions;
    await nextTick();

    // Acceptable as the array was just created with one element so index 0 is always defined
    // oxlint-disable-next-line typescript/no-non-null-assertion
    expect(wrapper.find("[data-testid='game-question-answer']").text()).toBe(fakeQuestions[0]!.content.answer);
  });

  it("should render the next question translation key on the button when questions are available.", async() => {
    questions.value = [createFakeQuestion()];
    await nextTick();

    expect(wrapper.find("[data-testid='game-next-button']").text()).toContain("game.nextQuestion");
  });

  it("should advance currentIndex and display the next question when the next button is clicked.", async() => {
    const fakeQuestions = [createFakeQuestion(), createFakeQuestion()];
    questions.value = fakeQuestions;
    await nextTick();

    await wrapper.find("[data-testid='game-next-button']").trigger("click");

    // Acceptable as the array was just created with two elements so index 1 is always defined
    // oxlint-disable-next-line typescript/no-non-null-assertion
    expect(wrapper.find("[data-testid='game-question-statement']").text()).toBe(fakeQuestions[1]!.content.statement);
  });

  it("should trigger fetchAndAppendRandomQuestions when currentIndex reaches the 80% threshold.", async() => {
    questions.value = Array.from({ length: 25 }, () => createFakeQuestion());
    await nextTick();

    const button = wrapper.find("[data-testid='game-next-button']");
    // Acceptable as each click must be sequential to let Vue process the reactive update
    for (let index = 0; index < 20; index++) {
      // oxlint-disable-next-line eslint/no-await-in-loop
      await button.trigger("click");
    }

    expect(fetchAndAppendRandomQuestions).toHaveBeenCalledExactlyOnceWith(DEFAULT_FETCH_QUERY);
  });

  it("should not trigger prefetch when a fetch is already in progress.", async() => {
    questions.value = Array.from({ length: 25 }, () => createFakeQuestion());
    isPending.value = true;
    await nextTick();

    const button = wrapper.find("[data-testid='game-next-button']");
    // Acceptable as each click must be sequential to let Vue process the reactive update
    for (let index = 0; index < 20; index++) {
      // oxlint-disable-next-line eslint/no-await-in-loop
      await button.trigger("click");
    }

    expect(fetchAndAppendRandomQuestions).not.toHaveBeenCalled();
  });

  it("should show loading text when currentIndex exceeds questions.length and fetch is pending.", async() => {
    questions.value = [createFakeQuestion()];
    await nextTick();

    await wrapper.find("[data-testid='game-next-button']").trigger("click");
    isPending.value = true;
    await nextTick();

    expect(wrapper.text()).toContain("game.loadingQuestions");
  });

  it("should allow another prefetch when isPending transitions to false.", async() => {
    questions.value = Array.from({ length: 25 }, () => createFakeQuestion());
    await nextTick();

    const button = wrapper.find("[data-testid='game-next-button']");
    // Acceptable as each click must be sequential to let Vue process the reactive update
    for (let index = 0; index < 20; index++) {
      // oxlint-disable-next-line eslint/no-await-in-loop
      await button.trigger("click");
    }

    isPending.value = true;
    await nextTick();
    isPending.value = false;
    await nextTick();

    fetchAndAppendRandomQuestions.mockClear();
    await button.trigger("click");

    expect(fetchAndAppendRandomQuestions).toHaveBeenCalledExactlyOnceWith(DEFAULT_FETCH_QUERY);
  });

  it("should keep rendering the current question when fetchAndAppendRandomQuestions rejects.", async() => {
    const fakeQuestions = [createFakeQuestion(), createFakeQuestion()];
    questions.value = fakeQuestions;
    let rejectionPromise: Promise<void> | undefined;
    fetchAndAppendRandomQuestions.mockImplementationOnce(async() => {
      rejectionPromise = Promise.reject(new Error("API error"));

      return rejectionPromise;
    });
    await nextTick();

    await wrapper.find("[data-testid='game-next-button']").trigger("click");

    try {
      await rejectionPromise;
    } catch(error: unknown) {
      void error;
    }

    // Acceptable as the array was just created with two elements so index 1 is always defined
    // oxlint-disable-next-line typescript/no-non-null-assertion
    expect(wrapper.find("[data-testid='game-question-statement']").text()).toBe(fakeQuestions[1]!.content.statement);
  });
});