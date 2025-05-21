import { AppDataSource } from "@database";
import { Between, In, Not, Repository } from "typeorm";
import { MeasurementDAO } from "@models/dao/MeasurementDAO";
import { NetworkDAO } from "@models/dao/NetworkDAO";
import { GatewayDAO } from "@models/dao/GatewayDAO";
import { SensorDAO } from "@models/dao/SensorDAO";
import { findOrThrowNotFound, throwConflictIfFound } from "@utils";

export class MeasurementRepository {
  private repo: Repository<MeasurementDAO>;

  constructor() {
    this.repo = AppDataSource.getRepository(MeasurementDAO);
  }

  getAllMeasurement(): Promise<MeasurementDAO[]> {
    return this.repo.find();
  }

  //TODO: Refactor according to new position of calls.
  async createMeasurement(
    timestamp: Date,
    value: number,
    sensor: SensorDAO
  ): Promise<MeasurementDAO> {
    return this.repo.save({
        createdAt: timestamp,
        value: value,
        sensor: sensor
    });
  }
}
