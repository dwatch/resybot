// ErrorFactory to create specific HTTP errors.
export class ErrorFactory {
  // 400 Level Errors
  static badRequest(message: string = "Bad Request") {
    return new HttpError(message, 400);
  }

  static unauthorized(message: string = "Unauthorized") {
    return new HttpError(message, 401);
  }

  static paymentRequired(message: string = "Payment Required") {
    return new HttpError(message, 402);
  }

  static forbidden(message: string = "Forbidden") {
    return new HttpError(message, 403);
  }

  static notFound(message: string = "Not Found") {
    return new HttpError(message, 404);
  }

  // 500 Level Errors
  static internalServerError(message: string = "Internal Server Error") {
    return new HttpError(message, 500);
  }

  static notImplemented(message: string = "Not Implemented") {
    return new HttpError(message, 501);
  }

  static badGateway(message: string = "Bad Gateway") {
    return new HttpError(message, 502);
  }

  static serviceUnavailable(message: string = "Service Unavailable") {
    return new HttpError(message, 503);
  }

  static gatewayTimeout(message: string = "Gateway Timeout") {
    return new HttpError(message, 504);
  }

  // Resy Specific Errors
  static resyClientError(functionName: string) {
    return new ResyError(`Resy client error in ${functionName}`, 500)
  }

  static reservationConflict(message: string = "Reservation Conflict") {
    return new ResyError(message, 412);
  }
}

// Define a custom error type for HTTP errors.
export class HttpError extends Error {
  statusCode: number;

  constructor(message: string, statusCode: number) {
    super(message);
    this.name = "HttpError";
    this.statusCode = statusCode;
  }
}

export class ResyError extends HttpError {
  statusCode: number;

  constructor(message: string, statusCode: number) {
    super(message, statusCode);
    this.name = "ResyError";
    this.statusCode = statusCode
  }
}