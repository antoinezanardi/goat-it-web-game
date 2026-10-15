import { describe, expect, it } from "vitest";
import type { ComponentPublicInstance } from "vue";

import { isEditableKeyboardTarget, resolveHTMLElement } from "#shared/utils/helpers/element/element.dom.helpers";

describe(resolveHTMLElement, () => {
  it("should return the input element when the reference is an HTML element.", () => {
    const element = document.createElement("span");

    expect(resolveHTMLElement(element)).toBe(element);
  });

  it("should return the component root element when the reference is a component instance.", () => {
    const rootElement = document.createElement("span");
    const instance = { $el: rootElement } as unknown as ComponentPublicInstance;

    expect(resolveHTMLElement(instance)).toBe(rootElement);
  });

  it.each<{ label: string; input: Element | ComponentPublicInstance | null }>([
    { label: "null", input: null },
    { label: "a non-HTML component root", input: { $el: document.createTextNode("hint") } as unknown as ComponentPublicInstance },
    { label: "a non-HTML element", input: document.createElementNS("http://www.w3.org/2000/svg", "svg") },
  ])("should return undefined when the reference is $label.", ({ input }) => {
    expect(resolveHTMLElement(input)).toBeUndefined();
  });
});

describe(isEditableKeyboardTarget, () => {
  it.each<{ label: string; tagName: "input" | "select" | "textarea" }>([
    { label: "an input", tagName: "input" },
    { label: "a select", tagName: "select" },
    { label: "a textarea", tagName: "textarea" },
  ])("should return true when the target is $label element.", ({ tagName }) => {
    expect(isEditableKeyboardTarget(document.createElement(tagName))).toBe(true);
  });

  it("should return true when the target is a content editable element.", () => {
    const element = document.createElement("div");
    element.contentEditable = "true";

    expect(isEditableKeyboardTarget(element)).toBe(true);
  });

  it("should return true when the target inherits editability from a content editable ancestor.", () => {
    const container = document.createElement("div");
    container.contentEditable = "true";
    const element = document.createElement("span");
    container.append(element);

    expect(isEditableKeyboardTarget(element)).toBe(true);
  });

  it.each<{ description: string; target: Parameters<typeof isEditableKeyboardTarget>[0] }>([
    { description: "an ordinary HTML element", target: document.createElement("div") },
    { description: "null", target: null },
    { description: "a non-HTML element", target: document.createElementNS("http://www.w3.org/2000/svg", "svg") },
  ])("should return false when the target is $description.", ({ target }) => {
    expect(isEditableKeyboardTarget(target)).toBe(false);
  });
});