type ConfirmDialogProps = {
  icon: string;
  title: string;
  description: string;
  primaryButtonLabel?: string;
  closeButtonLabel?: string;
  dismissible?: boolean;
  close?: boolean;
};

type ConfirmDialogEmits = {
  close: [value: boolean];
};

export type {
  ConfirmDialogProps,
  ConfirmDialogEmits,
};