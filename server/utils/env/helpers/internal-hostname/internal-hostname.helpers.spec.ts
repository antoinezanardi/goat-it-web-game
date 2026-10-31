import { describe, expect, it } from "vitest";

import { isInternalHostname } from "#server/utils/env/helpers/internal-hostname/internal-hostname.helpers";

describe(isInternalHostname, () => {
  it.each<{ hostname: string }>([
    { hostname: "localhost" },
    { hostname: "127.0.0.1" },
    { hostname: "[::1]" },
    { hostname: "goat-it-api-production" },
    { hostname: "10.0.0.8" },
    { hostname: "172.16.0.1" },
    { hostname: "172.20.0.1" },
    { hostname: "172.31.255.254" },
    { hostname: "192.168.1.20" },
  ])("should return true when the hostname \"$hostname\" is internal.", ({ hostname }) => {
    expect(isInternalHostname(hostname)).toBe(true);
  });

  it.each<{ hostname: string }>([
    { hostname: "api.goat-it.com" },
    { hostname: "goat-it.fr" },
    { hostname: "8.8.8.8" },
    { hostname: "11.0.0.1" },
    { hostname: "172.15.255.255" },
    { hostname: "172.32.0.1" },
    { hostname: "192.169.0.1" },
    { hostname: "[2001:db8::1]" },
  ])("should return false when the hostname \"$hostname\" is not internal.", ({ hostname }) => {
    expect(isInternalHostname(hostname)).toBe(false);
  });
});