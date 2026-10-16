const NUXT_UI_TABS_CONFIG = {
  compoundVariants: [
    {
      color: "primary",
      variant: "pill",
      class: {
        indicator: "[--ui-primary:var(--ui-color-primary-800)]",
        trigger: [
          "data-[state=active]:text-white",
          "[--ui-primary:var(--ui-color-primary-800)]",
        ],
      },
    },
  ],
};

export { NUXT_UI_TABS_CONFIG };