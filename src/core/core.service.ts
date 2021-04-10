import { Injectable } from "@nestjs/common";
import { LandmarkRepository } from "repository/landmark.repository";
import { PacketRepository } from "repository/packet.repository";
import ndarray from "ndarray";
import createPlanner from "l1-path-finder";
import "lodash.permutations";
import _ from "lodash";
import { customAlphabet as nanoid } from "nanoid";
import { HEX_ALPHA_NUMERIC } from "constants/definition.constant";
import { LandmarkModel } from "model/landmark.model";

let findMin = (a: any[], f: string) =>
  a.reduce((m, x) => (m[f] < x[f] ? m : x));

@Injectable()
export class CoreService {
  constructor(
    private readonly landmarkRepository: LandmarkRepository,
    private readonly packetRepository: PacketRepository
  ) {}

  async getRouteAutocomplete(query: Record<string, any>): Promise<any> {
    const { keyword, page, page_size } = query;

    const packets = await this.packetRepository.paginate(
      {
        $or: [{ SKUCode: { $regex: keyword } }, { name: { $regex: keyword } }],
      },
      page,
      page_size
    );

    return packets;
  }

  async collectAllLandmarks(
    page_size: number,
    maximum_x: number,
    maximum_y: number,
    condition: any = { type: "wall" }
  ) {
    let landmarks: any[] = [];

    let landmarkIter = await this.landmarkRepository.paginate(
      { ...condition, x: { $lte: maximum_x }, y: { $lte: maximum_y } },
      1,
      page_size
    );
    landmarks.push(...landmarkIter.docs);
    const totalPages = landmarkIter.totalPages;

    for (const page of Array.from({ length: totalPages }, (_, i) => i + 2)) {
      landmarkIter = await this.landmarkRepository.paginate(
        { ...condition, x: { $lte: maximum_x }, y: { $lte: maximum_y } },
        page,
        page_size
      );
      landmarks.push(...landmarkIter.docs);
    }

    return [
      ...new Set(
        landmarks.map((landmark) => ({
          x: landmark.x,
          y: landmark.y,
          type: landmark.type,
        }))
      ),
    ];
  }

  constructMaze(
    landmarks: { x: number; y: number }[],
    shape_x: number,
    shape_y: number
  ) {
    const binaryLandmark: number[] = [];
    for (let j = 0; j < shape_y; j++) {
      for (let i = 0; i < shape_x; i++) {
        let isFound = false;
        for (const landmark of landmarks) {
          if (i === landmark.x && j === landmark.y) {
            isFound = true;
            break;
          }
        }

        if (isFound) binaryLandmark.push(1);
        else binaryLandmark.push(0);
      }
    }

    return ndarray(binaryLandmark, [shape_y, shape_x]);
  }

  async postRoute(body: Record<string, any>): Promise<any> {
    const {
      packet_ids = [],
      page_size = 50,
      maximum_x = 75,
      maximum_y = 75,
      shape_x = 75,
      shape_y = 75,
    } = body;
    const landmarks = await this.collectAllLandmarks(
      page_size,
      maximum_x,
      maximum_y
    );

    let maze = this.constructMaze(landmarks, shape_x, shape_y);

    const packets: any[] = [];
    for (const packet_id of [...new Set(packet_ids)]) {
      const packet = await this.packetRepository.findById(packet_id);
      if (packet) packets.push(packet);
    }

    const coordinatePacketIds = packets.map((packet) => ({
      id: packet._id,
      x: packet.x,
      y: packet.y,
    }));
    const packetsPermutation = (_ as any).permutations(
      coordinatePacketIds,
      coordinatePacketIds.length
    );

    const result: any = { alternatives: [], best: {} };
    const planner = createPlanner(maze);
    for (const permutation of packetsPermutation) {
      const resultCandidate = {
        points: [permutation[0]],
        distances: [] as number[],
        totalDistance: 0,
        route: [],
        key: nanoid(HEX_ALPHA_NUMERIC, 16)(),
      };

      for (let i = 0; i < permutation.length - 1; i++) {
        const startPoint = permutation[i];
        const destinationPoint = permutation[i + 1];

        let route = [];
        const distance = planner.search(
          startPoint.y,
          startPoint.x,
          destinationPoint.y,
          destinationPoint.x,
          route
        );

        resultCandidate.points.push(destinationPoint);
        resultCandidate.distances.push(distance);
        resultCandidate.totalDistance += distance;
        resultCandidate.route.push(...route);
      }

      result.alternatives.push(resultCandidate);
    }

    result.best = findMin(result.alternatives, "totalDistance");
    result.alternatives = result.alternatives.filter(
      (alternative: any) => alternative.key !== result.best.key
    );

    return result;
  }

