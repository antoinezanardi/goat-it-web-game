#!/bin/sh
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

  if grep -rqF -e "$variable_value" "$output_directory"; then
    echo "Secret value of $variable_name found in $output_directory."
    exit 1
  fi
done

echo "No secret values found in $output_directory."
