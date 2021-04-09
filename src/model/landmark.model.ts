import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";

@Schema({ collection: "Landmark", versionKey: false })
export class LandmarkModel extends Document {
  @Prop({ required: true })
  x: number;

  @Prop({ required: true })
  y: number;

  @Prop({ required: true })
  type: string;

  @Prop()
  createdAt: Date;

  @Prop()
  updatedAt: Date;
}

export type PartialLandmarkModel = Partial<LandmarkModel>;

export const LandmarkSchema = SchemaFactory.createForClass(LandmarkModel);
