import type { VueWrapper } from "@vue/test-utils";
import { mountSuspended } from "@nuxt/test-utils/runtime";
import { beforeEach, describe, expect, it } from "vitest";
import { nextTick } from "vue";

import type { MountSuspendedOptions } from "~~/tests/unit/utils/types/mount.types";
import { createFakeQuestion } from "~~/tests/unit/utils/faketories/question/question.entity.faketory";
import { getWrapperVm } from "~~/tests/unit/utils/helpers/vtu.helpers";

import { GameStateRenderer } from "#components";

import type { GameStateRendererProps } from "@/components/domain/game/GameStateRenderer/game-state-renderer.types";

describe("GameStateRenderer Component", () => {
  const fakeQuestion = createFakeQuestion();
  const fakeQuestions = [fakeQuestion];

  const defaultGameStateRendererProps: GameStateRendererProps = {
    areShortcutsDisabled: false,
    canGoToPreviousQuestion: false,
    currentIndex: 0,
    currentQuestion: undefined,
    gameState: "loading",
    isTranslating: false,
    questions: [],
  };

  let wrapper: VueWrapper;

  async function mountGameStateRenderer(options: MountSuspendedOptions<typeof GameStateRenderer> = {}): Promise<VueWrapper> {
    return mountSuspended(GameStateRenderer, {
      props: defaultGameStateRendererProps,
      shallow: false,
      ...options,
    });
  }

  async function setPlayingGameState(): Promise<void> {
    await wrapper.setProps({ currentQuestion: fakeQuestion, gameState: "playing", questions: fakeQuestions });
  }

  beforeEach(async() => {
    wrapper = await mountGameStateRenderer();
  });

  it("should render GameStateRenderer when mounted.", () => {
    expect(wrapper.exists()).toBeTruthy();
  });

  it("should render GameLoading when gameState is loading.", () => {
    expect(wrapper.findComponent({ name: "GameLoading" }).exists()).toBe(true);
  });

  it("should pass isTranslating as false to GameLoading when gameState is loading.", () => {
    expect(wrapper.findComponent({ name: "GameLoading" }).props("isTranslating")).toBe(false);
  });

  it("should render GameLoading when gameState is playing and isTranslating is true.", async() => {
    await wrapper.setProps({ currentQuestion: fakeQuestion, gameState: "playing", isTranslating: true, questions: fakeQuestions });

    expect(wrapper.findComponent({ name: "GameLoading" }).exists()).toBe(true);
  });

  it("should pass isTranslating as true to GameLoading when isTranslating is true.", async() => {
    await wrapper.setProps({ isTranslating: true });

    expect(wrapper.findComponent({ name: "GameLoading" }).props("isTranslating")).toBe(true);
  });

  it("should render GamePlaying when gameState is playing and a current question exists.", async() => {
    await setPlayingGameState();

    expect(wrapper.findComponent({ name: "GamePlaying" }).exists()).toBe(true);
  });

  it("should not render GamePlaying when gameState is playing and no current question exists.", async() => {
    await wrapper.setProps({ gameState: "playing", questions: [] });

    expect(wrapper.findComponent({ name: "GamePlaying" }).exists()).toBe(false);
  });

  it("should render GameNoMoreQuestions when gameState is playing and no current question exists.", async() => {
    await wrapper.setProps({ gameState: "playing", questions: [] });

    expect(wrapper.findComponent({ name: "GameNoMoreQuestions" }).exists()).toBe(true);
  });

  it("should forward currentQuestion to GamePlaying when a current question exists.", async() => {
    await setPlayingGameState();

    expect(wrapper.findComponent({ name: "GamePlaying" }).props("currentQuestion")).toStrictEqual(fakeQuestion);
  });

  it("should forward questions to GamePlaying when a current question exists.", async() => {
    await setPlayingGameState();

    expect(wrapper.findComponent({ name: "GamePlaying" }).props("questions")).toStrictEqual(fakeQuestions);
  });

  it("should forward currentIndex to GamePlaying when a current question exists.", async() => {
    await wrapper.setProps({ currentIndex: 1, currentQuestion: fakeQuestion, gameState: "playing", questions: fakeQuestions });

    expect(wrapper.findComponent({ name: "GamePlaying" }).props("currentIndex")).toBe(1);
  });

  it("should forward canGoToPreviousQuestion to GamePlaying when a previous question is available.", async() => {
    await wrapper.setProps({ canGoToPreviousQuestion: true, currentQuestion: fakeQuestion, gameState: "playing", questions: fakeQuestions });

    expect(wrapper.findComponent({ name: "GamePlaying" }).props("canGoToPreviousQuestion")).toBe(true);
  });

  it("should forward areShortcutsDisabled to GamePlaying when shortcuts are disabled.", async() => {
    await wrapper.setProps({ areShortcutsDisabled: true, currentQuestion: fakeQuestion, gameState: "playing", questions: fakeQuestions });

    expect(wrapper.findComponent({ name: "GamePlaying" }).props("areShortcutsDisabled")).toBe(true);
  });

  it("should emit advance when GamePlaying emits advance.", async() => {
    await setPlayingGameState();
    getWrapperVm(wrapper.findComponent({ name: "GamePlaying" })).$emit("advance");
    await nextTick();

    expect(wrapper.emitted("advance")).toStrictEqual([[]]);
  });

  it("should emit previous when GamePlaying emits previous.", async() => {
    await setPlayingGameState();
    getWrapperVm(wrapper.findComponent({ name: "GamePlaying" })).$emit("previous");
    await nextTick();

    expect(wrapper.emitted("previous")).toStrictEqual([[]]);
  });

  it("should render GameFetchError when gameState is error.", async() => {
    await wrapper.setProps({ gameState: "error" });

    expect(wrapper.findComponent({ name: "GameFetchError" }).exists()).toBe(true);
  });

  it("should emit retry when GameFetchError emits retry.", async() => {
    await wrapper.setProps({ gameState: "error" });
    getWrapperVm(wrapper.findComponent({ name: "GameFetchError" })).$emit("retry");
    await nextTick();

    expect(wrapper.emitted("retry")).toStrictEqual([[]]);
  });

  it("should render GameEmptyFilters when gameState is no-matching-filters-questions.", async() => {
    await wrapper.setProps({ gameState: "no-matching-filters-questions" });

    expect(wrapper.findComponent({ name: "GameEmptyFilters" }).exists()).toBe(true);
  });

  it("should emit resetFilters when GameEmptyFilters emits resetFilters.", async() => {
    await wrapper.setProps({ gameState: "no-matching-filters-questions" });
    getWrapperVm(wrapper.findComponent({ name: "GameEmptyFilters" })).$emit("resetFilters");
    await nextTick();

    expect(wrapper.emitted("resetFilters")).toStrictEqual([[]]);
  });

  it("should render GameNoMoreQuestions when gameState is game-over.", async() => {
    await wrapper.setProps({ gameState: "game-over" });

    expect(wrapper.findComponent({ name: "GameNoMoreQuestions" }).exists()).toBe(true);
  });
});