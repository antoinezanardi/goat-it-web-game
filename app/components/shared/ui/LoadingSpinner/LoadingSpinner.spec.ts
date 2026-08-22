import type { VueWrapper } from "@vue/test-utils";
import { mountSuspended } from "@nuxt/test-utils/runtime";
import { beforeEach, describe, expect, it } from "vitest";

import type { MountSuspendedOptions } from "~~/tests/unit/utils/types/mount.types";

import { LoadingSpinner } from "#components";

import type { LoadingSpinnerProps } from "@/components/shared/ui/LoadingSpinner/loading-spinner.types";

describe("LoadingSpinner Component", () => {
  let wrapper: VueWrapper;

  const defaultLoadingSpinnerProps: LoadingSpinnerProps = {} as const;

  async function mountLoadingSpinner(options: MountSuspendedOptions<typeof LoadingSpinner> = {}): Promise<VueWrapper> {
    return mountSuspended(LoadingSpinner, { props: defaultLoadingSpinnerProps, ...options });
  }

  describe("without label", () => {
    beforeEach(async() => {
      wrapper = await mountLoadingSpinner();
    });

    it("should render the spinner icon with the correct test id when mounted.", () => {
      expect(wrapper.find("[data-testid='loading-spinner']").exists()).toBeTruthy();
    });

    it("should not render the label element when no label prop is provided.", () => {
      expect(wrapper.find("[data-testid='loading-spinner-label']").exists()).toBeFalsy();
    });
  });

  describe("with label", () => {
    const fakeLabel = "Loading …";

    beforeEach(async() => {
      wrapper = await mountLoadingSpinner({ props: { label: fakeLabel } });
    });

    it("should render the label text when provided.", () => {
      expect(wrapper.find("[data-testid='loading-spinner-label']").text()).toBe(fakeLabel);
    });
  });
});