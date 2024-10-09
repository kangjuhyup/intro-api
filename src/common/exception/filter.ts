import { ArgumentsHost, Catch, ExceptionFilter, Logger } from '@nestjs/common';
import { Response } from 'express';

@Catch()
export class BaseExceptionFilter implements ExceptionFilter {
  private logger = new Logger(BaseExceptionFilter.name);

  catch(error: any, host: ArgumentsHost) {
    this.logger.error(error);
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const status = error.status;
    if (status >= 400 && status < 500) {
      response.status(status).send({ result: false, error: error.response });
    } else {
      response.send({
        result: false,
        error: {
          code: 500,
          message: '알 수 없는 에러가 발생했습니다. 관리자에게 문의하세요.',
        },
      });
    }
  }
}
