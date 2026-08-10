<script lang="ts" setup>
import type { OgImageProps } from "@/components/OgImage/og-image.types";

defineProps<OgImageProps>();

const BRAND_NAME = "Goat It";
const LOGO_ALT = "Goat It Logo";
</script>

<template>
  <div class="bg-[#18181b] flex flex-col h-full items-center justify-center p-12 w-full">
    <img
      :alt="LOGO_ALT"
      class="h-32 mb-8 w-auto"
      src="/img/logo/logo-source.png"
    >

    <h1 class="font-bold mb-4 text-6xl text-white">
      {{ BRAND_NAME }}
    </h1>

    <p
      v-if="tagline"
      class="opacity-80 text-3xl text-center text-white"
    >
      {{ tagline }}
    </p>
  </div>
</template>