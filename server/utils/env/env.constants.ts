const LOCAL_HOSTNAMES: readonly string[] = ["localhost", "127.0.0.1", "[::1]"];
const RFC1918_IPV4_PATTERN = /^(?:10\.|172\.(?:1[6-9]|2\d|3[01])\.|192\.168\.)/u;

export { LOCAL_HOSTNAMES, RFC1918_IPV4_PATTERN };