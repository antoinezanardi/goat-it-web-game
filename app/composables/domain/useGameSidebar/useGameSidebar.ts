import type { UseGameSidebar } from "@/composables/domain/useGameSidebar/use-game-sidebar.types";

/**
 * Owns the open state of the game sidebar.
 *
 * State is local to the caller; nothing is persisted or shared across components.
 */
function useGameSidebar(): UseGameSidebar {
  const isSidebarOpen = ref<boolean>(false);

  function openSidebar(): void {
    isSidebarOpen.value = true;
  }

  function closeSidebar(): void {
    isSidebarOpen.value = false;
  }

  function setSidebarOpen(isOpen: boolean): void {
    isSidebarOpen.value = isOpen;
  }
  return {
    isSidebarOpen,
    openSidebar,
    closeSidebar,
    setSidebarOpen,
  };
}

export { useGameSidebar };