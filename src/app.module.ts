import { MiddlewareConsumer, Module, NestModule } from "@nestjs/common";

import ConfigModule from "common/ConfigModule";
import { ErrorModule } from "common/ErrorModule";
import LoggerMiddleware from "common/LoggerMiddleware";
import MongooseModule from "common/MongooseModule";
import { CoreModule } from "core";

import { AppController } from "./app.controller";
import { AppService } from "./app.service";

@Module({
  imports: [ConfigModule, MongooseModule, ErrorModule, CoreModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer): void {
    consumer.apply(LoggerMiddleware).forRoutes("*");
  }
}
