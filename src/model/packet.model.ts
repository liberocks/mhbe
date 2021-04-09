import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";

@Schema({ collection: "Packet", versionKey: false })
export class PacketModel extends Document {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  SKUCode: string;

  @Prop({ required: true })
  inboundDate: Date;

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
PacketSchema.plugin(mongoosePaginate);
