import type { MaybeRefOrGetter, Ref } from "vue";

type UseLazyModalOptions = {
  isOpen: MaybeRefOrGetter<boolean>;
};

type UseLazyModal = {
  hasEverOpened: Ref<boolean>;
};

export type { UseLazyModal, UseLazyModalOptions };