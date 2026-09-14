import { describe, expect, it } from "vitest";
import type { ComponentPublicInstance } from "vue";

import { resolveHTMLElement } from "#shared/utils/helpers/element/element.dom.helpers";

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

  it("should return undefined when the reference is null.", () => {
    expect(resolveHTMLElement(null)).toBeUndefined();
  });

  it("should return undefined when the component root is not an HTML element.", () => {
    const instance = { $el: document.createTextNode("hint") } as unknown as ComponentPublicInstance;

    expect(resolveHTMLElement(instance)).toBeUndefined();
  });

  it("should return undefined when the reference is not an HTML element.", () => {
    const svgElement = document.createElementNS("http://www.w3.org/2000/svg", "svg");

    expect(resolveHTMLElement(svgElement)).toBeUndefined();
  });
});