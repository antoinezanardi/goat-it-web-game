export default defineAppConfig({
  ui: {
    colors: {
      primary: "blue",
      neutral: "zinc",
    },
    button: {
      slots: {
        base: "cursor-pointer",
      },
      compoundVariants: [
        {
          color: "primary",
          variant: "solid",
          class: {
            base: "text-white [text-shadow:0_1px_2px_rgba(0,0,0,0.5)]",
          },
        },
      ],
    },
    link: {
      base: "cursor-pointer",
    },
  },
});