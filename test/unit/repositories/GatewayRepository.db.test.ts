import {
  initializeTestDataSource,
  closeTestDataSource,
  TestDataSource
} from "@test/setup/test-datasource";
import { NotFoundError } from "@models/errors/NotFoundError";
import { ConflictError } from "@models/errors/ConflictError";
import { NetworkDAO } from "@models/dao/NetworkDAO";
import { GatewayDAO } from "@models/dao/GatewayDAO";
import { GatewayRepository } from "@repositories/GatewayRepository";

beforeAll(async () => {
  await initializeTestDataSource();
});

afterAll(async () => {
  await closeTestDataSource();
});

beforeEach(async () => {
  await TestDataSource.getRepository(NetworkDAO).clear();
  await TestDataSource.getRepository(GatewayDAO).clear();
});

describe("GatewayRepository: SQLite in-memory", () => {
  const repo = new GatewayRepository();

  describe("TS1: createGateway()", () => {
    let network: NetworkDAO = null;

    // Setup del DB pre-test
    beforeEach(async () => {
      network = await TestDataSource.getRepository(NetworkDAO).save({code: "NET01"});
      await TestDataSource.getRepository(GatewayDAO).save({macAddress: "11:22:33", network: network});
    });

    it("T1.1: All valid params", async () => {
      const MAC = "11:22:44"
      await repo.createGateway(MAC, "Gateway2", "dscr Gateway2", network);

      await expect(
        TestDataSource.getRepository(GatewayDAO).findOneOrFail({where: {macAddress: MAC}})
      ).resolves.toMatchObject({
        macAddress: MAC,
        name: "Gateway2",
        description: "dscr Gateway2",
      } as GatewayDAO);
      
    });

    it("T1.2: Error if gateway with same MAC exists", async () => {
      const MAC = "11:22:33";

      await expect(
        repo.createGateway(MAC, "Gateway1", "dscr Gateway1", network)
      ).rejects.toThrow();
    });
  });



  describe("TS2: getAllGateway()", () => {
    let network: NetworkDAO = null;

    // Setup del DB pre-test
    beforeEach(async () => {
      network = await TestDataSource.getRepository(NetworkDAO).save({code: "NET01"});
    });

    it("T2.1: right length of output", async () => {
      await TestDataSource.getRepository(GatewayDAO).save({macAddress: "11:22:33", network: network});
      await TestDataSource.getRepository(GatewayDAO).save({macAddress: "11:22:44", network: network});

      const result=await repo.getAllGateway("NET01");
      expect(result).toHaveLength(2);
      expect(result[0].macAddress).toBe("11:22:33");

    });

    it("T2.2:return an empty array if no gateways exist",async () => {
        const result = await repo.getAllGateway("NET01");
        expect(result).toEqual([]);
    });
  });



  describe("TS3: getGatewayByMacAddress()", () => {
    let network: NetworkDAO = null;

    it("T3.1: find gateway by macAddress", async () => {
      network = await TestDataSource.getRepository(NetworkDAO).save({code: "NET01"});
      await TestDataSource.getRepository(GatewayDAO).save({macAddress: "11:22:33", network: network});
      const found = await repo.getGatewayByMacAddress("NET01","11:22:33");
      expect(found.macAddress).toBe("11:22:33");
    });

    it("T3.2: find gateway by macAddress: not found", async () => {
      network = await TestDataSource.getRepository(NetworkDAO).save({code: "NET01"});
      await expect(repo.getGatewayByMacAddress("NET01","11:22:33")).rejects.toThrow(NotFoundError);
    });
  });  

  describe("TS4: updateGateway()", () => {
    let network: NetworkDAO = null;

    beforeEach(async () => {
      network = await TestDataSource.getRepository(NetworkDAO).save({code: "NET01"});
      await TestDataSource.getRepository(GatewayDAO).save({macAddress: "11:22:33", network: network});
    });

    it("T4.1 update gateway when valid MAC is provided", async () => {
        await repo.updateGateway("11:22:33", "11:22:44", "Updated name", "Updated dscr");

        const updatedGateway = await TestDataSource.getRepository(GatewayDAO).findOneOrFail({ where: { macAddress: "11:22:44" } });

        expect(updatedGateway).toMatchObject({
        macAddress: "11:22:44",
        name: "Updated name",
        description: "Updated dscr",
        });
    });
    
    it("T4.2 update only provided fields and keep others unchanged", async () => {
        await repo.updateGateway("11:22:33", undefined, "Updated name");

        const updatedGateway = await TestDataSource.getRepository(GatewayDAO).findOneOrFail({ where: { macAddress: "11:22:33" } });

        expect(updatedGateway).toMatchObject({
        macAddress: "11:22:33",
        name: "Updated name"
        });
    });

     
  });


  describe("TS5: deleteGateway()", () => {
    let network: NetworkDAO = null;

    beforeEach(async () => {
      network = await TestDataSource.getRepository(NetworkDAO).save({code: "NET01"});
    });

    it("T5.1 delete gateway with mac provided", async () => {
        await TestDataSource.getRepository(GatewayDAO).save({macAddress: "11:22:33", network: network});

        await repo.deleteGateway("NET01","11:22:33");

        const deletedGateway = await TestDataSource.getRepository(GatewayDAO).findOne({ where: { macAddress: "11:22:33" } });

        expect(deletedGateway).toBeNull();

    });

    it("T5.2: delete gateway with mac provided: not found", async () => {
      await expect(repo.deleteGateway("NET01","11:22:33")).rejects.toThrow(NotFoundError);
    });
    
  });


  describe("TS6: getGateway()", () => {
    let network: NetworkDAO = null;

    beforeEach(async () => {
      network = await TestDataSource.getRepository(NetworkDAO).save({code: "NET01"});
      await TestDataSource.getRepository(GatewayDAO).save({macAddress: "11:22:33", network: network});

    });

    it("MacAddress Gateway: conflict", async () => {
        await expect(
          repo.getGateway("11:22:33")
        ).rejects.toThrow(ConflictError);
      });
    
  });  
});

