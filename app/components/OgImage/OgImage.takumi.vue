<script lang="ts" setup>
const BRAND_NAME = "Goat It";
const LOGO_ALT = "Goat It Logo";
const TAGLINE = "Le jeu où la réponse se devine";
</script>

<template>
  <div
    id="og-image-root"
    class="bg-[#18181b] flex flex-col h-full items-center justify-center p-12 w-full"
  >
    <img
      id="og-image-logo"
      :alt="LOGO_ALT"
      class="h-32 mb-8 w-auto"
      src="/img/logo/logo-source.png"
    >

    <h1
      id="og-image-brand"
      class="font-bold text-6xl text-white"
    >
      {{ BRAND_NAME }}
    </h1>

    <hr class="border-t border-white my-4 w-44">

    <p
      id="og-image-tagline"
      class="font-bold mt-2 text-4xl text-center text-white"
    >
      {{ TAGLINE }}
    </p>
  </div>
</template>