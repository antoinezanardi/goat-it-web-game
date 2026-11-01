import { HttpStatusCode } from "#shared/enums/http-status-code.enums";

const HTTP_STATUS_CODE_MIN: number = HttpStatusCode.CONTINUE;
const HTTP_STATUS_CODE_MAX = 599;
const CLIENT_ERROR_STATUS_CODE_MIN: number = HttpStatusCode.BAD_REQUEST;
const SERVER_ERROR_STATUS_CODE_MIN: number = HttpStatusCode.INTERNAL_SERVER_ERROR;

export {
  CLIENT_ERROR_STATUS_CODE_MIN,
  HTTP_STATUS_CODE_MAX,
  HTTP_STATUS_CODE_MIN,
  SERVER_ERROR_STATUS_CODE_MIN,
};