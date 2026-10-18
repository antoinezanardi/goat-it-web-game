import { beforeEach, describe, expect, it } from "vitest";

import type { useGameSidebar as UseGameSidebarType } from "@/composables/domain/useGameSidebar/useGameSidebar";

let useGameSidebar: typeof UseGameSidebarType;

describe("useGameSidebar", () => {
  beforeEach(async() => {
    ({ useGameSidebar } = await import("@/composables/domain/useGameSidebar/useGameSidebar"));
  });

  it("should expose the sidebar as closed when created.", () => {
    const { isSidebarOpen } = useGameSidebar();

    expect(isSidebarOpen.value).toBe(false);
  });

  it("should open the sidebar when openSidebar is called.", () => {
    const { isSidebarOpen, openSidebar } = useGameSidebar();

    openSidebar();

    expect(isSidebarOpen.value).toBe(true);
  });

  it("should close the sidebar when closeSidebar is called after it was opened.", () => {
    const { closeSidebar, isSidebarOpen, openSidebar } = useGameSidebar();
    openSidebar();

    closeSidebar();

    expect(isSidebarOpen.value).toBe(false);
  });

  it.each<{ isOpen: boolean }>([
    { isOpen: true },
    { isOpen: false },
  ])("should set the sidebar open state to $isOpen when setSidebarOpen is called.", ({ isOpen }) => {
    const { isSidebarOpen, openSidebar, setSidebarOpen } = useGameSidebar();
    openSidebar();

    setSidebarOpen(isOpen);

    expect(isSidebarOpen.value).toBe(isOpen);
  });
});