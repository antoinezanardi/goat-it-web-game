<script setup lang="ts">
import type { ConfirmDialogEmits, ConfirmDialogProps } from "~/components/shared/ui/modal/ConfirmDialog/confirm-dialog.types";

const props = withDefaults(defineProps<ConfirmDialogProps>(), {
  dismissible: true,
  close: true,
});

const emit = defineEmits<ConfirmDialogEmits>();

const { t } = useI18n();

const isOpen = ref<boolean>(true);

const closeButtonLabel = computed<string>(() => props.closeButtonLabel ?? t("common.cancel"));

const primaryButtonLabel = computed<string>(() => props.primaryButtonLabel ?? t("common.confirm"));

function onCloseModalFromFooter(): void {
  isOpen.value = false;
  emit("close", false);
}

function onPrimaryButtonClickFromFooter(): void {
  isOpen.value = false;
  emit("close", true);
}
</script>

<template>
  <UModal
    v-model:open="isOpen"
    :close="close"
    data-testid="confirm-dialog-modal"
    :dismissible="dismissible"
  >
    <template #title>
      <DefaultModalTitle
        data-testid="confirm-dialog-title"
        :icon="icon"
        :title="title"
      />
    </template>

    <template #body>
      <p data-testid="confirm-dialog-description">
        {{ description }}
      </p>
    </template>

    <template #footer>
      <DefaultModalFooter
        :close-button-label="closeButtonLabel"
        data-testid="confirm-dialog-footer"
        :primary-button-label="primaryButtonLabel"
        @close-modal="onCloseModalFromFooter"
        @primary-button-click="onPrimaryButtonClickFromFooter"
      />
    </template>
  </UModal>
</template>