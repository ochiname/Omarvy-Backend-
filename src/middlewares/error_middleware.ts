import { Request, Response, NextFunction} from 'express';
import ErrorHandler, { errors } from './error';

export const errorMiddleware = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
): Response | void => {
  if (err instanceof ErrorHandler) {
    return res.status(err.statusCode).json({
      success: false,
      error: {
        statusCode: err.statusCode,
        message: err.message,
      },
    });
  }

  console.error(err);

  return res.status(500).json({
    success: false,
    error: {
      statusCode: 500,
      message: 'Internal Server Error',
    },
  });
};

export const notFoundMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  next(errors.NOT_FOUND);
};

export const unauthorizedMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  next(errors.UNAUTHORIZED);
};

export const badRequestMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  next(errors.BAD_REQUEST);
};

export const forbiddenMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  next(errors.FORBIDDEN);
};

export const unprocessableEntityMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  next(errors.UNPROCESSABLE_ENTITY);
};

export const conflictMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  next(errors.CONFLICT_DATA); // or errors.EMAIL_ALREADY_EXISTS, etc.
};

export const invalidTokenMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  next(errors.INVALID_TOKEN);
};

export const internalServerErrorMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  next(errors.INTERNAL_SERVER_ERROR);
};

export const unprocessableEntityError = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  next(errors.UNPROCESSABLE_ENTITY);
};

export const invalidCredentialsError = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  next(errors.INVALID_CREDENTIALS);
};