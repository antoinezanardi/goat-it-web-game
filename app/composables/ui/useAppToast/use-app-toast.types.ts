import type { Toast } from "#ui/composables";

type UseAppToast = {
  addSuccessToast: (options: Partial<Toast>) => Toast;
  addErrorToast: (options: Partial<Toast>) => Toast;
  addInfoToast: (options: Partial<Toast>) => Toast;
  updateToast: (id: string | number, options: Omit<Partial<Toast>, "id">) => void;
  removeToast: (id: string | number) => void;
};

export type { UseAppToast };