import { z } from "zod";

import { LOCAL_HOSTNAMES, RFC1918_IPV4_PATTERN } from "#server/utils/env/helpers/internal-hostname/internal-hostname.constants";

/**
 * Tells whether a host is internal: loopback names, single-label names, and RFC1918 IPv4 addresses.
 *
 * Production HTTPS validation exempts these hosts so local and sidecar deployments keep working.
 */
function isInternalHostname(hostname: string): boolean {
  if (LOCAL_HOSTNAMES.includes(hostname)) {
    return true;
  }

  if (!hostname.includes(".") && !hostname.startsWith("[")) {
    return true;
  }
  return z.ipv4().safeParse(hostname).success && RFC1918_IPV4_PATTERN.test(hostname);
}

export { isInternalHostname };