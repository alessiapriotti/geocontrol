import { AppDataSource } from "@database";
import { Repository } from "typeorm";
import { findOrThrowNotFound, throwConflictIfFound } from "@utils";
import { GatewayDAO } from "@models/dao/GatewayDAO";
import { NetworkDAO } from "@models/dao/NetworkDAO";

export class GatewayRepository {
  private repo: Repository<GatewayDAO>;

  constructor() {
    this.repo = AppDataSource.getRepository(GatewayDAO);
  }

  async getAllGateway(networkCode: string): Promise<GatewayDAO[]> {

    return this.repo.find({
      where: { network: { code: networkCode } }});
  }
  
  async getGatewayByMacAddress(networkCode: string, macAddress: string): Promise<GatewayDAO> {
    
    return findOrThrowNotFound(
      await this.repo.find({ where: { macAddress, network: {code: networkCode}} }),
      () => true,
      `Gateway with macAddress '${macAddress}' not found`
    );
    
  }

  async updateGateway(
    currentMacAddress: string,
    macAddress?: string,
    name?: string,
    description?: string
    ): Promise<void> {

    if ((macAddress!==undefined)&&currentMacAddress !== macAddress) {
      throwConflictIfFound(
        await this.repo.find({ where: { macAddress } }),
        (c) => c.macAddress === macAddress,
        `Network with macAddress '${macAddress}' already exists`
      );
    }
    await this.repo.update({ macAddress: currentMacAddress}, { macAddress, name, description });
  }

  async createGateway(
    macAddress: string,
    name: string,
    description: string,
    networkDAO: NetworkDAO
  ): Promise<GatewayDAO> {
    throwConflictIfFound(
      await this.repo.find({ where: { macAddress } }),
      () => true,
      `Gateway with code '${macAddress}' already exists`
    );

    return this.repo.save({
      macAddress,
      name,
      description,
      network: networkDAO
    });
  }

  async deleteGateway(macAddress: string, networkCode: string): Promise<void> {
    await this.repo.remove(await this.getGatewayByMacAddress(networkCode, macAddress));
  }

  //Retrieve a specific gateway from all database
  async getGateway(gatewayMac:string): Promise<void> {
    throwConflictIfFound(
        await this.repo.find({  where: { macAddress:gatewayMac}  }),
        () => true,
        `Gateway with macAddress '${gatewayMac}' already exists`
      );
  }
}
