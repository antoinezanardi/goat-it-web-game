import type { UseLazyModal, UseLazyModalOptions } from "@/composables/ui/useLazyModal/use-lazy-modal.types";

/**
 * Tracks whether the bound modal has ever been open.
 *
 * Consumers use `hasEverOpened` to lazy-mount modal content on first open while
 * keeping it mounted afterwards. The watcher runs immediately, so a modal that is
 * already open on setup is reported as opened.
 *
 * @example
 * const { hasEverOpened } = useLazyModal({ isOpen: () => props.isOpen });
 *
 * <LazyUModal v-if="hasEverOpened" :open="props.isOpen" />
 */
function useLazyModal(options: UseLazyModalOptions): UseLazyModal {
  const hasEverOpened = ref<boolean>(false);

  watch(() => toValue(options.isOpen), (isOpen: boolean) => {
    if (isOpen) {
      hasEverOpened.value = true;
    }
  }, { immediate: true });

  return { hasEverOpened };
}

export { useLazyModal };