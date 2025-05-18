import { AppDataSource } from "@database";
import { Measurement as MeasurementDTO } from "@dto/Measurement";
import { Measurements as MeasurementsDTO } from "@dto/Measurements";
import { SensorDAO } from "@models/dao/SensorDAO";
import { NotFoundError } from "@models/errors/NotFoundError";
import { GatewayRepository } from "@repositories/GatewayRepository";
import { MeasurementRepository } from "@repositories/MeasurementRepository";
import { NetworkRepository } from "@repositories/NetworkRepository";
import { logInfo } from "@services/loggingService";
import { mapMeasurementDAOToDTO } from "@services/mapperService";
import { createMeasurementsDTO, createMeasurementsDTOArray, getSensorsByNetwork } from "@services/statsService";
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
  let networkFound = null;
  let sensorsFound = [];

  try {
    networkFound = await (new NetworkRepository()).getNetworkByCode(network);
  }
  catch (error) {
    if (error instanceof NotFoundError)
      throw new NotFoundError("Entity not found");
    else
      throw error;
  }
  
  if (sensors?.length > 0) {
    const sensorRepo = AppDataSource.getRepository(SensorDAO); //TODO: Replace with new SensorRepositor();
    for (const sensMac of sensors) {
      const sensFound = await sensorRepo.findOne({where: {macAddress: sensMac}}); //TODO: Replace with await sensorRepo.getSensorByMacAddress()

      if (sensFound)
        sensorsFound.push(sensFound);
      else
        logInfo(`[MeasCtrl.getMeasurementsBySensorSet] Ignored MAC (${sensMac}) since it wasn't found in the DB.`);
    }
  }
  else {
    sensorsFound.push(...getSensorsByNetwork(networkFound));
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
  let sensorFound = null;

  try {
    await (new NetworkRepository()).getNetworkByCode(network);
    await (new GatewayRepository()).getGatewayByMacAddress(gateway);
    //TODO: sensorFound = await (new SensorRepository()).getGatewayByMacAddress(sensor);
  }
  catch (error) {
    if (error instanceof NotFoundError)
      throw new NotFoundError("Entity not found");
    else
      throw error;
  }

  //TODO: Delete this
  sensorFound = findOrThrowNotFound([ await AppDataSource.getRepository(SensorDAO).findOne({where: {macAddress: sensor}}) ],
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