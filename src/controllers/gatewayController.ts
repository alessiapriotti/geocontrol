import { Gateway as GatewayDTO } from "@dto/Gateway";
import { GatewayRepository } from "@repositories/GatewayRepository";
import { mapGatewayDAOToDTO } from "@services/mapperService";

export async function createGateway(gatewayDTO: GatewayDTO, code: string): Promise<void> {
    const gatewayRep = new GatewayRepository();
    await gatewayRep.createGateway(gatewayDTO.macAddress, gatewayDTO.name, gatewayDTO.description, code);
}

export async function getAllGateway(networkCode: string): Promise<GatewayDTO[]> {
    const gatewayRep = new GatewayRepository();
    return (await gatewayRep.getAllGateway(networkCode)).map(mapGatewayDAOToDTO);
}

export async function getGatewayByMacAddress(macAddress: string, networkCode: string): Promise<GatewayDTO> {
    const gatewayRep = new GatewayRepository();
    return mapGatewayDAOToDTO(await gatewayRep.getGatewayByMacAddress(macAddress, networkCode));
}

export async function updateGateway(
    networkCode: string,
    currentMacAddress: string,
    gatewayDTO: GatewayDTO
): Promise<void> {
    const gatewayRep = new GatewayRepository();
    await gatewayRep.updateGateway(networkCode, currentMacAddress, gatewayDTO.macAddress, gatewayDTO.name, gatewayDTO.description);
}

export async function deleteGateway(macAddress: string, networkCode: string): Promise<void> {
    const gatewayRep = new GatewayRepository();
    await gatewayRep.deleteGateway(macAddress, networkCode);
}