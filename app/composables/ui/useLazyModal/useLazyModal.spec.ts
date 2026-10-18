import { describe, expect, it } from "vitest";
import { nextTick, ref } from "vue";

import { useLazyModal } from "@/composables/ui/useLazyModal/useLazyModal";

describe(useLazyModal, () => {
  it("should not report the modal as ever opened when it starts closed.", () => {
    const isOpen = ref<boolean>(false);

    const { hasEverOpened } = useLazyModal({ isOpen });

    expect(hasEverOpened.value).toBe(false);
  });

  it("should report the modal as ever opened when it starts open.", () => {
    const isOpen = ref<boolean>(true);

    const { hasEverOpened } = useLazyModal({ isOpen: () => isOpen.value });

    expect(hasEverOpened.value).toBe(true);
  });

  it("should report the modal as ever opened when it opens.", async() => {
    const isOpen = ref<boolean>(false);
    const { hasEverOpened } = useLazyModal({ isOpen });

    isOpen.value = true;
    await nextTick();

    expect(hasEverOpened.value).toBe(true);
  });

  it("should keep the modal reported as ever opened when it closes again.", async() => {
    const isOpen = ref<boolean>(true);
    const { hasEverOpened } = useLazyModal({ isOpen });

    isOpen.value = false;
    await nextTick();

    expect(hasEverOpened.value).toBe(true);
  });
});