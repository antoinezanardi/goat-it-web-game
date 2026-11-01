import { disableAutoUnmount, enableAutoUnmount } from "@vue/test-utils";
import { afterEach } from "vitest";

disableAutoUnmount();
enableAutoUnmount(afterEach);