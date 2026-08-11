type DefaultModalFooterProps = {
  primaryButtonLabel: string;
  primaryButtonIcon?: string;
  closeButtonLabel?: string;
  isPrimaryButtonDisabled?: boolean;
  isPrimaryButtonLoading?: boolean;
  isCloseButtonDisabled?: boolean;
  disableShortcuts?: boolean;
};

type DefaultModalFooterEmits = {
  closeModal: [];
  primaryButtonClick: [];
};

export type {
  DefaultModalFooterProps,
  DefaultModalFooterEmits,
};