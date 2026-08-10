type ConfirmDialogProps = {
  icon: string;
  iconClass?: string;
  title: string;
  description: string;
  primaryButtonLabel?: string;
  closeButtonLabel?: string;
  dismissible?: boolean;
  close?: boolean;
  disableShortcuts?: boolean;
};

type ConfirmDialogEmits = {
  close: [value: boolean];
};

export type {
  ConfirmDialogProps,
  ConfirmDialogEmits,
};