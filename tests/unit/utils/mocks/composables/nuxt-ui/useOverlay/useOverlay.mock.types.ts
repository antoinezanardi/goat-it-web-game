import type { Mock } from "vitest";

type UseOverlayCreateReturnValue = {
  close: Mock<(value: boolean) => void>;
  open: Mock<() => { result: Promise<boolean> }>;
};

export type { UseOverlayCreateReturnValue };