type GsapContext = {
  add: (callback: () => void) => void;
  revert: () => void;
};

export type { GsapContext };