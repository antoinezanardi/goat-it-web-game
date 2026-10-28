import type { VueWrapper } from "@vue/test-utils";
import { mountSuspended } from "@nuxt/test-utils/runtime";
import { beforeEach, describe, expect, it } from "vitest";

import type { MountSuspendedOptions } from "~~/tests/unit/utils/types/mount.types";

import type { UIcon } from "#components";
import { StatusScreen } from "#components";

import type { StatusScreenProps } from "@/components/shared/ui/StatusScreen/status-screen.types";

describe("StatusScreen Component", () => {
  const defaultStatusScreenProps: StatusScreenProps = {
    icon: "i-lucide-wifi-off",
    title: "status.title",
  } as const;

  let wrapper: VueWrapper;

  async function mountStatusScreen(options: MountSuspendedOptions<typeof StatusScreen> = {}): Promise<VueWrapper> {
    return mountSuspended(StatusScreen, {
      props: defaultStatusScreenProps,
      ...options,
    });
  }

  beforeEach(async() => {
    wrapper = await mountStatusScreen();
  });

  it("should render StatusScreen when mounted.", () => {
    expect(wrapper.exists()).toBeTruthy();
  });

  it("should render the section variant by default when no variant is provided.", () => {
    expect(wrapper.classes()).toContain("flex-1");
  });

  it("should render the page variant when variant is page.", async() => {
    wrapper = await mountStatusScreen({ props: { ...defaultStatusScreenProps, variant: "page" } });

    expect(wrapper.classes()).toContain("min-h-dvh");
  });

  it("should render the title with the h2 tag when variant is section.", () => {
    expect(wrapper.find("h2").text()).toBe("status.title");
  });

  it("should render the title with the h1 tag when variant is page.", async() => {
    wrapper = await mountStatusScreen({ props: { ...defaultStatusScreenProps, variant: "page" } });

    expect(wrapper.find("h1").text()).toBe("status.title");
  });

  it("should render the description when description is provided.", async() => {
    wrapper = await mountStatusScreen({ props: { ...defaultStatusScreenProps, description: "status.description" } });

    expect(wrapper.find("p").text()).toBe("status.description");
  });

  it("should not render the description when no description is provided.", () => {
    expect(wrapper.find("p").exists()).toBeFalsy();
  });

  it("should render the icon when mounted.", () => {
    const icon = wrapper.findComponent<typeof UIcon>({ name: "UIcon" });

    expect(icon.props("name")).toBe("i-lucide-wifi-off");
  });

  it("should apply the default page icon color when iconClass is not provided.", async() => {
    wrapper = await mountStatusScreen({ props: { ...defaultStatusScreenProps, variant: "page" } });
    const icon = wrapper.findComponent<typeof UIcon>({ name: "UIcon" });

    expect(icon.classes()).toContain("text-fg-secondary");
  });

  it("should apply the custom icon class when iconClass is provided.", async() => {
    wrapper = await mountStatusScreen({ props: { ...defaultStatusScreenProps, iconClass: "text-warning", variant: "page" } });
    const icon = wrapper.findComponent<typeof UIcon>({ name: "UIcon" });

    expect({
      hasCustomClass: icon.classes().includes("text-warning"),
      hasDefaultClass: icon.classes().includes("text-fg-secondary"),
    }).toStrictEqual({ hasCustomClass: true, hasDefaultClass: false });
  });

  it("should render the title slot content when the title slot is provided.", async() => {
    wrapper = await mountStatusScreen({ slots: { title: "Custom title" } });

    expect(wrapper.find("h2").text()).toBe("Custom title");
  });

  it("should render the description slot content when the description slot is provided without a description prop.", async() => {
    wrapper = await mountStatusScreen({ slots: { description: "Custom description" } });

    expect(wrapper.find("p").text()).toBe("Custom description");
  });

  it("should render the description slot content instead of the description prop when both are provided.", async() => {
    wrapper = await mountStatusScreen({
      props: { ...defaultStatusScreenProps, description: "status.description" },
      slots: { description: "Custom description" },
    });

    expect(wrapper.find("p").text()).toBe("Custom description");
  });

  it("should render the actions slot content when the actions slot is provided.", async() => {
    wrapper = await mountStatusScreen({ slots: { actions: "<button data-testid='custom-action'>Custom action</button>" } });

    expect(wrapper.find("[data-testid='custom-action']").exists()).toBeTruthy();
  });

  it("should not render an action when no actions slot is provided.", () => {
    expect(wrapper.find("button").exists()).toBeFalsy();
  });

  it("should apply the test id to the root when testId is provided.", async() => {
    wrapper = await mountStatusScreen({ props: { ...defaultStatusScreenProps, testId: "status-screen" } });

    expect(wrapper.attributes("data-testid")).toBe("status-screen");
  });

  it("should not apply a test id to the root when testId is not provided.", () => {
    expect(wrapper.attributes("data-testid")).toBeUndefined();
  });

  it("should derive the title test id from testId when testId is provided.", async() => {
    wrapper = await mountStatusScreen({ props: { ...defaultStatusScreenProps, testId: "status-screen" } });

    expect(wrapper.find("[data-testid='status-screen-title']").text()).toBe("status.title");
  });

  it("should derive the description test id from testId when testId is provided.", async() => {
    wrapper = await mountStatusScreen({ props: { ...defaultStatusScreenProps, description: "status.description", testId: "status-screen" } });

    expect(wrapper.find("[data-testid='status-screen-description']").text()).toBe("status.description");
  });
});