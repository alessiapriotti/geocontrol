import { Gateway as GatewayDTO } from "@dto/Gateway";
import { GatewayRepository } from "@repositories/GatewayRepository";
import { NetworkRepository } from "@repositories/NetworkRepository";
import { mapGatewayDAOToDTO } from "@services/mapperService";

export async function createGateway(gatewayDTO: GatewayDTO, code: string): Promise<void> {
    
    const gatewayRep = new GatewayRepository();
    const network = await (new NetworkRepository().getNetworkByCode(code));
    await gatewayRep.createGateway(gatewayDTO.macAddress, gatewayDTO.name, gatewayDTO.description, network);
}

export async function getAllGateway(networkCode: string): Promise<GatewayDTO[]> {

    const gatewayRep = new GatewayRepository();
    await (new NetworkRepository().getNetworkByCode(networkCode));
    return (await gatewayRep.getAllGateway(networkCode)).map(mapGatewayDAOToDTO);
}


export async function getGatewayByMacAddress(networkCode: string, macAddress: string): Promise<GatewayDTO> {

    const gatewayRep = new GatewayRepository();
    await (new NetworkRepository().getNetworkByCode(networkCode));
    return mapGatewayDAOToDTO(await gatewayRep.getGatewayByMacAddress(networkCode, macAddress));
}

export async function updateGateway(
    networkCode: string,
    currentMacAddress: string,
    gatewayDTO: GatewayDTO
): Promise<void> {

    const gatewayRep = new GatewayRepository();
    await (new NetworkRepository().getNetworkByCode(networkCode));
    await gatewayRep.updateGateway(networkCode, currentMacAddress, gatewayDTO.macAddress, gatewayDTO.name, gatewayDTO.description);
}

export async function deleteGateway(macAddress: string, networkCode: string): Promise<void> {

    const gatewayRep = new GatewayRepository();
    await (new NetworkRepository().getNetworkByCode(networkCode));
    await gatewayRep.deleteGateway(macAddress, networkCode);
}