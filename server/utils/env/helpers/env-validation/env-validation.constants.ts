import type { CspMode } from "#shared/types/runtime-config.types";

const LOCAL_HOSTNAMES: readonly string[] = ["localhost", "127.0.0.1", "[::1]"];
const RFC1918_IPV4_PATTERN = /^(?:10\.|172\.(?:1[6-9]|2\d|3[01])\.|192\.168\.)/u;
const SUPPORTED_CSP_MODES: readonly CspMode[] = ["enforce", "report-only", "off"];

export { LOCAL_HOSTNAMES, RFC1918_IPV4_PATTERN, SUPPORTED_CSP_MODES };