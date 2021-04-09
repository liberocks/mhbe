import { HttpException, HttpStatus, Injectable } from '@nestjs/common';

type ErrorInstance = HttpException | Error;

@Injectable()
export class ErrorService {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  handle(error: ErrorInstance): Record<string, any> {
    const message = error.message || '';
    let statusCode = HttpStatus.BAD_REQUEST;

    if (error instanceof HttpException) {
      statusCode = error.getStatus();
    }
    return { message, statusCode };
  }
}
