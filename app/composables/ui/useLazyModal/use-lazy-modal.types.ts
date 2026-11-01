import type { MaybeRefOrGetter, Ref } from "vue";

type UseLazyModalOptions = {
  /** Open state of the modal; accepts a ref, a getter, or a plain boolean. */
  isOpen: MaybeRefOrGetter<boolean>;
};

/**
 * Contract returned by `useLazyModal`: whether the modal has ever opened.
 */
type UseLazyModal = {
  /** True once the modal has opened at least once; never resets to false. */
  hasEverOpened: Ref<boolean>;
};

export type { UseLazyModal, UseLazyModalOptions };