import { checkLivenessHandler } from "#server/routes/healthz/handlers/check-liveness/index.get.handler";

export default defineEventHandler(checkLivenessHandler);