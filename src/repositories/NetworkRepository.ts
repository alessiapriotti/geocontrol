import { AppDataSource } from "@database";
import { Not, Repository } from "typeorm";
import { NetworkDAO } from "@dao/NetworkDAO";
import { findOrThrowNotFound, throwConflictIfFound } from "@utils";

export class NetworkRepository {
  private repo: Repository<NetworkDAO>;

  constructor() {
    this.repo = AppDataSource.getRepository(NetworkDAO);
  }

  getAllNetwork(): Promise<NetworkDAO[]> {
    return this.repo.find();
  }

  async getNetworkByCode(code: string): Promise<NetworkDAO> {
    return findOrThrowNotFound(
      await this.repo.find({ where: { code } }),
      () => true,
      `Network with code '${code}' not found`
    );
  }

  async createNetwork(
    code: string,
    name: string,
    description: string
  ): Promise<NetworkDAO> {
    throwConflictIfFound(
      await this.repo.find({ where: { code } }),
      () => true,
      `Network with code '${code}' already exists`
    );

    if (!name) name = "";
    if (!description) description = "";

    return this.repo.save({
      code: code,
      name: name,
      description: description,
    });
  }

  async updateNetwork(
    networkCode: string,
    code: string,
    name: string,
    description: string
  ): Promise<void> {
    findOrThrowNotFound(
      await this.repo.find({ where: { code: networkCode } }),
      () => true,
      `Network with code '${networkCode}' not found`
    );
    if (networkCode !== code) {
      throwConflictIfFound(
        await this.repo.find({ where: { code } }),
        () => true,
        `Network with code '${code}' already exists`
      );
    }

    await this.repo.update({ code: networkCode }, { code, name, description });
  }

  async deleteNetwork(code: string): Promise<void> {
    await this.repo.remove(await this.getNetworkByCode(code));
  }
}
