<script lang="ts" setup>
import { computed } from "vue";

import { DOCS_BACK_TO_TOP_BUTTON_UI, DOCS_BACK_TO_TOP_THRESHOLD } from "@/components/docs/DocsBackToTop/docs-back-to-top.constants";

const reducedMotion = usePreferredReducedMotion();

const behavior = computed<ScrollBehavior>(() => (reducedMotion.value === "reduce" ? "auto" : "smooth"));

const { y } = useWindowScroll({ behavior });

function scrollToTop(): void {
  y.value = 0;
}
</script>

<template>
  <Transition name="fade">
    <UButton
      v-show="y > DOCS_BACK_TO_TOP_THRESHOLD"
      :aria-label="$t('docs.backToTop')"
      class="bottom-6 fixed right-6 z-10"
      data-testid="docs-back-to-top-button"
      icon="i-lucide-arrow-up"
      square
      :ui="DOCS_BACK_TO_TOP_BUTTON_UI"
      variant="solid"
      @click="scrollToTop"
    />
  </Transition>
</template>