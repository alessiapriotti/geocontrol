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

//Retrieve all sensors of a gateway
 async getAllSensors(networkCode: string, gatewayMac: string): Promise<SensorDAO[]> {    
    return (await this.repo.find({ where: {gateway:{macAddress:gatewayMac,network:{code:networkCode}}} }));
    
  }


  //Retrieve a specific sensor
  async getSensorByMacAddress(networkCode: string, gatewayMac: string,sensorMac:string): Promise<SensorDAO> {
    
    return findOrThrowNotFound(
      await this.repo.find({ where: { macAddress:sensorMac ,gateway:{macAddress:gatewayMac,network:{code:networkCode}}} }),
      () => true,
      `Sensor with macAddress '${sensorMac}' not found`
    );
  }

  //create a new sensor for a gateway
  async createSensor(
    macAddress: string,
    name: string,
    description: string,
    variable: string,
    unit: string,
    gateway: GatewayDAO
  ): Promise<SensorDAO> {


    throwConflictIfFound(
      await this.repo.find({ where: { macAddress } }),
      () => true,
      `Sensor with macAddress '${macAddress}' already exists`
    );

    

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
    sensorMac:string,
    newMacAddress?: string,
    name?: string,
    description?: string,
    variable?:string,
    unit?:string
  ): Promise<void> {

    if ((newMacAddress!==undefined)&&(sensorMac !== newMacAddress)) {
      throwConflictIfFound(
        await this.repo.find({ where: { macAddress:newMacAddress } }),
        () => true,
        `Sensor with macAddress '${newMacAddress}' already exists`
      );
    }
  
    await this.repo.update({ macAddress:sensorMac }, { macAddress:newMacAddress, name, description,variable,unit });
  }

//delete a sensor
  async deleteSensor(networkCode: string,gatewayMac: string,sensorMac: string,): Promise<void> {
    await this.repo.remove(await this.getSensorByMacAddress(networkCode,gatewayMac,sensorMac));
  }


 //Retrieve a specific sensor without errors
  async getSensor(networkCode: string, sensorMac:string): Promise<SensorDAO> {
    
      return await this.repo.findOne({ where: { macAddress:sensorMac ,gateway:{network:{code:networkCode}}} });

  }


}