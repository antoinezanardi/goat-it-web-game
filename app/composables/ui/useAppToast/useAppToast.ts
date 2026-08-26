import type { Toast } from "#ui/composables";

type UseAppToast = {
  addSuccessToast: (options: Partial<Toast>) => Toast;
  addErrorToast: (options: Partial<Toast>) => Toast;
  addInfoToast: (options: Partial<Toast>) => Toast;
  removeToast: (id: string | number) => void;
};

function useAppToast(): UseAppToast {
  const toast = useToast();
  const { $i18n } = useNuxtApp();

  function addSuccessToast(options: Partial<Toast>): Toast {
    return toast.add({
      icon: "i-lucide-circle-check-big",
      color: "success",
      title: $i18n.t("common.success"),
      ...options,
    });
  }

  function addErrorToast(options: Partial<Toast>): Toast {
    return toast.add({
      icon: "i-lucide-ban",
      color: "error",
      title: $i18n.t("common.error"),
      ...options,
    });
  }

  function addInfoToast(options: Partial<Toast>): Toast {
    return toast.add({
      icon: "i-lucide-info",
      color: "info",
      title: $i18n.t("common.info"),
      ...options,
    });
  }

  function removeToast(id: string | number): void {
    toast.remove(id);
  }
  return {
    addSuccessToast,
    addErrorToast,
    addInfoToast,
    removeToast,
  };
}

export type {
  UseAppToast,
};

export { useAppToast };