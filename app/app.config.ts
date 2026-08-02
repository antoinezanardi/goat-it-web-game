export default defineAppConfig({
  ui: {
    colors: {
      primary: "blue",
      neutral: "zinc",
    },
    button: {
      slots: {
        base: "cursor-pointer ",
      },
    },
    link: {
      base: "cursor-pointer",
    },
  },
});