import { ScrollTrigger } from "gsap/all";

import { defineNuxtPlugin } from "#app";

export default defineNuxtPlugin(() => {
  ScrollTrigger.disable();
});