<script lang="ts" setup>
import { computed } from "vue";

import { DOCS_BACK_TO_TOP_THRESHOLD } from "@/components/docs/DocsBackToTop/docs-back-to-top.constants";

const reducedMotion = usePreferredReducedMotion();

const behavior = computed<ScrollBehavior>(() => (reducedMotion.value === "reduce" ? "auto" : "smooth"));

const { y } = useWindowScroll({ behavior });

const isVisible = computed<boolean>(() => y.value > DOCS_BACK_TO_TOP_THRESHOLD);

function scrollToTop(): void {
  y.value = 0;
}
</script>

<template>
  <Transition name="fade">
    <div
      v-show="isVisible"
      class="bottom-6 fixed right-6 z-10"
    >
      <UTooltip :text="$t('docs.backToTop')">
        <UButton
          :aria-label="$t('docs.backToTop')"
          color="primary"
          data-testid="docs-back-to-top-button"
          icon="i-lucide-arrow-up"
          square
          variant="solid"
          @click="scrollToTop"
        />
      </UTooltip>
    </div>
  </Transition>
</template>