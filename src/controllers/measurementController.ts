import { AppDataSource } from "@database";
import { Measurement as MeasurementDTO } from "@dto/Measurement";
import { Measurements as MeasurementsDTO } from "@dto/Measurements";
import { Stats as StatsDTO } from "@dto/Stats";
import { GatewayDAO } from "@models/dao/GatewayDAO";
import { NetworkDAO } from "@models/dao/NetworkDAO";
import { SensorDAO } from "@models/dao/SensorDAO";
import { MeasurementRepository } from "@repositories/MeasurementRepository";
import { mapMeasurementDAOToDTO } from "@services/mapperService";
import { createMeasurementsDTO, createMeasurementsDTOArray } from "@services/statsService";
import { findOrThrowNotFound } from "@utils";

export async function getAllMeasurements(): Promise<MeasurementDTO[]> {
  const measurementRepo = new MeasurementRepository();
  return (await measurementRepo.getAllMeasurement()).map(mapMeasurementDAOToDTO);
}

export async function createMeasurement(network: string, gateway: string, sensor: string, measurementDto: MeasurementDTO): Promise<void> {
  const measurementRepo = new MeasurementRepository();
  await measurementRepo.createMeasurement(network, gateway, sensor, measurementDto.createdAt, measurementDto.value);
}

export async function getMeasurementsBySensorSet(network: string, sensors: string[], startDate: Date, endDate: Date): Promise<MeasurementsDTO[]> {
  findOrThrowNotFound([ await AppDataSource.getRepository(NetworkDAO).findOne({where: {code: network}}) ],
    (item) => item !== null,
    "Entity not found"
  )

  const sensorRepo = AppDataSource.getRepository(SensorDAO);
  let sensorsFound = [];
  for (const sensMac of sensors) {
    const sensFound = sensorRepo.findOne({where: {macAddress: sensMac}});

    if (sensFound) 
      sensorsFound.push(sensFound);
    else
      console.log(`[Ctrl.getMeasurementsBySensorSet] Ignored MAC (${sensMac}) since it wasn't found in the DB.`);
  }

  const repo = new MeasurementRepository();
  const meases = await repo.getMeasurementsBySensorSet(sensorsFound, startDate, endDate);

  return createMeasurementsDTOArray(meases, sensorsFound, startDate, endDate);
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
      measurements: dto.measurements.filter((m) => m.isOutlier)
    } as MeasurementsDTO;
  });
}

export async function getMeasurementsBySensor(network: string, gateway: string, sensor: string, startDate: Date, endDate: Date): Promise<MeasurementsDTO> {
  findOrThrowNotFound([ await AppDataSource.getRepository(NetworkDAO).findOne({where: {code: network}}) ],
    (item) => item !== null,
    "Entity not found"
  )

  findOrThrowNotFound([ await AppDataSource.getRepository(GatewayDAO).findOne({where: {macAddress: gateway}}) ],
    (item) => item !== null,
    "Entity not found"
  )

  const sensorFound = findOrThrowNotFound([ await AppDataSource.getRepository(SensorDAO).findOne({where: {macAddress: sensor}}) ],
    (item) => item !== null,
    "Entity not found"
  )

  const repo = new MeasurementRepository();
  const meases = await repo.getMeasurementsBySensorSet([sensorFound], startDate, endDate);

  return createMeasurementsDTO(meases, sensorFound, startDate, endDate);
}

export async function getStatsBySensor(network: string, gateway: string, sensor: string, startDate: Date, endDate: Date): Promise<MeasurementsDTO> {
  const measurementsDTO = await getMeasurementsBySensor(network, gateway, sensor, startDate, endDate);
  
  return {
    sensorMacAddress: measurementsDTO.sensorMacAddress,
    stats: measurementsDTO.stats,
  } as MeasurementsDTO;
}

export async function getOutliersBySensor(network: string, gateway: string, sensor: string, startDate: Date, endDate: Date): Promise<MeasurementsDTO> {
  const measurementsDTO = await getMeasurementsBySensor(network, gateway, sensor, startDate, endDate);
  
  return {
    sensorMacAddress: measurementsDTO.sensorMacAddress,
    stats: measurementsDTO.stats,
    measurements: measurementsDTO.measurements.filter((m) => m.isOutlier)
  } as MeasurementsDTO;
}