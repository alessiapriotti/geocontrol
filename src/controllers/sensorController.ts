import { Sensor as SensorDTO } from "@dto/Sensor";
import { SensorRepository } from "@repositories/SensorRepository";
import { GatewayRepository } from "@repositories/GatewayRepository";
import { mapSensorDAOToDTO } from "@services/mapperService";

export async function createSensor(networkCode: string, gatewayMac: string,sensorDto: SensorDTO): Promise<void> {
  const sensorRepo = new SensorRepository();
  const gatewayRepo= new GatewayRepository();
  const gateway=await gatewayRepo.getGatewayByMacAddress(networkCode,gatewayMac);

  await sensorRepo.createSensor(sensorDto.macAddress,sensorDto.name,sensorDto.description,sensorDto.variable,sensorDto.unit,gateway);
}

export async function getAllSensors(networkCode: string, gatewayMac: string): Promise<SensorDTO[]> {
  const sensorRepo = new SensorRepository();
  const gatewayRepo= new GatewayRepository();
  await gatewayRepo.getGatewayByMacAddress(networkCode,gatewayMac);
  return (await sensorRepo.getAllSensors(networkCode,gatewayMac)).map(mapSensorDAOToDTO);
}

export async function getSensorByMacAddress(networkCode: string, gatewayMac: string, macAddress: string): Promise<SensorDTO> {
  const sensorRepo = new SensorRepository();
  const gatewayRepo= new GatewayRepository();
  await gatewayRepo.getGatewayByMacAddress(networkCode,gatewayMac);
  return mapSensorDAOToDTO(await sensorRepo.getSensorByMacAddress(networkCode,gatewayMac,macAddress));
}

export async function updateSensor(networkCode: string, gatewayMac: string, sensorMac:string, sensorDto: SensorDTO): Promise<void> {
  const sensorRepo = new SensorRepository();
  await sensorRepo.updateSensor(networkCode,gatewayMac,sensorMac,sensorDto.macAddress,sensorDto.name,sensorDto.description,sensorDto.variable,sensorDto.unit);
}

export async function deleteSensor(networkCode: string, gatewayMac: string, sensorMac:string): Promise<void> {
  const sensorRepo = new SensorRepository();
  const gatewayRepo= new GatewayRepository();
  await gatewayRepo.getGatewayByMacAddress(networkCode,gatewayMac);
  await sensorRepo.deleteSensor(networkCode,gatewayMac,sensorMac);
}