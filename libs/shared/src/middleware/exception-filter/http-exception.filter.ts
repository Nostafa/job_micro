import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
  ServiceUnavailableException,
} from '@nestjs/common';
import { Request, Response } from 'express';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(HttpExceptionFilter.name);

  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const sendResponse = (
      status: HttpStatus,
      message: string,
      error: object | string,
    ) => {
      return response.status(status).json({
        timestamps: new Date().toISOString(),
        path: request.url,
        message,
        statusCode: status,
        ...(typeof error === 'string' ? { error } : error),
      });
    };

    try {
      const error: object | string = exception.getResponse();

      const exceptionMessage =
        exception?.message ??
        exception?.toString() ??
        'Unexpected error when logging';

      switch (true) {
        case exception instanceof ServiceUnavailableException:
          return sendResponse(
            HttpStatus.SERVICE_UNAVAILABLE,
            exceptionMessage,
            error,
          );
        case exception instanceof HttpException: {
          return sendResponse(
            exception.getStatus(),
            typeof error === 'string' ? error : error['message'],
            error,
          );
        }
        case typeof error === 'string': {
          const responseMessage: string = error['message'];
          return sendResponse(
            HttpStatus.INTERNAL_SERVER_ERROR,
            responseMessage,
            error,
          );
        }
        default: {
          const responseMessage: string = error['message'];
          const statusCode = error
            ? error['statusCode'] ?? error['status']
            : HttpStatus.INTERNAL_SERVER_ERROR;
          return sendResponse(statusCode, responseMessage, error);
        }
      }
    } catch (error) {
      return sendResponse(HttpStatus.INTERNAL_SERVER_ERROR, error, error);
    }
  }
}
