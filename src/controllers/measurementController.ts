import { Measurement as MeasurementDTO } from "@dto/Measurement";
import { Measurements as MeasurementsDTO } from "@dto/Measurements";
import { Stats } from "@models/dto/Stats";
import { GatewayRepository } from "@repositories/GatewayRepository";
import { MeasurementRepository } from "@repositories/MeasurementRepository";
import { NetworkRepository } from "@repositories/NetworkRepository";
import { SensorRepository } from "@repositories/SensorRepository";
import { logInfo } from "@services/loggingService";
import { mapMeasurementDAOToDTO } from "@services/mapperService";
import { createMeasurementsDTO, createMeasurementsDTOArray, getSensorsByNetwork } from "@services/statsService";

export async function getAllMeasurements(): Promise<MeasurementDTO[]> {
  const measurementRepo = new MeasurementRepository();
  return (await measurementRepo.getAllMeasurement()).map(mapMeasurementDAOToDTO);
}

export async function createMeasurement(network: string, gateway: string, sensor: string, measurementDto: MeasurementDTO): Promise<void> {
  await (new NetworkRepository()).getNetworkByCode(network);
  await (new GatewayRepository()).getGatewayByMacAddress(network, gateway);
  const sensorFound = await (new SensorRepository()).getSensorByMacAddress(network, gateway, sensor);
  
  const measurementRepo = new MeasurementRepository();
  await measurementRepo.createMeasurement(measurementDto.createdAt, measurementDto.value, sensorFound);
}

export async function getMeasurementsBySensorSet(network: string, sensors: string[], startDate: Date, endDate: Date): Promise<MeasurementsDTO[]> {
  const networkFound = await (new NetworkRepository()).getNetworkByCode(network);
  let sensorsFound = getSensorsByNetwork(networkFound);
  
  if (sensors?.length > 0) {
    sensorsFound = sensorsFound.filter((s) => sensors.includes(s.macAddress))

    if (sensorsFound.length < sensors.length)
      logInfo(`[MeasCtrl.getMeasurementsBySensorSet] Ignored some MACs (considering ${sensorsFound.length} out of ${sensors.length} given) since they were not valid.`);
  }

  return createMeasurementsDTOArray(sensorsFound, startDate, endDate);
}

export async function getStatsBySensorSet(network: string, sensors: string[], startDate: Date, endDate: Date): Promise<MeasurementsDTO[]> {
  const measurementsDTOs = await getMeasurementsBySensorSet(network, sensors, startDate, endDate);
  
  return measurementsDTOs.map((dto) => {
    return {
      sensorMacAddress: dto.sensorMacAddress,
      stats: dto.stats,
    } as MeasurementsDTO;
  });
}

export async function getOutliersBySensorSet(network: string, sensors: string[], startDate: Date, endDate: Date): Promise<MeasurementsDTO[]> {
  const measurementsDTOs = await getMeasurementsBySensorSet(network, sensors, startDate, endDate);
  
  return measurementsDTOs.map((dto) => {
    return {
      sensorMacAddress: dto.sensorMacAddress,
      stats: dto.stats,
      measurements: dto.measurements?.filter((m) => m.isOutlier)
    } as MeasurementsDTO;
  });
}

export async function getMeasurementsBySensor(network: string, gateway: string, sensor: string, startDate: Date, endDate: Date): Promise<MeasurementsDTO> {
  await (new NetworkRepository()).getNetworkByCode(network);
  await (new GatewayRepository()).getGatewayByMacAddress(network, gateway);
  const sensorFound = await (new SensorRepository()).getSensorByMacAddress(network, gateway, sensor);

  return createMeasurementsDTO(sensorFound, startDate, endDate);
}

export async function getStatsBySensor(network: string, gateway: string, sensor: string, startDate: Date, endDate: Date): Promise<Stats> {
  const measurementsDTO = await getMeasurementsBySensor(network, gateway, sensor, startDate, endDate);
  
  return measurementsDTO.stats;
}

export async function getOutliersBySensor(network: string, gateway: string, sensor: string, startDate: Date, endDate: Date): Promise<MeasurementsDTO> {
  const measurementsDTO = await getMeasurementsBySensor(network, gateway, sensor, startDate, endDate);
  
  return {
    sensorMacAddress: measurementsDTO.sensorMacAddress,
    stats: measurementsDTO.stats,
    measurements: measurementsDTO.measurements?.filter((m) => m.isOutlier)
  } as MeasurementsDTO;
}