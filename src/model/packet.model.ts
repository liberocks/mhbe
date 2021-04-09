import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";

@Schema({ collection: "Packet", versionKey: false })
export class PacketModel extends Document {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  SKUCode: string;

  @Prop({ required: true })
  expiredIn: number;

  @Prop({ required: true })
  stock: number;
  @Prop({ required: true })
  x: number;

  @Prop({ required: true })
  y: number;

  @Prop()
  createdAt: Date;

  @Prop()
  updatedAt: Date;
}

export type PartialPacketModel = Partial<PacketModel>;

export const PacketSchema = SchemaFactory.createForClass(PacketModel);
