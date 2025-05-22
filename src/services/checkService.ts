import { SensorRepository } from "@repositories/SensorRepository";
import { GatewayRepository } from "@repositories/GatewayRepository";

//check if there is already a sensor or a gateway with same mac
export async function checkMacSensorsGateway(MacAddress:string): Promise<void> {
    await((new SensorRepository()).getSensor(MacAddress));
    await((new GatewayRepository()).getGateway(MacAddress));
}