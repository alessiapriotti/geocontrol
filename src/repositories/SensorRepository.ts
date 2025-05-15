import { AppDataSource } from "@database";
import { Repository } from "typeorm";
import { SensorDAO } from "@dao/SensorDAO";
import { GatewayRepository } from "@repositories/GatewayRepository";
import { findOrThrowNotFound, throwConflictIfFound } from "@utils";

export class SensorRepository {
  private repo: Repository<SensorDAO>;

  constructor() {
    this.repo = AppDataSource.getRepository(SensorDAO);
  }

//Retrieve all sensors of a gateway
 async getAllSensors(networkCode: string, gatewayMac: string): Promise<SensorDAO[]> {
    const gatewayRepo= new GatewayRepository();
    
    return (await gatewayRepo.getGatewayByMacAddress(networkCode,gatewayMac)).sensors;
    
  }


  //Retrieve a specific sensor
  async getSensorByMacAddress(networkCode: string, gatewayMac: string,sensorMac:string): Promise<SensorDAO> {
    const gatewayRepo= new GatewayRepository();
    await gatewayRepo.getGatewayByMacAddress(networkCode,gatewayMac);

    return findOrThrowNotFound(
      await this.repo.find({ where: { macAddress:sensorMac ,gateway:{macAddress:gatewayMac,network:{code:networkCode}}} }),
      () => true,
      `Sensor with macAddress '${sensorMac}' not found`
    );
  }

  //create a new sensor for a gateway
  async createSensor(
    networkCode: string,
    gatewayMac: string,
    macAddress: string,
    name: string,
    description: string,
    variable: string,
    unit: string
  ): Promise<SensorDAO> {

    const gatewayRepo= new GatewayRepository();

    throwConflictIfFound(
      await this.repo.find({ where: { macAddress } }),
      () => true,
      `Sensor with macAddress '${macAddress}' already exists`
    );

    const gateway=await gatewayRepo.getGatewayByMacAddress(networkCode,gatewayMac);

    return this.repo.save({
        macAddress: macAddress,
        name: name,
        description: description,
        variable: variable,
        unit: unit,
        gateway: gateway
    });
  }

//update a sensor
  async updateSensor(
    networkCode: string,
    gatewayMac: string,
    sensorMac:string,
    newMacAddress?: string,
    name?: string,
    description?: string,
    variable?:string,
    unit?:string
  ): Promise<void> {

    await this.getSensorByMacAddress(networkCode,gatewayMac,sensorMac);

    if ((newMacAddress!==undefined)&&(sensorMac !== newMacAddress)) {
      throwConflictIfFound(
        await this.repo.find({ where: { macAddress:newMacAddress } }),
        () => true,
        `Sensor with macAddress '${newMacAddress}' already exists`
      );
    }
  
    await this.repo.update({ macAddress: sensorMac }, { macAddress:newMacAddress, name, description,variable,unit });
  }

//delete a sensor
  async deleteSensor(networkCode: string,gatewayMac: string,sensorMac: string,): Promise<void> {
    await this.repo.remove(await this.getSensorByMacAddress(networkCode,gatewayMac,sensorMac));
  }
}
