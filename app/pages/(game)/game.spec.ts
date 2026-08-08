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

let canGoToPreviousQuestion: Ref<boolean>;
let currentQuestion: Ref<Question | undefined>;
let advanceToNextQuestion: Mock<() => void>;
let goToPreviousQuestion: Mock<() => void>;
let gameState: Ref<"loading" | "playing" | "game-over">;

mockNuxtImport(
  "useGame",
  () => (): UseGame => ({
    canGoToPreviousQuestion: computed(() => canGoToPreviousQuestion.value),
    currentQuestion: computed(() => currentQuestion.value),
    advanceToNextQuestion,
    goToPreviousQuestion,
    initialize: vi.fn<() => Promise<void>>(),
    gameState: computed(() => gameState.value),
  }),
);

describe("Game Page", () => {
  let wrapper: VueWrapper;

  async function mountGamePage(options: MountSuspendedOptions<typeof GamePage> = {}): Promise<VueWrapper> {
    return mountSuspended(GamePage, { shallow: true, ...options });
  }

  beforeEach(async() => {
    canGoToPreviousQuestion = ref<boolean>(false);
    currentQuestion = ref<Question | undefined>(undefined);
    advanceToNextQuestion = vi.fn<() => void>();
    goToPreviousQuestion = vi.fn<() => void>();
    gameState = ref<"loading" | "playing" | "game-over">("loading");
    wrapper = await mountGamePage();
  });

  it("should configure SEO meta tags when mounted.", () => {
    const useHeadMock = vi.mocked(useHead);

    const headInput = useHeadMock.mock.calls[0]?.[0] as
      | { title: () => string; meta: { name?: string; property?: string; content: () => string }[] } |
      undefined;

    expect({
      title: headInput?.title(),
      meta: headInput?.meta.map(entry => (Object.assign(entry, { content: entry.content() }))),
    }).toStrictEqual({
      title: "seo.game.title",
      meta: [
        { name: "description", content: "seo.game.description" },
        { property: "og:title", content: "seo.game.title" },
        { property: "og:description", content: "seo.game.description" },
      ],
    });
  });

  it("should render GameLoading when gameState is 'loading'.", async() => {
    gameState.value = "loading";
    await nextTick();

    const gameLoading = wrapper.findComponent({ name: "GameLoading" });

    expect(gameLoading.exists()).toBeTruthy();
  });

  it("should render GamePlaying with the current question when gameState is 'playing'.", async() => {
    const fakeQuestion = createFakeQuestion();
    currentQuestion.value = fakeQuestion;
    gameState.value = "playing";
    await nextTick();

    const gamePlaying = wrapper.findComponent({ name: "GamePlaying" });

    expect(gamePlaying.props("question")).toStrictEqual(fakeQuestion);
  });

  it("should pass canGoToPreviousQuestion as false to GamePlaying when the composable reports it as false.", async() => {
    currentQuestion.value = createFakeQuestion();
    gameState.value = "playing";
    await nextTick();

    const gamePlaying = wrapper.findComponent({ name: "GamePlaying" });

    expect(gamePlaying.props("canGoToPreviousQuestion")).toBe(false);
  });

  it("should pass canGoToPreviousQuestion as true to GamePlaying when the composable reports it as true.", async() => {
    currentQuestion.value = createFakeQuestion();
    canGoToPreviousQuestion.value = true;
    gameState.value = "playing";
    await nextTick();

    const gamePlaying = wrapper.findComponent({ name: "GamePlaying" });

    expect(gamePlaying.props("canGoToPreviousQuestion")).toBe(true);
  });

  it("should render GameNoMoreQuestions when gameState is 'game-over'.", async() => {
    gameState.value = "game-over";
    await nextTick();

    const noMoreQuestions = wrapper.findComponent({ name: "GameNoMoreQuestions" });

    expect(noMoreQuestions.exists()).toBeTruthy();
  });

  it("should call advanceToNextQuestion when GamePlaying emits next.", async() => {
    currentQuestion.value = createFakeQuestion();
    gameState.value = "playing";
    await nextTick();

    const gamePlaying = wrapper.findComponent({ name: "GamePlaying" });
    getWrapperVm(gamePlaying).$emit("next");

    expect(advanceToNextQuestion).toHaveBeenCalledExactlyOnceWith();
  });

  it("should call goToPreviousQuestion when GamePlaying emits previous.", async() => {
    currentQuestion.value = createFakeQuestion();
    gameState.value = "playing";
    await nextTick();

    const gamePlaying = wrapper.findComponent({ name: "GamePlaying" });
    getWrapperVm(gamePlaying).$emit("previous");

    expect(goToPreviousQuestion).toHaveBeenCalledExactlyOnceWith();
  });
});