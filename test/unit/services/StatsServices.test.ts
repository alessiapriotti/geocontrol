import {
  initializeTestDataSource,
  closeTestDataSource,
} from "@test/setup/test-datasource";
import { TestDataSource } from "@test/setup/test-datasource";
import { NetworkDAO } from "@models/dao/NetworkDAO";
import { GatewayDAO } from "@models/dao/GatewayDAO";
import { SensorDAO } from "@models/dao/SensorDAO";
import { MeasurementDAO } from "@models/dao/MeasurementDAO";
import {
  calculateStats,
  getFilteredMeasurements,
} from "@services/statsService";

describe("StatsServices", () => {
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
  describe("createMeasurementsDTO with empty measurements", () => {
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
        variable: "temp",
        unit: "C",
      });
      sensor.measurement = [
      { id: 1, createdAt: new Date("2025-01-01"), value: 21.5, sensor: sensor },
      { id: 2, createdAt: new Date("2025-01-02"), value: 22.0, sensor: sensor },
      { id: 3, createdAt: new Date("2025-01-03"), value: 20.0, sensor: sensor },
      { id: 4, createdAt: new Date("2025-01-05"), value: 45.0, sensor: sensor },
      { id: 5, createdAt: new Date("2025-01-06"), value: 48.0, sensor: sensor },
      ]
    });

    it("should handle a sensor with no measurements correctly", () => {
      expect(calculateStats([])).toEqual([NaN, NaN, NaN, NaN]);
    });

    it("return stats between two dates", () => {
        const result = getFilteredMeasurements(sensor, new Date("2025-01-02"), new Date("2025-01-03"));
        expect(result.length).toBe(2);
    });

    it("return stats with one startDate", () => {
        const result = getFilteredMeasurements(sensor, new Date("2025-01-03"),  null);
        expect(result.length).toBe(3);
    });

    it("return stats with one endDate", () => {
        const result = getFilteredMeasurements(sensor, null, new Date("2025-01-02"));
        expect(result.length).toBe(2);
    });

    it("return stats with no date", () => {
        const result = getFilteredMeasurements(sensor, null, null);
        expect(result.length).toBe(5);
    });
  });
});
