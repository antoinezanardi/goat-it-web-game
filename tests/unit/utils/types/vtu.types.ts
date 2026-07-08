type ComponentVm = {
  // Acceptable as $ is Vue's internal instance property name
  // oxlint-disable-next-line id-length
  $: {
    refs: Record<string, Element | ComponentPublicInstance | null>;
    setupState: Record<string, unknown>;
  };
  $attrs: Record<string, unknown>;
  $emit: (event: string, ...arguments_: unknown[]) => void;
};

export type {
  ComponentVm,
};