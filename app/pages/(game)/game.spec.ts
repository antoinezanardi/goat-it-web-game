import type { VueWrapper } from "@vue/test-utils";
import { mountSuspended } from "@nuxt/test-utils/runtime";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { nextTick } from "vue";

import type { MountSuspendedOptions } from "~~/tests/unit/utils/types/mount.types";
import { createFakeQuestion } from "~~/tests/unit/utils/faketories/question/question.entity.faketory";
import { useGameMock } from "~~/tests/unit/setup/nuxt/composables/use-game.nuxt.unit-setup";

import GamePage from "@/pages/(game)/game.vue";

describe("Game Page", () => {
  let wrapper: VueWrapper;

  async function mountGamePage(options: MountSuspendedOptions<typeof GamePage> = {}): Promise<VueWrapper> {
    return mountSuspended(GamePage, { shallow: true, ...options });
  }

  beforeEach(async() => {
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

  it("should render GameLoading when gameState is loading.", () => {
    const gameLoading = wrapper.findComponent({ name: "GameLoading" });

    expect(gameLoading.exists()).toBeTruthy();
  });

  it("should render GamePlaying when gameState is playing and a current question exists.", async() => {
    const fakeQuestion = createFakeQuestion();
    useGameMock.instance.questionsRef.value = [fakeQuestion];
    useGameMock.instance.gameStateRef.value = "playing";
    await nextTick();

    const gamePlaying = wrapper.findComponent({ name: "GamePlaying" });

    expect(gamePlaying.exists()).toBeTruthy();
  });

  it("should render GameNoMoreQuestions when gameState is game-over.", async() => {
    useGameMock.instance.gameStateRef.value = "game-over";
    await nextTick();

    const noMoreQuestions = wrapper.findComponent({ name: "GameNoMoreQuestions" });

    expect(noMoreQuestions.exists()).toBeTruthy();
  });
});