const SERVER_LOGGER_NAME = "goat-it-web-game";

const SERVER_LOG_REDACTION_CENSOR = "[Redacted]";

const SERVER_LOG_REDACTION_PATHS: readonly string[] = [
  "apiKey",
  "authorization",
  "cookie",
  "gameKey",
  "headers.authorization",
  "headers.cookie",
  "password",
  "request.headers.authorization",
  "request.headers.cookie",
  "token",
];

export { SERVER_LOGGER_NAME, SERVER_LOG_REDACTION_CENSOR, SERVER_LOG_REDACTION_PATHS };