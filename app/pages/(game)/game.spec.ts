import type { FindRandomQuestionsQueryDto } from "@goat-it/schemas/question";
import type { VueWrapper } from "@vue/test-utils";
import { mockNuxtImport, mountSuspended } from "@nuxt/test-utils/runtime";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { nextTick, ref } from "vue";
import type { Ref } from "vue";
import type { Mock } from "vitest";

import type { MountSuspendedOptions } from "~~/tests/unit/utils/types/mount.types";
import { createFakeQuestion } from "~~/tests/unit/utils/faketories/question/question.entity.faketory";

import { GAME_DEFAULT_FETCH_RANDOM_QUESTIONS_QUERY } from "~/pages/(game)/game.constants";
import type { Question } from "#shared/types/question.types";
import GamePage from "@/pages/(game)/game.vue";

let questions: Ref<Question[]>;
let isPending: Ref<boolean>;
let fetchAndAppendRandomQuestions: Mock<(query?: FindRandomQuestionsQueryDto) => Promise<void>>;

mockNuxtImport(
  "useQuestionsStore",
  () => (): { questions: Ref<Question[]>; isPending: Ref<boolean>; fetchAndAppendRandomQuestions: Mock<(query?: FindRandomQuestionsQueryDto) => Promise<void>> } => ({
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

  it("should call useHead with a function that returns the page title translation key when mounted.", () => {
    const useHeadFunction = vi.mocked(useHead).mock.calls[0]?.[0] as (() => { title?: string }) | undefined;
    const headResult = useHeadFunction?.();

    expect(headResult?.title).toBe("game.pageTitle");
  });

  it("should call callOnce with a function that triggers the initial fetch when invoked.", () => {
    const initialFetchFunction = vi.mocked(callOnce).mock.calls[0]?.[0] as () => void;

    initialFetchFunction();

    expect(fetchAndAppendRandomQuestions).toHaveBeenCalledExactlyOnceWith(GAME_DEFAULT_FETCH_RANDOM_QUESTIONS_QUERY);
  });

  it("should show loading text when the questions array is empty and fetch is pending.", async() => {
    questions.value = [];
    isPending.value = true;
    await nextTick();

    expect(wrapper.text()).toContain("game.loadingQuestions");
  });

  it("should render GameQuestionCard with the current question when questions are available.", async() => {
    const fakeQuestions = [createFakeQuestion()];
    questions.value = fakeQuestions;
    await nextTick();

    const gameQuestionCard = wrapper.findComponent({ name: "GameQuestionCard" });

    expect(gameQuestionCard.props("question")).toStrictEqual(fakeQuestions[0]);
  });

  it("should render GameNextButton with disabled bound to true when no current question.", async() => {
    questions.value = [];
    await nextTick();

    const nextButton = wrapper.findComponent({ name: "GameNextButton" });

    expect(nextButton.props("disabled")).toBe(true);
  });

  it("should render GameNextButton with disabled bound to false when current question exists.", async() => {
    questions.value = [createFakeQuestion()];
    await nextTick();

    const nextButton = wrapper.findComponent({ name: "GameNextButton" });

    expect(nextButton.props("disabled")).toBe(false);
  });

  it("should advance currentIndex and pass the next question to GameQuestionCard when GameNextButton emits click.", async() => {
    const fakeQuestions = [createFakeQuestion(), createFakeQuestion()];
    questions.value = fakeQuestions;
    await nextTick();

    const nextButton = wrapper.findComponent({ name: "GameNextButton" });
    // Acceptable as shallow stub vm.$emit is typed any; this is an expected test pattern
    // oxlint-disable-next-line typescript/no-unsafe-call, typescript/no-unsafe-member-access
    nextButton.vm.$emit("click");
    await nextTick();

    const gameQuestionCard = wrapper.findComponent({ name: "GameQuestionCard" });

    expect(gameQuestionCard.props("question")).toStrictEqual(fakeQuestions[1]);
  });

  it("should trigger fetchAndAppendRandomQuestions when currentIndex reaches the 80% threshold.", async() => {
    questions.value = Array.from({ length: 25 }, () => createFakeQuestion());
    await nextTick();

    const nextButton = wrapper.findComponent({ name: "GameNextButton" });
    for (let index = 0; index < 20; index++) {
      // Acceptable as each click must be sequential to let Vue process the reactive update
      // oxlint-disable-next-line eslint/no-await-in-loop, typescript/no-unsafe-call, typescript/no-unsafe-member-access
      nextButton.vm.$emit("click");
      // Acceptable as each emit must flush to let Vue process the reactive update
      // oxlint-disable-next-line eslint/no-await-in-loop
      await nextTick();
    }

    expect(fetchAndAppendRandomQuestions).toHaveBeenCalledExactlyOnceWith(GAME_DEFAULT_FETCH_RANDOM_QUESTIONS_QUERY);
  });

  it("should not trigger prefetch when a fetch is already in progress.", async() => {
    questions.value = Array.from({ length: 25 }, () => createFakeQuestion());
    isPending.value = true;
    await nextTick();

    const nextButton = wrapper.findComponent({ name: "GameNextButton" });
    for (let index = 0; index < 20; index++) {
      // Acceptable as each click must be sequential to let Vue process the reactive update
      // oxlint-disable-next-line eslint/no-await-in-loop, typescript/no-unsafe-call, typescript/no-unsafe-member-access
      nextButton.vm.$emit("click");
      // Acceptable as each emit must flush to let Vue process the reactive update
      // oxlint-disable-next-line eslint/no-await-in-loop
      await nextTick();
    }

    expect(fetchAndAppendRandomQuestions).not.toHaveBeenCalled();
  });

  it("should show loading text when currentIndex exceeds questions.length and fetch is pending.", async() => {
    questions.value = [createFakeQuestion()];
    await nextTick();

    const nextButton = wrapper.findComponent({ name: "GameNextButton" });
    // Acceptable as shallow stub vm.$emit is typed any; this is an expected test pattern
    // oxlint-disable-next-line typescript/no-unsafe-call, typescript/no-unsafe-member-access
    nextButton.vm.$emit("click");
    await nextTick();
    isPending.value = true;
    await nextTick();

    expect(wrapper.text()).toContain("game.loadingQuestions");
  });

  it("should allow another prefetch when isPending transitions to false.", async() => {
    questions.value = Array.from({ length: 25 }, () => createFakeQuestion());
    await nextTick();

    const nextButton = wrapper.findComponent({ name: "GameNextButton" });
    for (let index = 0; index < 20; index++) {
      // Acceptable as each click must be sequential to let Vue process the reactive update
      // oxlint-disable-next-line eslint/no-await-in-loop, typescript/no-unsafe-call, typescript/no-unsafe-member-access
      nextButton.vm.$emit("click");
      // Acceptable as each emit must flush to let Vue process the reactive update
      // oxlint-disable-next-line eslint/no-await-in-loop
      await nextTick();
    }

    isPending.value = true;
    await nextTick();
    isPending.value = false;
    await nextTick();

    fetchAndAppendRandomQuestions.mockClear();
    // Acceptable as shallow stub vm.$emit is typed any; this is an expected test pattern
    // oxlint-disable-next-line typescript/no-unsafe-call, typescript/no-unsafe-member-access
    nextButton.vm.$emit("click");
    await nextTick();

    expect(fetchAndAppendRandomQuestions).toHaveBeenCalledExactlyOnceWith(GAME_DEFAULT_FETCH_RANDOM_QUESTIONS_QUERY);
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

    const nextButton = wrapper.findComponent({ name: "GameNextButton" });
    // Acceptable as shallow stub vm.$emit is typed any; this is an expected test pattern
    // oxlint-disable-next-line typescript/no-unsafe-call, typescript/no-unsafe-member-access
    nextButton.vm.$emit("click");
    await nextTick();

    try {
      await rejectionPromise;
    } catch(error: unknown) {
      void error;
    }

    const gameQuestionCard = wrapper.findComponent({ name: "GameQuestionCard" });

    expect(gameQuestionCard.props("question")).toStrictEqual(fakeQuestions[1]);
  });
});