import type { Mock } from "vitest";

type OverlayOpenReturnValue = {
  result: Promise<boolean>;
  then: Promise<boolean>["then"];
};

type UseOverlayCreateReturnValue = {
  close: Mock<(value: boolean) => void>;
  open: Mock<() => OverlayOpenReturnValue>;
};

export type { OverlayOpenReturnValue, UseOverlayCreateReturnValue };