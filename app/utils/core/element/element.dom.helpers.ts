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

function getFocusedHTMLElement(): HTMLElement | undefined {
  const { activeElement } = document;

  return activeElement instanceof HTMLElement && activeElement !== document.body ? activeElement : undefined;
}

function isElementFocusable(element: HTMLElement): boolean {
  if (!element.isConnected || element.matches(":disabled")) {
    return false;
  }
  if (typeof element.checkVisibility === "function") {
    return element.checkVisibility();
  }
  return Boolean(element.offsetParent);
}

export {
  getFocusedHTMLElement,
  isEditableKeyboardTarget,
  isElementFocusable,
  resolveHTMLElement,
};