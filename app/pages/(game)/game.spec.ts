import type { VueWrapper } from "@vue/test-utils";
import { mockNuxtImport, mountSuspended } from "@nuxt/test-utils/runtime";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { computed, nextTick, ref } from "vue";
import type { Ref } from "vue";
import type { Mock } from "vitest";

import type { MountSuspendedOptions } from "~~/tests/unit/utils/types/mount.types";
import { createFakeQuestion } from "~~/tests/unit/utils/faketories/question/question.entity.faketory";
import { getWrapperVm } from "~~/tests/unit/utils/helpers/vtu.helpers";

import type { UseGame } from "~/composables/domain/useGame/useGame";
import type { Question } from "#shared/types/question.types";
import GamePage from "@/pages/(game)/game.vue";

let currentQuestion: Ref<Question | undefined>;
let advanceToNextQuestion: Mock<() => void>;
let isInitialLoading: Ref<boolean>;
let isOutOfQuestionsLoading: Ref<boolean>;
let isGameOver: Ref<boolean>;

mockNuxtImport(
  "useGame",
  () => (): UseGame => ({
    currentQuestion: computed(() => currentQuestion.value),
    advanceToNextQuestion,
    initialize: vi.fn<() => Promise<void>>(),
    isInitialLoading: computed(() => isInitialLoading.value),
    isOutOfQuestionsLoading: computed(() => isOutOfQuestionsLoading.value),
    isGameOver: computed(() => isGameOver.value),
  }),
);

describe("Game Page", () => {
  let wrapper: VueWrapper;

  async function mountGamePage(options: MountSuspendedOptions<typeof GamePage> = {}): Promise<VueWrapper> {
    return mountSuspended(GamePage, { shallow: true, ...options });
  }

  beforeEach(async() => {
    currentQuestion = ref<Question | undefined>(undefined);
    advanceToNextQuestion = vi.fn<() => void>();
    isInitialLoading = ref(false);
    isOutOfQuestionsLoading = ref(false);
    isGameOver = ref(false);
    wrapper = await mountGamePage();
  });

  it("should call useHead with a function that returns the page title translation key when mounted.", () => {
    const useHeadFunction = vi.mocked(useHead).mock.calls[0]?.[0] as (() => { title?: string }) | undefined;
    const headResult = useHeadFunction?.();

    expect(headResult?.title).toBe("game.pageTitle");
  });

  it("should show loading text when initial loading.", async() => {
    isInitialLoading.value = true;
    await nextTick();

    expect(wrapper.text()).toContain("game.loadingQuestions");
  });

  it("should render GameQuestionCard with the current question when questions are available.", async() => {
    const fakeQuestion = createFakeQuestion();
    currentQuestion.value = fakeQuestion;
    await nextTick();

    const gameQuestionCard = wrapper.findComponent({ name: "GameQuestionCard" });

    expect(gameQuestionCard.props("question")).toStrictEqual(fakeQuestion);
  });

  it("should render GameNextButton with disabled bound to true when no current question.", async() => {
    currentQuestion.value = undefined;
    await nextTick();

    const nextButton = wrapper.findComponent({ name: "GameNextButton" });

    expect(nextButton.props("disabled")).toBe(true);
  });

  it("should render GameNextButton with disabled bound to false when current question exists.", async() => {
    currentQuestion.value = createFakeQuestion();
    await nextTick();

    const nextButton = wrapper.findComponent({ name: "GameNextButton" });

    expect(nextButton.props("disabled")).toBe(false);
  });

  it("should call advanceToNextQuestion when GameNextButton emits click.", async() => {
    currentQuestion.value = createFakeQuestion();
    await nextTick();

    const nextButton = wrapper.findComponent({ name: "GameNextButton" });
    getWrapperVm(nextButton).$emit("click");

    expect(advanceToNextQuestion).toHaveBeenCalledExactlyOnceWith();
  });

  it("should show loading text when out of questions and fetch is pending.", async() => {
    currentQuestion.value = createFakeQuestion();
    await nextTick();

    currentQuestion.value = undefined;
    isOutOfQuestionsLoading.value = true;
    await nextTick();

    expect(wrapper.text()).toContain("game.loadingQuestions");
  });

  it("should hide GameNextButton when out of questions loading.", async() => {
    currentQuestion.value = undefined;
    isOutOfQuestionsLoading.value = true;
    await nextTick();

    const nextButton = wrapper.findComponent({ name: "GameNextButton" });

    expect(nextButton.exists()).toBeFalsy();
  });

  it("should render GameNoMoreQuestions when isGameOver is true.", async() => {
    isGameOver.value = true;
    await nextTick();

    const noMoreQuestions = wrapper.findComponent({ name: "GameNoMoreQuestions" });

    expect(noMoreQuestions.exists()).toBeTruthy();
  });

  it("should hide GameNextButton when isGameOver is true.", async() => {
    isGameOver.value = true;
    await nextTick();

    const nextButton = wrapper.findComponent({ name: "GameNextButton" });

    expect(nextButton.exists()).toBeFalsy();
  });

  it("should render GameNoMoreQuestions when game is over on empty DB.", async() => {
    isGameOver.value = true;
    isInitialLoading.value = false;
    await nextTick();

    const noMoreQuestions = wrapper.findComponent({ name: "GameNoMoreQuestions" });

    expect(noMoreQuestions.exists()).toBeTruthy();
  });

  it("should not render loading text when game is over on empty DB.", async() => {
    isGameOver.value = true;
    isInitialLoading.value = false;
    await nextTick();

    const loadingText = wrapper.find("[data-testid='game-loading']");

    expect(loadingText.exists()).toBeFalsy();
  });
});