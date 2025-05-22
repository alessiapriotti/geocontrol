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

  describe("createSensor()", () => {
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
      ).resolves.not.toThrow();

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
  });
});
