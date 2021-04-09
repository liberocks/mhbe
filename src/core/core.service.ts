import { Injectable } from "@nestjs/common";
import { LandmarkRepository } from "repository/landmark.repository";
import { PacketRepository } from "repository/packet.repository";

function escapeRegex(text: string) {
  return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
}
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
  async postRoute(body: Record<string, any>): Promise<any> {}

  async putLandmark(body: Record<string, any>): Promise<any> {
    const { x, y, type } = body;
    let landmark = await this.landmarkRepository.findOne({ x, y });
    if (landmark) {
      landmark.x = x;
      landmark.y = y;
      landmark.type = type;
      await landmark.save();
    } else {
      landmark = await this.landmarkRepository.create({ x, y, type }).save();
    }

    return landmark?.toJSON();
  }

  async getLandmarks(query: Record<string, any>): Promise<any> {
    const { page, page_size, ...condition } = query;
    const landmarks = await this.landmarkRepository.paginate(
      condition,
      page,
      page_size
    );

    return landmarks;
  }

  async getLandmark(x: string, y: string): Promise<any> {
    const landmark = await this.landmarkRepository.findOne({
      x: parseInt(x),
      y: parseInt(y),
    });

    return landmark?.toJSON();
  }

  async postPacket(body: Record<string, any>): Promise<any> {
    const packet = await this.packetRepository.create(body).save();
    return { success: true, packet: packet.toJSON() };
  }

  async getPackets(query: Record<string, any>): Promise<any> {
    const { page, page_size, ...condition } = query;
    const packets = await this.packetRepository.paginate(
      condition,
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
