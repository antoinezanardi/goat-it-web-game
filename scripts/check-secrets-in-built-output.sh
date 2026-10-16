#!/bin/sh
# Checks that a production build did not leak any monitored environment
# secret values into the built output directory.
#
# Usage: sh scripts/check-secrets-in-built-output.sh [output_directory]
# The output directory defaults to .output. The scan runs after the build,
# from the Docker build stage and the CI Build workflow.
#
# Monitored variables are environment variables named NUXT_* (except
# NUXT_PUBLIC_*) or containing SECRET, TOKEN, PASSWORD or PRIVATE_KEY, whose
# value is at least 8 characters long.
#
# The script exits non-zero when a monitored value is found in the output or
# when the scan itself fails, and prints a confirmation message otherwise.
#
# Known limitation: environment values are read line by line, so a multiline
# value is only searched through its first line, and is ignored entirely when
# that first line is shorter than 8 characters.
set -eu

output_directory="${1:-.output}"
minimum_secret_length=8

env | while IFS="=" read -r variable_name variable_value; do
  case "$variable_name" in
    NUXT_PUBLIC_*) continue ;;
    NUXT_*) ;;
    *SECRET*|*TOKEN*|*PASSWORD*|*PRIVATE_KEY*) ;;
    *) continue ;;
  esac

  if [ "${#variable_value}" -lt "$minimum_secret_length" ]; then
    continue
  fi

  grep_status=0
  grep -rqF -e "$variable_value" "$output_directory" || grep_status=$?

  case "$grep_status" in
    0)
      echo "Secret value of $variable_name found in $output_directory."
      exit 1
      ;;
    1) ;;
    *)
      echo "Secret scan failed for $variable_name in $output_directory (grep exit status: $grep_status)." >&2
      exit 1
      ;;
  esac
done

echo "No secret values found in $output_directory."
