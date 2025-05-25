import * as NetworkController from "@controllers/networkController";
import { NetworkDAO } from "@dao/NetworkDAO";
import { NetworkRepository } from "@repositories/NetworkRepository";

jest.mock("@repositories/NetworkRepository");

describe("NetworkRoutes integration", () => {
    
    it("get Network: mapperService integration", async () => {
        const fakeNetworkDAO: NetworkDAO = {
            id: 1,
            code: "NET01",
            name: "Test Network",
            description: "This is a test network",
            gateways: []
        };

        (NetworkRepository as jest.Mock).mockImplementation(() => ({
            createNetwork: jest.fn().mockResolvedValue(fakeNetworkDAO)
        }));

        const result = await NetworkController.getNetwork("NET01");

        expect(result).toEqual({
            code: fakeNetworkDAO.code,
            name: fakeNetworkDAO.name,
            description: fakeNetworkDAO.description
        });
    });

});