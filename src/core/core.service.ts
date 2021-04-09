import { Injectable } from "@nestjs/common";
import { LandmarkRepository } from "repository/landmark.repository";
import { PacketRepository } from "repository/packet.repository";

@Injectable()
export class CoreService {
  constructor(
    private readonly landmarkRepository: LandmarkRepository,
    private readonly packetRepository: PacketRepository
  ) {}

  async getRouteAutocomplete(query: Record<string, any>): Promise<any> {}
  async postRoute(body: Record<string, any>): Promise<any> {}
  async putLandmark(body: Record<string, any>): Promise<any> {}
  async getLandmarks(query: Record<string, any>): Promise<any> {}
  async getLandmark(x: string, y: string): Promise<any> {}

  async postPacket(body: Record<string, any>): Promise<any> {
    const packet = await this.packetRepository.create(body).save();
    return { success: true, packet: packet.toJSON() };
  }
  async getPackets(query: Record<string, any>): Promise<any> {}
  async getPacket(id: string): Promise<any> {
    const packet = await this.packetRepository.findById(id);
    return packet?.toJSON();
  }
}
