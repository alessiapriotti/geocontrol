import { AppDataSource } from "@database";
import { Repository } from "typeorm";
import { MeasurementDAO } from "@models/dao/MeasurementDAO";
import { SensorDAO } from "@models/dao/SensorDAO";

export class MeasurementRepository {
  private repo: Repository<MeasurementDAO>;

  constructor() {
    this.repo = AppDataSource.getRepository(MeasurementDAO);
  }

  getAllMeasurement(): Promise<MeasurementDAO[]> {
    return this.repo.find();
  }

  async createMeasurement(
    timestamp: Date,
    value: number,
    sensor: SensorDAO
  ): Promise<MeasurementDAO> {
    return this.repo.save({
      createdAt: timestamp,
      value: value,
      sensor: sensor,
    });
  }
}
