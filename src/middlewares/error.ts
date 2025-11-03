class ErrorHandler extends Error {
  statusCode: number;

  constructor(statusCode: number, message: string) {
    super(message);
    this.statusCode = statusCode;

    // Set the prototype explicitly for extending built-ins in TS
    Object.setPrototypeOf(this, ErrorHandler.prototype);
  }
}

export default ErrorHandler;

export const errors = {
  NOT_FOUND: new ErrorHandler(404, "Resource Not Found"),
  UNAUTHORIZED: new ErrorHandler(401, "Unauthorized Access"),
  BAD_REQUEST: new ErrorHandler(400, "Bad Request"),
  FORBIDDEN: new ErrorHandler(403, "Access Forbidden"),
  UNPROCESSABLE_ENTITY: new ErrorHandler(422, "Unprocessable Entity"),
  INTERNAL_SERVER_ERROR: new ErrorHandler(500, "Internal Server Error"),
  INVALID_CREDENTIALS: new ErrorHandler(401, "Invalid email or password"),
  CONFLICT_DATA: new ErrorHandler(409, "Resource already exists"),
  INVALID_TOKEN: new ErrorHandler(401, "Invalid or expired token"),
  
};
