import { Gateway as GatewayDTO } from "@dto/Gateway";
import { GatewayRepository } from "@repositories/GatewayRepository";
import { mapGatewayDAOToDTO } from "@services/mapperService";

export async function createGateway(gatewayDTO: GatewayDTO, code: string): Promise<void> {
    const gatewayRep = new GatewayRepository();
    await gatewayRep.createGateway(gatewayDTO.macAddress, gatewayDTO.name, gatewayDTO.description, code);
}

export async function getAllGateway(): Promise<GatewayDTO[]> {
    const gatewayRep = new GatewayRepository();
    return (await gatewayRep.getAllGateway()).map(mapGatewayDAOToDTO);
}

export async function deleteGateway(macAddress: string): Promise<void> {
    const gatewayRep = new GatewayRepository();
    await gatewayRep.deleteGateway(macAddress);
}