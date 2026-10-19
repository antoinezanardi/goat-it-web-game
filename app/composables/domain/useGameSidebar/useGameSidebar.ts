import type { UseGameSidebar } from "@/composables/domain/useGameSidebar/use-game-sidebar.types";

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