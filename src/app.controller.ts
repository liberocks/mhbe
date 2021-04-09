/* eslint-disable @typescript-eslint/no-explicit-any */
import { Controller, Get, Res, HttpStatus, Headers, Ip } from "@nestjs/common";
import { ErrorService } from "common/ErrorModule";

import { Response } from "express";

import { AppService } from "./app.service";

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly errorService: ErrorService
  ) {}

  @Get("/ruok")
  ruok(@Res() res: Response): Response<any> {
    try {
      const data = this.appService.ruok();

      return res.status(HttpStatus.OK).send(data);
    } catch (error) {
      const { message, statusCode } = this.errorService.handle(error);
      return res.status(statusCode).send(message);
    }
  }
}
