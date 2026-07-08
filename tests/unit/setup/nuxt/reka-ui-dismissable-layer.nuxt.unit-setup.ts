import { beforeAll } from "vitest";

// Prevent infinite recursion between reka-ui@2.9.6 DismissableLayer/utils.js
// and happy-dom@20.9.0 EventTarget.js. The DismissableLayer registers async
// event handlers (handlePointerDown, handleFocus) on the document. happy-dom
// wraps each listener's return value with .catch() calling dispatchError, which
// re-dispatches events and causes a RangeError: Maximum call stack size exceeded.
beforeAll(() => {
  const originalAddEventListener = document.addEventListener.bind(document);

  Object.defineProperty(document, "addEventListener", {
    configurable: true,
    writable: true,
    value(type: string, listener: EventListenerOrEventListenerObject | null, options?: boolean | AddEventListenerOptions): void {
      if (type === "pointerdown" || type === "focusin") {
        return;
      }
      if (listener === null) {
        return;
      }
      originalAddEventListener(type, listener, options);
    },
  });
});