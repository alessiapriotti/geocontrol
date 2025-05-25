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
            getNetworkByCode: jest.fn().mockResolvedValue(fakeNetworkDAO)
        }));

        const result = await NetworkController.getNetwork("NET01");

        expect(result).toEqual({
            code: fakeNetworkDAO.code,
            name: fakeNetworkDAO.name,
            description: fakeNetworkDAO.description
        });
        expect(result).not.toHaveProperty("id");
        expect(result).not.toHaveProperty("gateways");
    });

    it("get All Networks: mapperService integration", async () => {
        const fakeNetworkDAOs: NetworkDAO[] = [
            {
                id: 1,
                code: "NET01",
                name: "Test Network 1",
                description: "This is a test network 1",
                gateways: []
            },
            {
                id: 2,
                code: "NET02",
                name: "Test Network 2",
                description: "This is a test network 2",
                gateways: []
            }
        ];

        (NetworkRepository as jest.Mock).mockImplementation(() => ({
            getAllNetwork: jest.fn().mockResolvedValue(fakeNetworkDAOs)
        }));

        const result = await NetworkController.getAllNetworks();

        expect(result).toHaveLength(2);
        expect(result[0]).toEqual({
            code: fakeNetworkDAOs[0].code,
            name: fakeNetworkDAOs[0].name,
            description: fakeNetworkDAOs[0].description
        });
        expect(result[1]).toEqual({
            code: fakeNetworkDAOs[1].code,
            name: fakeNetworkDAOs[1].name,
            description: fakeNetworkDAOs[1].description
        });
    });

    it("create Network: mapperService integration", async () => {
        const newNetwork = {
            code: "NET03",
            name: "New Test Network",
            description: "This is a new test network"
        };

        (NetworkRepository as jest.Mock).mockImplementation(() => ({
            createNetwork: jest.fn().mockResolvedValue(newNetwork)
        }));

        await NetworkController.createNetwork(newNetwork);

        expect(NetworkRepository.prototype.createNetwork).toHaveBeenCalledWith(
            newNetwork.code,
            newNetwork.name,
            newNetwork.description
        );
    });

    it("update Network: mapperService integration", async () => {
        const updatedNetwork = {
            code: "NET01",
            name: "Updated Test Network",
            description: "This is an updated test network"
        };

        (NetworkRepository as jest.Mock).mockImplementation(() => ({
            updateNetwork: jest.fn().mockResolvedValue(updatedNetwork)
        }));

        await NetworkController.updateNetwork("NET01", updatedNetwork);

        expect(NetworkRepository.prototype.updateNetwork).toHaveBeenCalledWith(
            "NET01",
            updatedNetwork.code,
            updatedNetwork.name,
            updatedNetwork.description
        );
    });

    it("delete Network: mapperService integration", async () => {   
        const networkCode = "NET01";

        (NetworkRepository as jest.Mock).mockImplementation(() => ({
            deleteNetwork: jest.fn().mockResolvedValue(undefined)
        }));

        await NetworkController.deleteNetwork(networkCode);

        expect(NetworkRepository.prototype.deleteNetwork).toHaveBeenCalledWith(networkCode);
    });

});