import { AppDataSource } from "@database";
import { Repository } from "typeorm";
import { SensorDAO } from "@dao/SensorDAO";
import { GatewayDAO } from "@dao/GatewayDAO";
import { findOrThrowNotFound, throwConflictIfFound } from "@utils";

export class SensorRepository {
  private repo: Repository<SensorDAO>;

  constructor() {
    this.repo = AppDataSource.getRepository(SensorDAO);
  }

  // Retrieve all sensors of a gateway
  async getAllSensors(networkCode: string, gatewayMac: string): Promise<SensorDAO[]> {    
    return (await this.repo.find({ where: {gateway:{macAddress:gatewayMac,network:{code:networkCode}}} }));
  }


  // Retrieve a specific sensor
  async getSensorByMacAddress(networkCode: string, gatewayMac: string, sensorMac: string): Promise<SensorDAO> {
    
    return findOrThrowNotFound(
      await this.repo.find({ where: { macAddress:sensorMac ,gateway:{macAddress:gatewayMac,network:{code:networkCode}}} }),
      () => true,
      `Sensor with macAddress '${sensorMac}' not found`
    );
  }

  // Create a new sensor for a gateway
  async createSensor(
    macAddress: string,
    name: string,
    description: string,
    variable: string,
    unit: string,
    gateway: GatewayDAO
  ): Promise<SensorDAO> {
    return this.repo.save({
        macAddress: macAddress,
        name: name,
        description: description,
        variable: variable,
        unit: unit,
        gateway: gateway
    });
  }

  // Update a sensor
  async updateSensor(
    sensorMac: string,
    newMacAddress?: string,
    name?: string,
    description?: string,
    variable?: string,
    unit?: string
  ): Promise<void> {
    await this.repo.update({ macAddress:sensorMac }, { macAddress:newMacAddress, name, description,variable,unit });
  }

  // Delete a sensor
  async deleteSensor(networkCode: string, gatewayMac: string, sensorMac: string): Promise<void> {
    await this.repo.remove(await this.getSensorByMacAddress(networkCode,gatewayMac,sensorMac));
  }

  // Retrieve a specific sensor from all database
  async getSensor(sensorMac: string): Promise<void> {
    throwConflictIfFound(
      await this.repo.find({  where: { macAddress:sensorMac}  }),
      () => true,
      `Sensor with macAddress '${sensorMac}' already exists`
    );
  }
}