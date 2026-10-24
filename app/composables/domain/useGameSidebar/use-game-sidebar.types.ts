/**
 * Sidebar open state and its mutation helpers.
 */
type UseGameSidebar = {
  isSidebarOpen: Ref<boolean>;
  openSidebar: () => void;
  closeSidebar: () => void;
  setSidebarOpen: (isOpen: boolean) => void;
};

export type { UseGameSidebar };