import { AppDataSource } from "@database";
import { Repository } from "typeorm";
import { SensorDAO } from "@dao/SensorDAO";
import { findOrThrowNotFound, throwConflictIfFound } from "@utils";

export class SensorRepository {
  private repo: Repository<SensorDAO>;

  constructor() {
    this.repo = AppDataSource.getRepository(SensorDAO);
  }

  /*getAllUsers(): Promise<SensorDAO[]> {
    return this.repo.find();
  }

  async getUserByUsername(username: string): Promise<SensorDAO> {
    return findOrThrowNotFound(
      await this.repo.find({ where: { username } }),
      () => true,
      `User with username '${username}' not found`
    );
  }*/

  async createSensor(
    macAddress: string,
    name: string,
    description: string,
    variable: string,
    unit: string
  ): Promise<SensorDAO> {
    throwConflictIfFound(
      await this.repo.find({ where: { macAddress } }),
      () => true,
      `User with username '${macAddress}' already exists`
    );

    return this.repo.save({
        macAddress: macAddress,
        name: name,
        description: description,
        variable: variable,
        unit: unit,
    });
  }

  /*async deleteUser(username: string): Promise<void> {
    await this.repo.remove(await this.getUserByUsername(username));
  }*/
}
