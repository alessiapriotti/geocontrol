import { Token as TokenDTO } from "@dto/Token";
import { User as UserDTO } from "@dto/User";
import { Network as NetworkDTO } from "@dto/Network";
import { Gateway as GatewayDTO } from "@dto/Gateway";
import { Measurement as MeasurementDTO } from "@dto/Measurement";
import { Sensor as SensorDTO } from "@dto/Sensor";
import { NetworkDAO } from "@models/dao/NetworkDAO";
import { UserDAO } from "@models/dao/UserDAO";
import { SensorDAO } from "@models/dao/SensorDAO";
import { ErrorDTO } from "@models/dto/ErrorDTO";
import { UserType } from "@models/UserType";
import { GatewayDAO } from "@models/dao/GatewayDAO";
import { MeasurementDAO } from "@models/dao/MeasurementDAO";

export function createErrorDTO(
  code: number,
  message?: string,
  name?: string
): ErrorDTO {
  return removeNullAttributes({
    code,
    name,
    message
  }) as ErrorDTO;
}

export function createTokenDTO(token: string): TokenDTO {
  return removeNullAttributes({
    token: token
  }) as TokenDTO;
}

export function createUserDTO(
  username: string,
  type: UserType,
  password?: string
): UserDTO {
  return removeNullAttributes({
    username,
    type,
    password
  }) as UserDTO;
}

export function createNetworkDTO(
  code: string,
  name?: string,
  description?: string,
  gateways?: GatewayDTO[]
): NetworkDTO {
  return removeNullAttributes({
    code,
    name,
    description,
    gateways: gateways ? gateways.map(mapGatewayDAOToDTO) : undefined,
  }) as NetworkDTO;
}

export function createGatewayDTO(
  macAddress: string,
  name?: string,
  description?: string,
  sensors?:SensorDAO[],
): GatewayDTO {
  return removeNullAttributes({
    macAddress,
    name,
    description,
    sensors: sensors ? sensors.map(mapSensorDAOToDTO) : undefined,
  }) as GatewayDTO;
}


export function createMeasurementDTO(
    createdAt: Date,
    value: number,
    isOutlier?: boolean
): MeasurementDTO {
  return removeNullAttributes({
    createdAt,
    value,
    isOutlier
  }) as MeasurementDTO;
}

export function createSensorDTO(
  macAddress: string,
  name?: string,
  description?: string,
  variable?: string,
  unit?: string
): SensorDTO {
  return removeNullAttributes({
    macAddress,
    name,
    description,
    variable,
    unit,
  }) as SensorDTO;

}

export function mapUserDAOToDTO(userDAO: UserDAO): UserDTO {
  return createUserDTO(userDAO.username, userDAO.type);
}

function removeNullAttributes<T>(dto: T): Partial<T> {
  return Object.fromEntries(
    Object.entries(dto).filter(
      ([_, value]) =>
        value !== null &&
        value !== undefined &&
        (!Array.isArray(value) || value.length > 0)
    )
  ) as Partial<T>;
}

export function mapNetworkDAOToDTO(networkDAO: NetworkDAO): NetworkDTO {
  return createNetworkDTO(networkDAO.code, networkDAO.name, networkDAO.description, networkDAO.gateways);
}

export function mapGatewayDAOToDTO(gatewayDAO: GatewayDAO): GatewayDTO {
  return createGatewayDTO(gatewayDAO.macAddress, gatewayDAO.name, gatewayDAO.description,gatewayDAO.sensors);
}

export function mapMeasurementDAOToDTO(measurementDAO: MeasurementDAO): MeasurementDTO {
  return createMeasurementDTO(measurementDAO.createdAt, measurementDAO.value);
}

export function convertMeasurementDAOToDTO(measurementDAO: MeasurementDAO, isOutlier?: boolean): MeasurementDTO {
  return createMeasurementDTO(measurementDAO.createdAt, measurementDAO.value, isOutlier);
}

export function mapSensorDAOToDTO(sensorDAO: SensorDAO): SensorDTO {
  return createSensorDTO(sensorDAO.macAddress, sensorDAO.name, sensorDAO.description, sensorDAO.variable,sensorDAO.unit);
}