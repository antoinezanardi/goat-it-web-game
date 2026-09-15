import type { ComponentPublicInstance } from "vue";

function resolveHTMLElement(element: Element | ComponentPublicInstance | null): HTMLElement | undefined {
  if (element === null) {
    return undefined;
  }
  if ("$el" in element) {
    return element.$el instanceof HTMLElement ? element.$el : undefined;
  }
  return element instanceof HTMLElement ? element : undefined;
}

export {
  resolveHTMLElement,
};