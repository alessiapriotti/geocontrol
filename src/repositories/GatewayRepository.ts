import { AppDataSource } from "@database";
import { getRepository, Repository } from "typeorm";
import { findOrThrowNotFound, throwConflictIfFound } from "@utils";
import { GatewayDAO } from "@models/dao/GatewayDAO";
import { NetworkDAO } from "@models/dao/NetworkDAO";

export class GatewayRepository {
  private repo: Repository<GatewayDAO>;

  constructor() {
    this.repo = AppDataSource.getRepository(GatewayDAO);
  }

  getAllGateway(): Promise<GatewayDAO[]> {
    return this.repo.find();
  }
  
  async getGatewayByMacAddress(macAddress: string): Promise<GatewayDAO> {
    return findOrThrowNotFound(
      await this.repo.find({ where: { macAddress } }),
      () => true,
      `Gateway with macAddress '${macAddress}' not found`
    );
  }

  async createGateway(
    macAddress: string,
    name: string,
    description: string,
    networkId: string
  ): Promise<GatewayDAO> {
    throwConflictIfFound(
      await this.repo.find({ where: { macAddress } }),
      () => true,
      `Gateway with code '${macAddress}' already exists`
    );

    const network = await AppDataSource.getRepository(NetworkDAO).findOne({
      where: { code: networkId },
    });

    if (!network) {
      throw new Error(`Network with id '${networkId}' not found`);
    }

    return this.repo.save({
      macAddress,
      name,
      description,
      network: network
    });
  }

  async deleteGateway(macAddress: string): Promise<void> {
    await this.repo.remove(await this.getGatewayByMacAddress(macAddress));
  }
}
