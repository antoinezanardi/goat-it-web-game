import { beforeAll, afterAll } from "vitest";

const SCROLL_ELEMENT_SIZE = 600;
const SCROLL_ELEMENT_WIDTH = 800;
const VIRTUAL_SCROLL_CONTENT_SIZE = 1000;

const GET_BOUNDING_CLIENT_RECT_DESCRIPTOR = Object.getOwnPropertyDescriptor(
  globalThis.Element.prototype,
  "getBoundingClientRect",
);

function mockElementRect(): DOMRect {
  return {
    x: 0,
    y: 0,
    width: SCROLL_ELEMENT_WIDTH,
    height: SCROLL_ELEMENT_SIZE,
    top: 0,
    right: SCROLL_ELEMENT_WIDTH,
    bottom: SCROLL_ELEMENT_SIZE,
    left: 0,
    toJSON() {
      return this;
    },
  };
}

function saveAndMockElementProperty(property: string, value: number): void {
  Object.defineProperty(globalThis.HTMLElement.prototype, property, {
    get: () => value,
    configurable: true,
  });
}

beforeAll(() => {
  globalThis.Element.prototype.getBoundingClientRect = mockElementRect;

  saveAndMockElementProperty("offsetHeight", SCROLL_ELEMENT_SIZE);
  saveAndMockElementProperty("offsetWidth", SCROLL_ELEMENT_WIDTH);
  saveAndMockElementProperty("clientHeight", SCROLL_ELEMENT_SIZE);
  saveAndMockElementProperty("clientWidth", SCROLL_ELEMENT_WIDTH);
  saveAndMockElementProperty("scrollHeight", VIRTUAL_SCROLL_CONTENT_SIZE);
  saveAndMockElementProperty("scrollWidth", SCROLL_ELEMENT_WIDTH);
});

afterAll(() => {
  if (GET_BOUNDING_CLIENT_RECT_DESCRIPTOR) {
    Object.defineProperty(
      globalThis.Element.prototype,
      "getBoundingClientRect",
      GET_BOUNDING_CLIENT_RECT_DESCRIPTOR,
    );
  }
});