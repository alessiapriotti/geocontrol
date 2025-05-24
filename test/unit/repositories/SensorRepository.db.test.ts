import {
  initializeTestDataSource,
  closeTestDataSource,
  TestDataSource
} from "@test/setup/test-datasource";
import { NotFoundError } from "@models/errors/NotFoundError";
import { ConflictError } from "@models/errors/ConflictError";
import { SensorRepository } from "@repositories/SensorRepository";
import { NetworkDAO } from "@models/dao/NetworkDAO";
import { GatewayDAO } from "@models/dao/GatewayDAO";
import { SensorDAO } from "@models/dao/SensorDAO";

beforeAll(async () => {
  await initializeTestDataSource();
});

afterAll(async () => {
  await closeTestDataSource();
});

beforeEach(async () => {
  await TestDataSource.getRepository(NetworkDAO).clear();
  await TestDataSource.getRepository(GatewayDAO).clear();
  await TestDataSource.getRepository(SensorDAO).clear();
});

describe("SensorRepository: SQLite in-memory", () => {
  const repo = new SensorRepository();

  describe("TS1: createSensor()", () => {
    let network: NetworkDAO = null;
    let gateway: GatewayDAO = null;

    // Setup del DB pre-test
    beforeEach(async () => {
      network = await TestDataSource.getRepository(NetworkDAO).save({code: "NET01"});
      gateway = await TestDataSource.getRepository(GatewayDAO).save({macAddress: "11:22:33", network: network})
      await TestDataSource.getRepository(SensorDAO).save({macAddress: "11:22:33:aa", gateway: gateway});
    });

    it("T1.1: All valid params", async () => {
      const MAC = "11:22:33:bb"
      await repo.createSensor(MAC, "bbb", "bbb", "temp", "K", gateway);

      await expect(
        TestDataSource.getRepository(SensorDAO).findOneOrFail({where: {macAddress: MAC}})
      ).resolves.toMatchObject({
        macAddress: MAC,
        name: "bbb",
        description: "bbb",
        variable: "temp",
        unit: "K",
      } as SensorDAO);
    });

    it("T1.2: Error if sensor with same MAC exists", async () => {
      const MAC = "11:22:33:aa";

      await expect(
        repo.createSensor(MAC, "aaa", "aaa", "temp", "K", gateway)
      ).rejects.toThrow();
    });

    it("T1.3: Invalid MAC (empty string)", async () => {
      const MAC = "";
      
      await expect(
        repo.createSensor(MAC, "aaa", "desc", "temp", "K", gateway)
      ).rejects.toThrow();
    });

    it("T1.4: Invalid MAC (spaces only)", async () => {
      const MAC = "    ";

      await expect(
        repo.createSensor(MAC, "aaa", "desc", "temp", "K", gateway)
      ).rejects.toThrow();
    });

    it("T1.5: Invalid MAC (null)", async () => {
      const MAC: string = null;
      
      await expect(
        repo.createSensor(MAC, "aaa", "desc", "temp", "K", gateway)
      ).rejects.toThrow();
    });

    it("T1.6: Valid MAC, name with spaces", async () => {
      const MAC = "11:22:33:bb";
      const NAME = "     ";

      await repo.createSensor(MAC, NAME, "desc", "temp", "K", gateway);

      await expect(
        TestDataSource.getRepository(SensorDAO).findOneOrFail({ where: { macAddress: MAC } })
      ).resolves.toMatchObject({
        macAddress: MAC,
        name: "",
      } as SensorDAO);
    });
  });

  describe("TS2: getAllSensors()", () => {
    let network: NetworkDAO = null;
    let gateway: GatewayDAO = null;

    // Setup del DB pre-test
    beforeEach(async () => {
      network = await TestDataSource.getRepository(NetworkDAO).save({code: "NET01"});
      gateway = await TestDataSource.getRepository(GatewayDAO).save({macAddress: "11:22:33", network: network})
      await TestDataSource.getRepository(SensorDAO).save({macAddress: "11:22:33:aa", gateway: gateway});
      await TestDataSource.getRepository(SensorDAO).save({macAddress: "11:22:33:bb", gateway: gateway});
      
      let network2 = await TestDataSource.getRepository(NetworkDAO).save({code: "NET02"});
      let gateway2 = await TestDataSource.getRepository(GatewayDAO).save({macAddress: "22:33:44", network: network2})
      await TestDataSource.getRepository(SensorDAO).save({macAddress: "22:33:44:aa", gateway: gateway2});
    });

    it("T2.1: All valid params", async () => {
      const sensors = await repo.getAllSensors("NET01", "11:22:33");

      expect(Array.isArray(sensors)).toBe(true);
      expect(sensors).toHaveLength(2);
      expect(sensors.map(s => s.macAddress).sort()).toEqual(["11:22:33:aa", "11:22:33:bb"]);
    });

    it("T2.2: Gateway not found", async () => {
      // Ci si potrebbe aspettare che tiri un NotFoundError, 
      // ma i controlli riguardo altri repo sono fatti al livello del Controller.
      await expect(repo.getAllSensors("NET01", "pippo")).resolves.toEqual([]);
    });

    it("T2.3: Gateway not bound to passed network", async () => {
      await expect(repo.getAllSensors("NET01", "22:33:44")).resolves.toEqual([]);
    });

    it("T2.4: Network not found", async () => {
      await expect(repo.getAllSensors("pippo", "11:22:33")).resolves.toEqual([]);
    });

    it("T2.5: Invalid Gateway MAC (empty string)", async () => {
      await expect(repo.getAllSensors("NET01", "")).resolves.toEqual([]);
    });

    it("T2.6: Invalid Network Code (empty string)", async () => {
      await expect(repo.getAllSensors("", "11:22:33")).resolves.toEqual([]);
    });

    it("T2.7: Null Gateway MAC", async () => {
      //TODO: Questo comportamento è aspettato? Vogliamo spostare il controllo su? O rigettiamo la richiesta subito
      const sensors = await repo.getAllSensors("NET01", null);

      expect(Array.isArray(sensors)).toBe(true);
      expect(sensors).toHaveLength(2);
      expect(sensors.map(s => s.macAddress).sort()).toEqual(["11:22:33:aa", "11:22:33:bb"]);
    });

    it("T2.8: Null Network Code", async () => {
      //TODO: Same as above
      const sensors = await repo.getAllSensors(null, "11:22:33");

      expect(Array.isArray(sensors)).toBe(true);
      expect(sensors).toHaveLength(2);
      expect(sensors.map(s => s.macAddress).sort()).toEqual(["11:22:33:aa", "11:22:33:bb"]);
    });
  });
});