  async putLandmark(body: Record<string, any>): Promise<any> {
    const { x, y, type, capacity } = body;
    let landmark = await this.landmarkRepository.findOne({ x, y });
    if (landmark) {
      landmark.x = x;
      landmark.y = y;
      landmark.type = type;
      landmark.capacity = capacity;
      await landmark.save();
    } else {
      landmark = await this.landmarkRepository
        .create({ x, y, type, capacity })
        .save();
    }

    this.landmarkRepository.deleteMany({ type: null });

    return landmark?.toJSON();
  }

  async getLandmarks(query: Record<string, any>): Promise<any> {
    const { page_size = 50, maximum_x = 75, maximum_y = 75 } = query;

    const landmarks = await this.collectAllLandmarks(
      page_size,
      maximum_x,
      maximum_y,
      { type: { $in: ["wall", "rack"] } }
    );

    return landmarks;
  }

  async getLandmark(x: string, y: string): Promise<any> {
    const landmark = await this.landmarkRepository.findOne({
      x: parseInt(x),
      y: parseInt(y),
    });

    if (!landmark) {
      return { x: parseInt(x), y: parseInt(y), type: null };
    }

    return landmark?.toJSON();
  }

  async postPacket(body: Record<string, any>): Promise<any> {
    const {
      stock,
      name,
      SKUCode,
      page_size = 50,
      maximum_x = 75,
      maximum_y = 75,
      shape_x = 75,
      shape_y = 75,
    } = body;

    const nonWall = await this.collectAllLandmarks(
      page_size,
      maximum_x,
      maximum_y
    );

    let maze = this.constructMaze(nonWall, shape_x, shape_y);

    const rackCandidates = await this.landmarkRepository
      .find({ type: "rack" })
      .sort({ capacity: 1 });

    if (!rackCandidates || rackCandidates.length === 0) {
      throw new Error("No rack is available");
    }

    let racks: any[] = [];
    let totalCapacity = 0;
    for (const rackCandidate of rackCandidates) {
      totalCapacity += rackCandidate.capacity;
      racks.push(rackCandidate);
      if (totalCapacity > stock) break;
    }

    if (totalCapacity < stock) {
      throw new Error("No more rack space is available");
    }

    const racksIds = racks.map((landmark) => ({
      id: landmark._id,
      x: landmark.x,
      y: landmark.y,
    }));
    const racksPermutation = (_ as any).permutations(racksIds, racksIds.length);

    const routeResult: any = { alternatives: [], best: {} };
    const planner = createPlanner(maze);
    for (const permutation of racksPermutation) {
      const resultCandidate = {
        points: [permutation[0]],
        distances: [] as number[],
        totalDistance: 0,
        route: [],
        key: nanoid(HEX_ALPHA_NUMERIC, 16)(),
      };

      for (let i = 0; i < permutation.length - 1; i++) {
        const startPoint = permutation[i];
        const destinationPoint = permutation[i + 1];

        let route = [];
        const distance = planner.search(
          startPoint.y,
          startPoint.x,
          destinationPoint.y,
          destinationPoint.x,
          route
        );

        resultCandidate.points.push(destinationPoint);
        resultCandidate.distances.push(distance);
        resultCandidate.totalDistance += distance;
        resultCandidate.route.push(...route);
      }

      routeResult.alternatives.push(resultCandidate);
    }

    routeResult.best = findMin(routeResult.alternatives, "totalDistance");
    routeResult.alternatives = routeResult.alternatives.filter(
      (alternative: any) => alternative.key !== routeResult.best.key
    );

    let stockRemaining = stock;
    const newPackets: any[] = [];
    for (const rackCandidate of rackCandidates) {
      const rack = (await this.landmarkRepository.findById(
        rackCandidate.id
      )) as LandmarkModel;

      let assignedStock = 0;
      if (stockRemaining > rack.capacity) {
        assignedStock += rack.capacity;
        stockRemaining -= rack.capacity;
        rack.capacity = 0;
      } else {
        assignedStock += stockRemaining;
        rack.capacity -= stockRemaining;
        stockRemaining = 0;
      }

      if (assignedStock > 0) {
        const packet = await this.packetRepository
          .create({
            name,
            SKUCode,
            stock: assignedStock,
            x: rack.x,
            y: rack.y,
          })
          .save();
        newPackets.push(packet);
      }

      await rack.save();
    }

    this.packetRepository.deleteMany({ stock: 0 });

    return { ...routeResult, newPackets };
  }

  async getPackets(query: Record<string, any>): Promise<any> {
    const { page, page_size, ...condition } = query;
    const packets = await this.packetRepository.paginate(
      { ...condition, stock: { $gt: 0 } },
      page,
      page_size
    );

    return packets;
  }

  async getPacket(id: string): Promise<any> {
    const packet = await this.packetRepository.findById(id);
    return packet?.toJSON();
  }
}
