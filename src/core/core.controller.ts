/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  Controller,
  Get,
  Res,
  HttpStatus,
  Body,
  Query,
  Param,
  Post,
  Put,
} from "@nestjs/common";
import { ErrorService } from "common/ErrorModule";

import { Response } from "express";

import { CoreService } from "./core.service";

@Controller()
export class CoreController {
  constructor(
    private readonly coreService: CoreService,
    private readonly errorService: ErrorService
  ) {}

  @Get("/route-autocomplete")
  async getRouteAutocomplete(
    @Query() query: Record<string, any>,
    @Res() res: Response
  ): Promise<Response<any, Record<string, any>>> {
    try {
      const data = await this.coreService.getRouteAutocomplete(query);
      return res.status(HttpStatus.OK).send(data);
    } catch (error) {
      const { message, statusCode } = this.errorService.handle(error);
      return res.status(statusCode).send(message);
    }
  }

  @Post("/route")
  async postRoute(
    @Body() body: Record<string, any>,
    @Res() res: Response
  ): Promise<Response<any, Record<string, any>>> {
    try {
      const data = await this.coreService.postRoute(body);
      return res.status(HttpStatus.OK).send(data);
    } catch (error) {
      const { message, statusCode } = this.errorService.handle(error);
      return res.status(statusCode).send(message);
    }
  }

  @Put("/landmark")
  async putLandmark(
    @Body() body: Record<string, any>,
    @Res() res: Response
  ): Promise<Response<any, Record<string, any>>> {
    try {
      const data = await this.coreService.putLandmark(body);
      return res.status(HttpStatus.OK).send(data);
    } catch (error) {
      const { message, statusCode } = this.errorService.handle(error);
      return res.status(statusCode).send(message);
    }
  }

  @Get("/landmarks")
  async getLandmarks(
    @Query() query: Record<string, any>,
    @Res() res: Response
  ): Promise<Response<any, Record<string, any>>> {
    try {
      const data = await this.coreService.getLandmarks(query);
      return res.status(HttpStatus.OK).send(data);
    } catch (error) {
      const { message, statusCode } = this.errorService.handle(error);
      return res.status(statusCode).send(message);
    }
  }

  @Get("/landmark/:x/:y")
  async getLandmark(
    @Param("x") x: string,
    @Param("y") y: string,
    @Res() res: Response
  ): Promise<Response<any, Record<string, any>>> {
    try {
      const data = await this.coreService.getLandmark(x, y);
      return res.status(HttpStatus.OK).send(data);
    } catch (error) {
      const { message, statusCode } = this.errorService.handle(error);
      return res.status(statusCode).send(message);
    }
  }

  @Post("/packet")
  async postPacket(
    @Body() body: Record<string, any>,
    @Res() res: Response
  ): Promise<Response<any, Record<string, any>>> {
    try {
      const data = await this.coreService.postPacket(body);
      return res.status(HttpStatus.OK).send(data);
    } catch (error) {
      const { message, statusCode } = this.errorService.handle(error);
      return res.status(statusCode).send(message);
    }
  }

  @Get("/packets")
  async getPackets(
    @Query() query: Record<string, any>,
    @Res() res: Response
  ): Promise<Response<any, Record<string, any>>> {
    try {
      const data = await this.coreService.getPackets(query);
      return res.status(HttpStatus.OK).send(data);
    } catch (error) {
      const { message, statusCode } = this.errorService.handle(error);
      return res.status(statusCode).send(message);
    }
  }

  @Get("/packet/:id")
  async getPacket(
    @Param("id") id: string,
    @Res() res: Response
  ): Promise<Response<any, Record<string, any>>> {
    try {
      const data = await this.coreService.getPacket(id);
      return res.status(HttpStatus.OK).send(data);
    } catch (error) {
      const { message, statusCode } = this.errorService.handle(error);
      return res.status(statusCode).send(message);
    }
  }
}
