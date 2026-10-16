const NUXT_UI_BADGES_CONFIG = {
  compoundVariants: [
    {
      color: "primary",
      variant: "solid",
      class:
        "[--ui-primary:var(--ui-color-primary-800)] text-white [text-shadow:0_1px_2px_rgba(0,0,0,0.5)] " +
        "border border-primary-300/45 shadow-[0_0_10px_rgba(30,64,175,0.45)]",
    },
    {
      color: "secondary",
      variant: "solid",
      class:
        "[--ui-secondary:var(--ui-color-secondary-800)] text-white [text-shadow:0_1px_2px_rgba(0,0,0,0.5)] " +
        "border border-secondary-300/45 shadow-[0_0_10px_rgba(91,33,182,0.5)]",
    },
    {
      color: "success",
      variant: "solid",
      class:
        "[--ui-success:var(--ui-color-success-800)] text-white [text-shadow:0_1px_2px_rgba(0,0,0,0.5)] " +
        "border border-success-300/45 shadow-[0_0_10px_rgba(6,95,70,0.5)]",
    },
    {
      color: "info",
      variant: "solid",
      class:
        "[--ui-info:var(--ui-color-info-800)] text-white [text-shadow:0_1px_2px_rgba(0,0,0,0.5)] " +
        "border border-info-300/45 shadow-[0_0_10px_rgba(21,94,117,0.5)]",
    },
    {
      color: "warning",
      variant: "solid",
      class:
        "[--ui-warning:var(--ui-color-warning-900)] text-white [text-shadow:0_1px_2px_rgba(0,0,0,0.5)] " +
        "border border-warning-300/50 shadow-[0_0_10px_rgba(124,45,18,0.5)]",
    },
    {
      color: "error",
      variant: "solid",
      class:
        "[--ui-error:var(--ui-color-error-800)] text-white [text-shadow:0_1px_2px_rgba(0,0,0,0.5)] " +
        "border border-error-300/45 shadow-[0_0_10px_rgba(153,27,27,0.5)]",
    },
  ],
};

export { NUXT_UI_BADGES_CONFIG };