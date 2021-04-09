import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";

import { ErrorModule } from "common/ErrorModule";
import { LandmarkModel, LandmarkSchema } from "model/landmark.model";
import { PacketModel, PacketSchema } from "model/packet.model";
import { LandmarkRepository } from "repository/landmark.repository";
import { PacketRepository } from "repository/packet.repository";
import { CoreController } from "./core.controller";
import { CoreService } from "./core.service";

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: PacketModel.name, schema: PacketSchema },
      { name: LandmarkModel.name, schema: LandmarkSchema },
    ]),
    ErrorModule,
  ],
  controllers: [CoreController],
  providers: [CoreService, LandmarkRepository, PacketRepository],
})
export class CoreModule {}
