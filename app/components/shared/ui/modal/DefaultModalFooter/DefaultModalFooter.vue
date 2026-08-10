<script lang="ts" setup>
import type { DefaultModalFooterEmits, DefaultModalFooterProps } from "~/components/shared/ui/modal/DefaultModalFooter/default-modal-footer.types";

const props = withDefaults(defineProps<DefaultModalFooterProps>(), {
  disableShortcuts: false,
});

const emit = defineEmits<DefaultModalFooterEmits>();

const { t } = useI18n();

const closeButtonDisplayedLabel = computed<string>(() => {
  if (props.closeButtonLabel) {
    return props.closeButtonLabel;
  }
  return t("common.close");
});

const canFirePrimary = computed<boolean>(() => !props.isPrimaryButtonDisabled && !props.isPrimaryButtonLoading);

function onClickFromCloseButton(): void {
  emit("closeModal");
}

function onClickFromPrimaryButton(): void {
  emit("primaryButtonClick");
}

defineShortcuts({
  // Acceptable as defineShortcuts uses underscore-separated key names
  // eslint-disable-next-line camelcase
  meta_enter: {
    handler: () => {
      if (props.disableShortcuts) {
        return;
      }
      if (canFirePrimary.value) {
        onClickFromPrimaryButton();
      }
    },
    usingInput: true,
  },
});
</script>

<template>
  <div class="default-modal-footer flex gap-2 justify-end w-full">
    <UButton
      :aria-label="closeButtonDisplayedLabel"
      color="neutral"
      data-testid="default-modal-footer-close-button"
      :disabled="isCloseButtonDisabled"
      icon="i-lucide-x"
      :label="closeButtonDisplayedLabel"
      @click="onClickFromCloseButton"
    >
      <template #trailing>
        <UKbd
          data-testid="default-modal-footer-close-button-shortcut-escape"
          size="sm"
          value="escape"
        />
      </template>
    </UButton>

    <UButton
      :aria-label="primaryButtonLabel"
      data-testid="default-modal-footer-primary-button"
      :disabled="isPrimaryButtonDisabled"
      :icon="primaryButtonIcon"
      :label="primaryButtonLabel"
      :loading="isPrimaryButtonLoading"
      @click="onClickFromPrimaryButton"
    >
      <template #trailing>
        <UKbd
          data-testid="default-modal-footer-primary-button-shortcut-meta"
          size="sm"
          value="meta"
        />

        <UKbd
          data-testid="default-modal-footer-primary-button-shortcut-enter"
          size="sm"
          value="enter"
        />
      </template>
    </UButton>
  </div>
</template>