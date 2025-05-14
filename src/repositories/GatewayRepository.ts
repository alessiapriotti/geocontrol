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

  async getAllGateway(networkCode: string): Promise<GatewayDAO[]> {

    findOrThrowNotFound(
      await AppDataSource.getRepository(NetworkDAO).find({
      where: { code: networkCode },}),
        () => true,
      `Network with code '${networkCode}' not found`
    );

    return this.repo.find({
      where: { network: { code: networkCode } }});
  }
  
  async getGatewayByMacAddress(macAddress: string, networkCode: string): Promise<GatewayDAO> {

    findOrThrowNotFound(
      await AppDataSource.getRepository(NetworkDAO).find({
      where: { code: networkCode }}),
       () => true,
      `Network with code '${networkCode}' not found`
    );

    return findOrThrowNotFound(
      await this.repo.find({ where: { macAddress} }),
      () => true,
      `Gateway with macAddress '${macAddress}' not found`
    );
    
  }

  async updateGateway(
    networkCode: string,
    currentMacAddress: string,
    macAddress: string,
    name: string,
    description: string
    ): Promise<void> {
    throwConflictIfFound(
      await this.repo.find({ where: {macAddress: currentMacAddress, network: {code: networkCode}} }),
      (c) => c.macAddress !== macAddress,
      `Network with code '${networkCode}' not found`
    );
    if (currentMacAddress !== macAddress) {
      throwConflictIfFound(
        await this.repo.find({ where: { macAddress } }),
        (c) => c.macAddress === macAddress,
        `Network with macAddress '${macAddress}' already exists`
      );
    }
    await this.repo.update({ macAddress: currentMacAddress }, { macAddress, name, description });
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

  async deleteGateway(macAddress: string, networkCode: string): Promise<void> {
    await this.repo.remove(await this.getGatewayByMacAddress(macAddress, networkCode));
  }
}
