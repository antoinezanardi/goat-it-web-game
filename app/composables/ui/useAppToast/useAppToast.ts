import type { Toast } from "#ui/composables";

type UseAppToast = {
  addSuccessToast: (options: Partial<Toast>) => void;
  addErrorToast: (options: Partial<Toast>) => void;
};

function useAppToast(): UseAppToast {
  const toast = useToast();
  const { t } = useI18n();

  function addSuccessToast(options: Partial<Toast>): void {
    toast.add({
      icon: "i-lucide-circle-check-big",
      color: "success",
      title: t("common.success"),
      ...options,
    });
  }

  function addErrorToast(options: Partial<Toast>): void {
    toast.add({
      icon: "i-lucide-ban",
      color: "error",
      title: t("common.error"),
      ...options,
    });
  }
  return {
    addSuccessToast,
    addErrorToast,
  };
}

export type {
  UseAppToast,
};

export { useAppToast };