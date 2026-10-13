<script lang="ts" setup>
import { CHANGELOG_ICON } from "@/components/shared/core/changelog/changelog.constants";
import { StateNames } from "#shared/enums/state.enums";

const { t } = useI18n();
const isUnread = useState<boolean>(StateNames.CHANGELOG_IS_UNREAD, () => false);
</script>

<template>
  <span class="flex gap-1.5 items-center">
    <UIcon
      class="size-4"
      :name="CHANGELOG_ICON"
    />

    {{ t("changelog.entryPoint") }}

    <ClientOnly>
      <span
        v-if="isUnread"
        aria-hidden="true"
        class="bg-primary inline-block ml-1 rounded-full size-2"
        data-testid="changelog-unread-indicator"
      />
    </ClientOnly>
  </span>
</template>