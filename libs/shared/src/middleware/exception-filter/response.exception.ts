import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
} from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { Response } from 'express';

@Catch()
export class ResponseExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    let status: number;
    let error: string | object;
    if (exception instanceof HttpException) {
      status = exception.getStatus();
      error = exception.getResponse();
    } else if (exception instanceof RpcException) {
      console.log(exception);
      if (exception.getError()) {
        status = exception.getError()['statusCode'];
        error = exception.getError()['message'];
      } else {
        status = 500;
        error = {
          error: 'internal server error',
          statusCode: 500,
        };
      }
    } else {
      status = 500;
      error = {
        error: 'internal server error',
        statusCode: 500,
      };
    }

    response.locals.error = error;

    response.status(status).json({
      success: false,
      code: status,
      data: null,
      error,
    });
  }
}
