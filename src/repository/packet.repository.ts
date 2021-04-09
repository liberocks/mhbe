import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";

import { PacketModel } from "model/packet.model";
import { Query, Model } from "mongoose";

@Injectable()
export class PacketRepository {
  constructor(
    @InjectModel(PacketModel.name)
    private readonly packetModel: Model<PacketModel>
  ) {}
  // Generic
  create(doc: Record<string, unknown>): PacketModel {
    return new this.packetModel({
      ...doc,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  }

  find(
    condition: Record<string, unknown>,
    select?: Record<string, unknown>
  ): Query<PacketModel[] | null, PacketModel, unknown> {
    return this.packetModel.find(condition).select(select);
  }

  findOne(
    condition: Record<string, unknown>,
    select?: Record<string, unknown>
  ): Query<PacketModel | null, PacketModel, unknown> {
    return this.packetModel.findOne(condition).select(select);
  }

  findById(
    id: unknown,
    select?: Record<string, unknown>
  ): Query<PacketModel | null, PacketModel, unknown> {
    return this.packetModel.findById(id).select(select);
  }
}
