import type { VueWrapper } from "@vue/test-utils";

import type { ComponentVm } from "~~/tests/unit/utils/types/vtu.types";

/**
 * Retrieves the wrapped component's view model from a Vue test wrapper.
 * This function is useful as VTU doesn't always correctly type the wrapper.vm property, especially when the component is wrapped in a suspense component.
 * This is a TS workaround to resolve the issue https://github.com/vuejs/test-utils/issues/972
 * Only used in unit tests.
 *
 * @param {VueWrapper} wrapper - The Vue test wrapper from which the view model is extracted.
 * @return {ComponentVm} The extracted component's view model.
 */
// Acceptable as generic type parameter T is required by callers for type narrowing, and VueWrapper typing requires any
// oxlint-disable-next-line typescript/no-unnecessary-type-parameters, typescript/no-explicit-any
function getWrapperVm<T extends ComponentVm = ComponentVm>(wrapper: VueWrapper<any>): T {
  // Acceptable as VTU wrapper.vm is loosely typed and requires assertion to access component internals
  // oxlint-disable-next-line typescript/no-unsafe-type-assertion typescript/no-unnecessary-type-assertion
  return wrapper.vm as unknown as T;
}

export {
  getWrapperVm,
};