import { beforeEach, describe, expect, it } from "vitest";

import type { useGameSettingsModal as UseGameSettingsModalType } from "@/composables/domain/useGameSettingsModal/useGameSettingsModal";

let useGameSettingsModal: typeof UseGameSettingsModalType;

describe("useGameSettingsModal", () => {
  beforeEach(async() => {
    ({ useGameSettingsModal } = await import("@/composables/domain/useGameSettingsModal/useGameSettingsModal"));
  });

  it("should expose the settings modal as closed when created.", () => {
    const { isSettingsModalOpen } = useGameSettingsModal();

    expect(isSettingsModalOpen.value).toBe(false);
  });

  it("should open the settings modal when openSettingsModal is called.", async() => {
    const { isSettingsModalOpen, openSettingsModal } = useGameSettingsModal();

    await openSettingsModal();

    expect(isSettingsModalOpen.value).toBe(true);
  });

  it.each<{ isOpen: boolean }>([
    { isOpen: true },
    { isOpen: false },
  ])("should set the settings modal open state to $isOpen when setSettingsModalOpen is called.", ({ isOpen }) => {
    const { isSettingsModalOpen, setSettingsModalOpen } = useGameSettingsModal();

    setSettingsModalOpen(isOpen);

    expect(isSettingsModalOpen.value).toBe(isOpen);
  });
});