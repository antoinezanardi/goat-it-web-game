import { isValidLocale } from "@goat-it/schemas/shared/locale";
import { z } from "zod";

import type { AppRuntimeConfig } from "#shared/types/runtime-config.types";
import { LOCAL_HOSTNAMES } from "#server/utils/env/env.constants";
import type { ValidateAppRuntimeConfigOptions } from "#server/utils/env/env.types";

function validateAppRuntimeConfig(config: AppRuntimeConfig, options: ValidateAppRuntimeConfigOptions): void {
  const baseUrlValidation = z.url().safeParse(config.goatItApi.baseUrl);

  if (!baseUrlValidation.success) {
    throw new Error("Invalid runtime environment: \"goatItApi.baseUrl\" must be a valid URL.");
  }

  const baseUrl = new URL(baseUrlValidation.data);
  if (options.isProduction && baseUrl.protocol !== "https:" && !LOCAL_HOSTNAMES.includes(baseUrl.hostname)) {
    throw new Error("Invalid runtime environment: \"goatItApi.baseUrl\" must use https in production.");
  }

  if (options.isProduction && config.goatItApi.gameKey.trim().length === 0) {
    throw new Error("Invalid runtime environment: \"goatItApi.gameKey\" must be set in production.");
  }

  if (!isValidLocale(config.public.defaultLocale)) {
    throw new Error("Invalid runtime environment: \"public.defaultLocale\" must be one of the supported locales.");
  }
}

export {
  validateAppRuntimeConfig,
};