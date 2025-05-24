import { SensorRepository } from "@repositories/SensorRepository";
import { GatewayRepository } from "@repositories/GatewayRepository";
import { NetworkRepository } from "@repositories/NetworkRepository";
import { GatewayDAO } from "@models/dao/GatewayDAO";
import { NetworkDAO } from "@models/dao/NetworkDAO";

//check if there is already a sensor or a gateway with same mac
export async function checkMacSensorsGateway(MacAddress:string): Promise<void> {
    await((new SensorRepository()).testSensorExistance(MacAddress));
    await((new GatewayRepository()).getGateway(MacAddress));
}

export async function checkNetwork(networkCode:string): Promise<NetworkDAO> {
    return await (new NetworkRepository()).getNetworkByCode(networkCode);
}

export async function checkGateway(networkCode:string,gatewayMac:string): Promise<GatewayDAO> {
    return await (new GatewayRepository()).getGatewayByMacAddress(networkCode, gatewayMac);
}