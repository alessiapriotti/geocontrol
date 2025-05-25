import * as gatewayController from "@controllers/gatewayController";
import { GatewayDAO } from "@dao/GatewayDAO";
import { NetworkDAO } from "@models/dao/NetworkDAO";
import { GatewayRepository } from "@repositories/GatewayRepository";
import { checkNetwork } from "@services/checkService";


jest.mock("@repositories/GatewayRepository");

jest.mock("@services/checkService", () => ({
  checkNetwork: jest.fn()
}));

describe("GatewayController integration", () => {
  it("getGatewayByMacAddress: mapperService integration", async () => {

    const fakeGatewayDAO: GatewayDAO = {
        id: 1,
        macAddress: "11:22:33",
        name: "Gateway1",
        description: "dscr Gateway1",
        sensors: [], 
        network: {code: "NET01",
        name: "Network 1",
        description: "dscr net01",
        id: 7,
        gateways: [] }
    };

    (checkNetwork as jest.Mock).mockResolvedValue(fakeGatewayDAO.network);

    const expectedDTO = {
      macAddress: fakeGatewayDAO.macAddress,
      name: fakeGatewayDAO.name,
      description: fakeGatewayDAO.description,
    };

    (GatewayRepository as jest.Mock).mockImplementation(() => ({
      getGatewayByMacAddress: jest.fn().mockResolvedValue(fakeGatewayDAO)
    }));


    const result = await gatewayController.getGatewayByMacAddress("NET01","11:22:33");

    expect(result).toEqual({
      macAddress: expectedDTO.macAddress,
      name: expectedDTO.name,
      description: expectedDTO.description,
    });
    expect(result).not.toHaveProperty("id");
    expect(result).not.toHaveProperty("network");
    expect(checkNetwork).toHaveBeenCalledWith("NET01");

  });
});
