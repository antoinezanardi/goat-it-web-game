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

function isEditableKeyboardTarget(target: EventTarget | null): boolean {
  if (!(target instanceof HTMLElement)) {
    return false;
  }
  if (target.isContentEditable) {
    return true;
  }
  return target instanceof HTMLInputElement || target instanceof HTMLTextAreaElement || target instanceof HTMLSelectElement;
}

export {
  isEditableKeyboardTarget,
  resolveHTMLElement,
};