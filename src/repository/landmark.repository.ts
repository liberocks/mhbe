import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";

import { LandmarkModel } from "model/landmark.model";
import mongoose, { Query, Model, PaginateModel } from "mongoose";

type PaginatedModel<T extends mongoose.Document> = PaginateModel<T>;

@Injectable()
export class LandmarkRepository {
  constructor(
    @InjectModel(LandmarkModel.name)
    private readonly landmarkModel: Model<LandmarkModel>
  ) {}
  // Generic
  create(doc: Record<string, unknown>): LandmarkModel {
    return new this.landmarkModel({
      ...doc,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  }

  find(
    condition: Record<string, unknown>,
    select?: Record<string, unknown>
  ): Query<LandmarkModel[] | null, LandmarkModel, unknown> {
    return this.landmarkModel.find(condition).select(select);
  }

  findOne(
    condition: Record<string, unknown>,
    select?: Record<string, unknown>
  ): Query<LandmarkModel | null, LandmarkModel, unknown> {
    return this.landmarkModel.findOne(condition).select(select);
  }

  findById(
    id: unknown,
    select?: Record<string, unknown>
  ): Query<LandmarkModel | null, LandmarkModel, unknown> {
    return this.landmarkModel.findById(id).select(select);
  }

  paginate(query: Record<string, any> = {}, page = 1, limit = 10) {
    return (this.landmarkModel as PaginatedModel<LandmarkModel>).paginate(
      query,
      {
        page,
        limit,
      }
    );
  }
}
