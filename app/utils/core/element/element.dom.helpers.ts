import type { ComponentPublicInstance } from "vue";

/**
 * Returns the HTML element behind a native reference or a Vue component instance.
 *
 * Component instances are unwrapped through their root `$el`. Returns `undefined` for `null`, non-HTML elements, and non-HTML component roots.
 */
function resolveHTMLElement(element: Element | ComponentPublicInstance | null): HTMLElement | undefined {
  if (element === null) {
    return undefined;
  }
  if ("$el" in element) {
    return element.$el instanceof HTMLElement ? element.$el : undefined;
  }
  return element instanceof HTMLElement ? element : undefined;
}

/**
 * Returns whether keyboard input targeting this event target belongs to an editable control.
 *
 * Editable controls are inputs, text areas, selects, and content-editable elements or their descendants.
 */
function isEditableKeyboardTarget(target: EventTarget | null): boolean {
  if (!(target instanceof HTMLElement)) {
    return false;
  }
  if (target.isContentEditable) {
    return true;
  }
  return target instanceof HTMLInputElement || target instanceof HTMLTextAreaElement || target instanceof HTMLSelectElement;
}

/**
 * Returns the focused HTML element, or `undefined` when the body owns focus or the active element is not an HTML element.
 */
function getFocusedHTMLElement(): HTMLElement | undefined {
  const { activeElement } = document;

  return activeElement instanceof HTMLElement && activeElement !== document.body ? activeElement : undefined;
}

/**
 * Returns whether the element is connected, enabled, and visible.
 *
 * Visibility uses `checkVisibility` when available and falls back to `offsetParent`.
 */
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