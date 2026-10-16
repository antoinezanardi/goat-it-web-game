<script lang="ts" setup>
import { StateNames } from "#shared/enums/state.enums";
import type { ChangelogWhatsNewButtonProps } from "@/components/domain/changelog/ChangelogWhatsNewButton/changelog-whats-new-button.types";

const props = withDefaults(defineProps<ChangelogWhatsNewButtonProps>(), {
  variant: "button",
});

const isOpen = useState<boolean>(StateNames.CHANGELOG_IS_OPEN, () => false);

const isButtonVariant = computed<boolean>(() => props.variant === "button");

function onOpenChangelog(): void {
  isOpen.value = true;
}
</script>

<template>
  <UButton
    v-if="isButtonVariant"
    color="primary"
    size="md"
    variant="soft"
    @click="onOpenChangelog"
  >
    <ChangelogWhatsNewButtonContent/>
  </UButton>

  <ULink
    v-else
    class="flex gap-1.5 items-center"
    @click="onOpenChangelog"
  >
    <ChangelogWhatsNewButtonContent/>
  </ULink>
</template>