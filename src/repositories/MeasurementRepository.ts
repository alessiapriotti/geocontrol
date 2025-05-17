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
    code: string,
    gateway: string,
    sensor: string,
    timestamp: Date,
    value: number
  ): Promise<MeasurementDAO> {
    findOrThrowNotFound(
      [ await AppDataSource.getRepository(NetworkDAO).findOne( { where: { code } } ) ],
      (item) => item !== null,
      "Entity not found"
    )

    findOrThrowNotFound(
      [ await AppDataSource.getRepository(GatewayDAO).findOne( { where: { macAddress: gateway } } ) ],
      (item) => item !== null,
      "Entity not found"
    )

    const sensorFound = findOrThrowNotFound(
      [ await AppDataSource.getRepository(SensorDAO).findOne( { where: { macAddress: sensor } } ) ],
      (item) => item !== null,
      "Entity not found"
    )
    
    return this.repo.save({
        createdAt: timestamp,
        value: value,
        sensor: sensorFound
    });
  }

  async getMeasurementsBySensorSet(
    sensors: SensorDAO[],
    startDate: Date,
    endDate: Date
  ): Promise<MeasurementDAO[]> {
    return this.repo.find({where: {
      createdAt: Between(startDate, endDate),
      sensor: In(sensors),
    }})
  }
}
