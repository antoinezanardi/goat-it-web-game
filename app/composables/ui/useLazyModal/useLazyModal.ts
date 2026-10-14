import { ref, toValue, watch } from "vue";

import type { UseLazyModal, UseLazyModalOptions } from "~/composables/ui/useLazyModal/use-lazy-modal.types";

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