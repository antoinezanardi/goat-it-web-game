import { checkReadinessHandler } from "#server/routes/readyz/handlers/check-readiness/index.get.handler";

export default defineEventHandler(checkReadinessHandler);