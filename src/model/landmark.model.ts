import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";

@Schema({ collection: "Landmark", versionKey: false })
export class LandmarkModel extends Document {
  @Prop({ required: true })
  x: number;

  @Prop({ required: true })
  y: number;

  @Prop()
  type: string;

  @Prop()
  createdAt: Date;

  @Prop()
  updatedAt: Date;
}

export type PartialLandmarkModel = Partial<LandmarkModel>;

export const LandmarkSchema = SchemaFactory.createForClass(LandmarkModel);
LandmarkSchema.plugin(mongoosePaginate);
