export default defineAppConfig({
  ui: {
    colors: {
      primary: "blue",
      neutral: "zinc",
    },
    button: {
      compoundVariants: [
        {
          color: "primary",
          variant: "solid",
          class: {
            base: "text-white [text-shadow:0_1px_2px_rgba(0,0,0,0.5)]",
          },
        },
        {
          color: "primary",
          variant: "ghost",
          class: {
            base: "text-fg-primary",
          },
        },
      ],
    },
  },
});