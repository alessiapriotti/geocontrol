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
    // Validate the parameters
    if (!timestamp) {
      throw new Error("Timestamp cannot be null or undefined");
    }

    if (timestamp > new Date()) {
      throw new Error("Measurement timestamp cannot be in the future");
    }

    if (value === null || value === undefined || isNaN(value)) {
      throw new Error("Measurement value must be a valid number");
    }

    if (!sensor) {
      throw new Error("Sensor cannot be null or undefined");
    }

    return this.repo.save({
      createdAt: timestamp,
      value: value,
      sensor: sensor,
    });
  }
}
