import {
  initializeTestDataSource,
  closeTestDataSource,
  TestDataSource
} from "@test/setup/test-datasource";
import { NotFoundError } from "@models/errors/NotFoundError";
import { ConflictError } from "@models/errors/ConflictError";
import { NetworkDAO } from "@models/dao/NetworkDAO";
import { GatewayDAO } from "@models/dao/GatewayDAO";
import { checkMacSensorsGateway, checkNetwork } from "@services/checkService";
import { createGateway, deleteGateway, getAllGateway, getGatewayByMacAddress, updateGateway } from "@controllers/gatewayController";
import { Gateway } from "@dto/Gateway";

jest.mock("@services/checkService", () => ({
  checkNetwork: jest.fn(),
  checkMacSensorsGateway: jest.fn()
}));

beforeAll(async () => {
  await initializeTestDataSource();
});

afterAll(async () => {
  await closeTestDataSource();
});

beforeEach(async () => {
  await TestDataSource.getRepository(NetworkDAO).clear();
  await TestDataSource.getRepository(GatewayDAO).clear();
  jest.clearAllMocks();
});

describe("GatewayController: SQLite in-memory, mapperService integration", () => {

  describe("TS1: getAllGateway()", () => {

    let network: NetworkDAO = null;

    beforeEach(async () => {
      network = await TestDataSource.getRepository(NetworkDAO).save({ code: "NET01" });
      (checkNetwork as jest.Mock).mockResolvedValue(network);
    });

    it("T1.1 return all gateways mapped to DTO", async () => {
      await TestDataSource.getRepository(GatewayDAO).save([
        { macAddress: "11:22:33", name: "Gateway1", description: "dscr gateway1", network },
        { macAddress: "11:22:44", name: "Gateway2", description: "dscr gateway2", network },
      ]);

      const result = await getAllGateway("NET01");

      expect(result).toHaveLength(2);
      expect(result[0]).toMatchObject({ macAddress: "11:22:33", name: "Gateway1", description: "dscr gateway1" });
      expect(result[1]).toMatchObject({ macAddress: "11:22:44", name: "Gateway2", description: "dscr gateway2" });
    });

    it("T1.2 return an empty array if no gateways exist", async () => {
      const result = await getAllGateway("NET01");
      expect(result).toEqual([]);
    });

    it("T1.3 throw NotFoundError if network does not exist", async () => {
      (checkNetwork as jest.Mock).mockRejectedValue(new NotFoundError("Network not found"));

      await expect(getAllGateway("NET01")).rejects.toThrow(NotFoundError);
    });

  });

  describe("TS2: createGateway()", () => {
    let network: NetworkDAO = null;

    beforeEach(async () => {
      network = await TestDataSource.getRepository(NetworkDAO).save({ code: "NET01" });
      (checkNetwork as jest.Mock).mockResolvedValue(network);
    });

    it("T2.1: ConflictError if MAC already in use", async () => {
      await TestDataSource.getRepository(GatewayDAO).save({ macAddress: "11:22:33", network: network });
      (checkMacSensorsGateway as jest.Mock).mockRejectedValue(new ConflictError("MAC already exists"));
      const gatewayDTO: Gateway = { macAddress: "11:22:33", name: "Gateway1", description: "dscr gateway1" };
      await expect(createGateway("NET01", gatewayDTO)).rejects.toThrow(ConflictError);
    });

    it("T2.2 throw NotFoundError if network does not exist", async () => {
      const gatewayDTO: Gateway = { macAddress: "11:22:33", name: "Gateway1", description: "dscr gateway1" };
      (checkNetwork as jest.Mock).mockRejectedValue(new NotFoundError("Network not found"));
      await expect(createGateway("NET02", gatewayDTO)).rejects.toThrow(NotFoundError);
    });

    it("T2.3 create a gateway successfully", async () => {
      const gatewayDTO: Gateway = { macAddress: "11:22:33", name: "Gateway1", description: "dscr gateway1" };
      (checkMacSensorsGateway as jest.Mock).mockResolvedValue(undefined);

      await expect(createGateway("NET01", gatewayDTO)).resolves.toBeUndefined();

      expect(checkNetwork).toHaveBeenCalledWith("NET01");
      expect(checkMacSensorsGateway).toHaveBeenCalledWith("11:22:33");
    });

  });

  describe("TS3: getGatewayByMacAddress()", () => {
    let network: NetworkDAO = null;
    beforeEach(async () => {
      network = await TestDataSource.getRepository(NetworkDAO).save({ code: "NET01" });
      (checkNetwork as jest.Mock).mockResolvedValue(network);

    });

    it("T3.1 return the correct gateway mapped to DTO", async () => {

      await TestDataSource.getRepository(GatewayDAO).save({ macAddress: "11:22:33", name: "Gateway1", description: "dscr gateway1", network: network });

      await expect(getGatewayByMacAddress("NET01", "11:22:33")).resolves.toMatchObject({
        macAddress: "11:22:33",
        name: "Gateway1",
        description: "dscr gateway1"
      });

      expect(checkNetwork).toHaveBeenCalledWith("NET01");
    });

    it("T3.2 NotFoundError if gateway does not exist", async () => {
      await expect(getGatewayByMacAddress("NET01", "11:22:33")).rejects.toThrow(NotFoundError);
    });

    it("T3.3 NotFoundError if network does not exist", async () => {
      await TestDataSource.getRepository(GatewayDAO).save({ macAddress: "11:22:33", name: "Gateway1", description: "dscr gateway1", network: network });
      (checkNetwork as jest.Mock).mockRejectedValue(new NotFoundError("Network not found"));
      await expect(getGatewayByMacAddress("NET02", "11:22:33")).rejects.toThrow(NotFoundError);
    });
  });

  describe("TS4: deleteGateway()", () => {
    let network: NetworkDAO = null;

    beforeEach(async () => {
      network = await TestDataSource.getRepository(NetworkDAO).save({ code: "NET01" });
      (checkNetwork as jest.Mock).mockResolvedValue(network);
    });

    it("T4.1 gateway deleted correctly", async () => {

      await TestDataSource.getRepository(GatewayDAO).save({ macAddress: "11:22:33", name: "Gateway1", description: "dscr gateway1", network: network });

      await expect(deleteGateway("NET01", "11:22:33")).resolves.toBeUndefined();

      expect(checkNetwork).toHaveBeenCalledWith("NET01");

    });

    it("T4.2 NotFoundError if gateway does not exist", async () => {
      await expect(deleteGateway("NET01", "11:22:33")).rejects.toThrow(NotFoundError);
    });

    it("T4.3 NotFoundError if network does not exist", async () => {
      await TestDataSource.getRepository(GatewayDAO).save({ macAddress: "11:22:33", name: "Gateway1", description: "dscr gateway1", network: network });
      (checkNetwork as jest.Mock).mockRejectedValue(new NotFoundError("Network not found"));
      await expect(deleteGateway("NET02", "11:22:33")).rejects.toThrow(NotFoundError);
    });
  });

  describe("TS5: updateGateway()", () => {
    let network: NetworkDAO = null;

    beforeEach(async () => {
      network = await TestDataSource.getRepository(NetworkDAO).save({ code: "NET01" });
      (checkNetwork as jest.Mock).mockResolvedValue(network);
      await TestDataSource.getRepository(GatewayDAO).save({ macAddress: "11:22:33", network: network });
    });

    it("T5.1: ConflictError if new MAC already in use", async () => {
      (checkMacSensorsGateway as jest.Mock).mockRejectedValue(new ConflictError("MAC already exists"));
      await TestDataSource.getRepository(GatewayDAO).save({ macAddress: "11:22:44", network: network });
      const gatewayDTO: Gateway = { macAddress: "11:22:44", name: "updated gateway", description: "dscr updated gateway" };


      await expect(updateGateway("NET01", "11:22:33", gatewayDTO)).rejects.toThrow(ConflictError);
      expect(checkMacSensorsGateway).toHaveBeenCalledWith("11:22:44");
    });

    it("T5.2 NotFoundError if network does not exist", async () => {
      const gatewayDTO: Gateway = { macAddress: "11:22:44", name: "updated gateway", description: "dscr updated gateway" };

      (checkNetwork as jest.Mock).mockRejectedValue(new NotFoundError("Network not found"));
      await expect(updateGateway("NET02", "11:22:33", gatewayDTO)).rejects.toThrow(NotFoundError);
      expect(checkNetwork).toHaveBeenCalledWith("NET02");
    });

    it("T5.3 update a gateway successfully", async () => {
      const gatewayDTO: Gateway = { macAddress: "11:22:44", name: "updated gateway", description: "dscr updated gateway" };
      (checkMacSensorsGateway as jest.Mock).mockResolvedValue(undefined);

      await expect(updateGateway("NET01", "11:22:33", gatewayDTO)).resolves.toBeUndefined();

      expect(checkNetwork).toHaveBeenCalledWith("NET01");
      expect(checkMacSensorsGateway).toHaveBeenCalledWith("11:22:44");
    });

    it("T5.4 update a gateway with partial informations successfully", async () => {
      const gatewayDTO: Gateway = { name: "updated gateway" };

      await expect(updateGateway("NET01", "11:22:33", gatewayDTO)).resolves.toBeUndefined();

      expect(checkNetwork).toHaveBeenCalledWith("NET01");
      expect(checkMacSensorsGateway).not.toHaveBeenCalled();
    });

    it("T5.5 update a gateway with same MAC as before", async () => {
      const gatewayDTO: Gateway = { macAddress: "11:22:33", name: "updated gateway", description: "dscr updated gateway" };

      await expect(updateGateway("NET01", "11:22:33", gatewayDTO)).resolves.toBeUndefined();

      expect(checkNetwork).toHaveBeenCalledWith("NET01");
      expect(checkMacSensorsGateway).not.toHaveBeenCalled();
    });

  });

});

