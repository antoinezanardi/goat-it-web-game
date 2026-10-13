<script lang="ts" setup>
import { StateNames } from "#shared/enums/state.enums";
import type { ChangelogWhatsNewButtonProps } from "@/components/domain/changelog/ChangelogWhatsNewButton/changelog-whats-new-button.types";

const props = withDefaults(defineProps<ChangelogWhatsNewButtonProps>(), {
  variant: "button",
});

const isOpen = useState<boolean>(StateNames.CHANGELOG_IS_OPEN, () => false);

function onOpenChangelog(): void {
  isOpen.value = true;
}
</script>

<template>
  <UButton
    v-if="props.variant === 'button'"
    color="secondary"
    size="md"
    variant="outline"
    @click="onOpenChangelog"
  >
    <ChangelogWhatsNewButtonContent icon-class="text-primary"/>
  </UButton>

  <ULink
    v-else
    class="flex gap-1.5 items-center"
    @click="onOpenChangelog"
  >
    <ChangelogWhatsNewButtonContent/>
  </ULink>
</template>