<script lang="ts" setup>
import { computed, nextTick, onMounted, watch } from "vue";

import { DOCS_TOC_UI } from "@/components/docs/DocsToc/docs-toc.constants";
import { mapSectionsToTocLinks } from "@/components/docs/DocsToc/docs-toc.helpers";
import type { DocsTocProps } from "@/components/docs/DocsToc/docs-toc.types";

const props = defineProps<DocsTocProps>();

const links = computed(() => mapSectionsToTocLinks(props.sections));

const nuxtApp = useNuxtApp();

onMounted(() => {
  void nuxtApp.hooks.callHook("page:transition:finish");
});

watch(
  () => props.sections,
  async() => {
    await nextTick();
    void nuxtApp.hooks.callHook("page:transition:finish");
  },
);
</script>

<template>
  <UContentToc
    class="docs-toc hidden lg:block lg:self-start lg:sticky lg:top-7"
    data-testid="docs-toc"
    :links="links"
    :title="$t('docs.onThisPage')"
    :ui="DOCS_TOC_UI"
  />
</template>