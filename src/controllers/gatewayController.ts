import { Gateway as GatewayDTO } from "@dto/Gateway";
import { GatewayRepository } from "@repositories/GatewayRepository";
import { NetworkRepository } from "@repositories/NetworkRepository";
import { mapGatewayDAOToDTO } from "@services/mapperService";
import {checkMacSensorsGateway,checkNetwork} from "@services/checkService";

export async function createGateway(code: string,gatewayDTO: GatewayDTO): Promise<void> {
    
    const gatewayRep = new GatewayRepository();
    const network = await(checkNetwork(code));
    await(checkMacSensorsGateway(gatewayDTO.macAddress));
    
    await gatewayRep.createGateway(gatewayDTO.macAddress, gatewayDTO.name, gatewayDTO.description, network);
}

export async function getAllGateway(networkCode: string): Promise<GatewayDTO[]> {

    const gatewayRep = new GatewayRepository();
    await (checkNetwork(networkCode));

    return (await gatewayRep.getAllGateway(networkCode)).map(mapGatewayDAOToDTO);
}


export async function getGatewayByMacAddress(networkCode: string, macAddress: string): Promise<GatewayDTO> {

    const gatewayRep = new GatewayRepository();
    await (checkNetwork(networkCode));

    return mapGatewayDAOToDTO(await gatewayRep.getGatewayByMacAddress(networkCode, macAddress));
}

export async function updateGateway(
    networkCode: string,
    currentMacAddress: string,
    gatewayDTO: GatewayDTO
): Promise<void> {

    const gatewayRep = new GatewayRepository();
    await (checkNetwork(networkCode));
    await (gatewayRep.getGatewayByMacAddress(networkCode, currentMacAddress));

    if ((gatewayDTO.macAddress!==undefined)&&(currentMacAddress !== gatewayDTO.macAddress)) {
        await(checkMacSensorsGateway(gatewayDTO.macAddress));
    }

    await gatewayRep.updateGateway(currentMacAddress, gatewayDTO.macAddress, gatewayDTO.name, gatewayDTO.description);
}

export async function deleteGateway(networkCode: string, macAddress: string ): Promise<void> {

    const gatewayRep = new GatewayRepository();
    await (checkNetwork(networkCode));

    await gatewayRep.deleteGateway(networkCode, macAddress);
}