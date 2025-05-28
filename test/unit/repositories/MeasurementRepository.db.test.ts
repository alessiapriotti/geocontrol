import {
  initializeTestDataSource,
  closeTestDataSource,
  TestDataSource,
} from "@test/setup/test-datasource";
import { MeasurementRepository } from "@repositories/MeasurementRepository";
import { NetworkDAO } from "@models/dao/NetworkDAO";
import { GatewayDAO } from "@models/dao/GatewayDAO";
import { SensorDAO } from "@models/dao/SensorDAO";
import { MeasurementDAO } from "@models/dao/MeasurementDAO";

beforeAll(async () => {
  await initializeTestDataSource();
});

afterAll(async () => {
  await closeTestDataSource();
});

beforeEach(async () => {
  await TestDataSource.getRepository(MeasurementDAO).clear();
  await TestDataSource.getRepository(SensorDAO).clear();
  await TestDataSource.getRepository(GatewayDAO).clear();
  await TestDataSource.getRepository(NetworkDAO).clear();
});

describe("MeasurementRepository: SQLite in-memory", () => {
  const repo = new MeasurementRepository();

  const createDate = (dateStr: string) => new Date(dateStr);

  describe("TS1: createMeasurement()", () => {
    let network: NetworkDAO = null;
    let gateway: GatewayDAO = null;
    let sensor: SensorDAO = null;

    beforeEach(async () => {
      network = await TestDataSource.getRepository(NetworkDAO).save({
        code: "NET01",
      });
      gateway = await TestDataSource.getRepository(GatewayDAO).save({
        macAddress: "11:22:33",
        network: network,
      });
      sensor = await TestDataSource.getRepository(SensorDAO).save({
        macAddress: "11:22:33:aa",
        gateway: gateway,
        name: "Sensor A",
        description: "Test Sensor A",
        variable: "temp",
        unit: "C",
      });
    });

    it("T1.1: Valid parameters - past date, valid value, valid sensor", async () => {
      const date = createDate("2023-01-01");
      const value = 25.5;

      const result = await repo.createMeasurement(date, value, sensor);

      expect(result).toBeDefined();
      expect(result.createdAt).toEqual(date);
      expect(result.value).toBe(value);
      expect(result.sensor).toEqual(sensor);
    });

    it("T1.2: Error if sensor is null", async () => {
      const date = createDate("2023-01-01");
      const value = 25.5;

      await expect(repo.createMeasurement(date, value, null)).rejects.toThrow();
    });

    it("T1.3: Error if value is NaN", async () => {
      const date = createDate("2023-01-01");
      const value = NaN;

      await expect(
        repo.createMeasurement(date, value, sensor)
      ).rejects.toThrow();
    });

    it("T1.4: Error if value is null", async () => {
      const date = createDate("2023-01-01");
      const value = null;

      await expect(
        repo.createMeasurement(date, value, sensor)
      ).rejects.toThrow();
    });

    it("T1.5: Error if date is in the future", async () => {
      const date = createDate("2099-01-01");
      const value = 25.5;

      await expect(
        repo.createMeasurement(date, value, sensor)
      ).rejects.toThrow();
    });

    it("T1.6: Error if date is null", async () => {
      const date = null;
      const value = 25.5;

      await expect(
        repo.createMeasurement(date, value, sensor)
      ).rejects.toThrow();
    });
  });

  describe("TS2: getAllMeasurement()", () => {
    let network: NetworkDAO = null;
    let gateway: GatewayDAO = null;
    let sensor1: SensorDAO = null;
    let sensor2: SensorDAO = null;

    beforeEach(async () => {
      network = await TestDataSource.getRepository(NetworkDAO).save({
        code: "NET01",
      });
      gateway = await TestDataSource.getRepository(GatewayDAO).save({
        macAddress: "11:22:33",
        network: network,
      });

      sensor1 = await TestDataSource.getRepository(SensorDAO).save({
        macAddress: "11:22:33:aa",
        gateway: gateway,
        name: "Sensor A",
        variable: "temp",
        unit: "C",
      });

      sensor2 = await TestDataSource.getRepository(SensorDAO).save({
        macAddress: "11:22:33:bb",
        gateway: gateway,
        name: "Sensor B",
        variable: "humidity",
        unit: "%",
      });

      await TestDataSource.getRepository(MeasurementDAO).save([
        {
          createdAt: createDate("2023-01-01T12:00:00"),
          value: 25.5,
          sensor: sensor1,
        },
        {
          createdAt: createDate("2023-01-01T12:30:00"),
          value: 26.0,
          sensor: sensor1,
        },
        {
          createdAt: createDate("2023-01-01T12:00:00"),
          value: 45.0,
          sensor: sensor2,
        },
      ]);
    });

    it("T2.1: Should return all measurements", async () => {
      const measurements = await repo.getAllMeasurement();

      expect(Array.isArray(measurements)).toBe(true);
      expect(measurements).toHaveLength(3);

      const values = measurements.map((m) => m.value).sort();
      expect(values).toEqual([25.5, 26.0, 45.0]);
    });

    it("T2.2: Should return empty array if no measurements exist", async () => {
      await TestDataSource.getRepository(MeasurementDAO).clear();

      const measurements = await repo.getAllMeasurement();

      expect(Array.isArray(measurements)).toBe(true);
      expect(measurements).toHaveLength(0);
    });
  });
});
