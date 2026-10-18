import type { Toast } from "#ui/composables";
import type { UseAppToast } from "@/composables/ui/useAppToast/use-app-toast.types";

function useAppToast(): UseAppToast {
  const toast = useToast();
  const { $i18n } = useNuxtApp();

  const toastExtraData = {
    "data-nosnippet": "true",
  } as const;

  function addSuccessToast(options: Partial<Toast>): Toast {
    return toast.add({
      icon: "i-lucide-circle-check-big",
      color: "success",
      title: $i18n.t("common.success"),
      ...toastExtraData,
      ...options,
    });
  }

  function addErrorToast(options: Partial<Toast>): Toast {
    return toast.add({
      icon: "i-lucide-ban",
      color: "error",
      title: $i18n.t("common.error"),
      ...toastExtraData,
      ...options,
    });
  }

  function addInfoToast(options: Partial<Toast>): Toast {
    return toast.add({
      icon: "i-lucide-info",
      color: "info",
      title: $i18n.t("common.info"),
      ...toastExtraData,
      ...options,
    });
  }

  function updateToast(id: string | number, options: Omit<Partial<Toast>, "id">): void {
    toast.update(id, options);
  }

  function removeToast(id: string | number): void {
    toast.remove(id);
  }
  return {
    addSuccessToast,
    addErrorToast,
    addInfoToast,
    updateToast,
    removeToast,
  };
}

export { useAppToast };