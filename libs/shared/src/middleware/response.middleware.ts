import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class FormatResponseMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const oldJson = res.json;

    res.json = (body: any) => {
      let formattedResponse;
      if (res.locals.error) {
        formattedResponse = {
          success: false,
          code: res.statusCode,
          data: null,
          error: res.locals.error,
        };
      } else {
        formattedResponse = {
          success: true,
          code: res.statusCode,
          data: body || {},
          error: null,
        };
      }

      res.json = oldJson;
      return res.json(formattedResponse);
    };

    next();
  }
}
