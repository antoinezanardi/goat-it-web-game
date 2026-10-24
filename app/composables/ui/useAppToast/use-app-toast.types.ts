import type { Toast } from "#ui/composables";

/**
 * Toast helpers returned by `useAppToast`, with localized default titles.
 */
type UseAppToast = {
  /** Adds a toast titled with `common.success`. */
  addSuccessToast: (options: Partial<Toast>) => Toast;
  /** Adds a toast titled with `common.error`. */
  addErrorToast: (options: Partial<Toast>) => Toast;
  /** Adds a toast titled with `common.info`. */
  addInfoToast: (options: Partial<Toast>) => Toast;
  /** Adds a toast titled with `common.warning`. */
  addWarningToast: (options: Partial<Toast>) => Toast;
  /** Updates an existing toast; the id comes from the first argument and cannot be overridden. */
  updateToast: (id: string | number, options: Omit<Partial<Toast>, "id">) => void;
  removeToast: (id: string | number) => void;
};

export type { UseAppToast };