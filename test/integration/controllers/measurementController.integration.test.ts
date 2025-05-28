import {
  createMeasurement,
  getAllMeasurements,
  getMeasurementsBySensorSet,
  getMeasurementsBySensor,
  getStatsBySensorSet,
  getOutliersBySensorSet,
  getStatsBySensor,
  getOutliersBySensor,
} from "@controllers/measurementController";
import {
  initializeTestDataSource,
  closeTestDataSource,
  TestDataSource,
} from "@test/setup/test-datasource";
import { NetworkDAO } from "@models/dao/NetworkDAO";
import { GatewayDAO } from "@models/dao/GatewayDAO";
import { SensorDAO } from "@models/dao/SensorDAO";
import { MeasurementDAO } from "@models/dao/MeasurementDAO";
import { Measurement } from "@dto/Measurement";
import { NotFoundError } from "@models/errors/NotFoundError";

describe("MeasurementController Integration Tests", () => {
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

  async function setupTestData() {
    const network = await TestDataSource.getRepository(NetworkDAO).save({
      code: "NET01",
    });

    const gateway = await TestDataSource.getRepository(GatewayDAO).save({
      macAddress: "11:22:33",
      name: "Gateway 1",
      network,
    });

    const sensor1 = await TestDataSource.getRepository(SensorDAO).save({
      macAddress: "11:22:33:AA",
      name: "Temp Sensor",
      variable: "temperature",
      unit: "C",
      gateway,
    });

    const sensor2 = await TestDataSource.getRepository(SensorDAO).save({
      macAddress: "11:22:33:BB",
      name: "Humidity Sensor",
      variable: "humidity",
      unit: "%",
      gateway,
    });

    const now = new Date();
    const yesterday = new Date(now);
    yesterday.setDate(yesterday.getDate() - 1);

    const outlierValue = 100.0;

    const measurements = await TestDataSource.getRepository(
      MeasurementDAO
    ).save([
      { createdAt: yesterday, value: 21.5, sensor: sensor1 },
      { createdAt: now, value: 22.0, sensor: sensor1 },
      { createdAt: now, value: outlierValue, sensor: sensor1 },
      { createdAt: yesterday, value: 45.0, sensor: sensor2 },
      { createdAt: now, value: 48.0, sensor: sensor2 },
    ]);

    return {
      network,
      gateway,
      sensors: [sensor1, sensor2],
      measurements,
      outlierValue,
    };
  }

  describe("createMeasurement", () => {
    it("should create a new measurement for a valid sensor", async () => {
      const { network, gateway, sensors } = await setupTestData();
      const sensor = sensors[0];

      const measurementDto: Measurement = {
        value: 23.5,
        createdAt: new Date(),
        isOutlier: false,
      };

      await createMeasurement(
        network.code,
        gateway.macAddress,
        sensor.macAddress,
        measurementDto
      );

      const measurements = await TestDataSource.getRepository(
        MeasurementDAO
      ).find({
        where: { sensor: { macAddress: sensor.macAddress } },
        relations: ["sensor"],
      });

      expect(measurements).toHaveLength(4);
      const latestMeasurement = measurements.sort(
        (a, b) => b.createdAt.getTime() - a.createdAt.getTime()
      )[0];

      expect(latestMeasurement.value).toBe(measurementDto.value);
    });

    it("should throw NotFoundError when sensor doesn't exist", async () => {
      const { network, gateway } = await setupTestData();
      const nonExistentSensorMac = "11:22:33:ZZ";

      const measurementDto: Measurement = {
        value: 23.5,
        createdAt: new Date(),
        isOutlier: false,
      };

      await expect(
        createMeasurement(
          network.code,
          gateway.macAddress,
          nonExistentSensorMac,
          measurementDto
        )
      ).rejects.toThrow(NotFoundError);
    });

    it("should throw NotFoundError when gateway doesn't exist", async () => {
      const { network, sensors } = await setupTestData();
      const sensor = sensors[0];
      const nonExistentGatewayMac = "99:99:99";

      const measurementDto: Measurement = {
        value: 23.5,
        createdAt: new Date(),
        isOutlier: false,
      };

      await expect(
        createMeasurement(
          network.code,
          nonExistentGatewayMac,
          sensor.macAddress,
          measurementDto
        )
      ).rejects.toThrow(NotFoundError);
    });

    it("should throw NotFoundError when network doesn't exist", async () => {
      const { gateway, sensors } = await setupTestData();
      const sensor = sensors[0];
      const nonExistentNetworkCode = "NONEXISTENT";

      const measurementDto: Measurement = {
        value: 23.5,
        createdAt: new Date(),
        isOutlier: false,
      };

      await expect(
        createMeasurement(
          nonExistentNetworkCode,
          gateway.macAddress,
          sensor.macAddress,
          measurementDto
        )
      ).rejects.toThrow(NotFoundError);
    });
  });

  describe("getMeasurementsBySensorSet", () => {
    it("should retrieve measurements for multiple sensors in a network", async () => {
      const { network, sensors } = await setupTestData();
      const sensorMacs = sensors.map((s) => s.macAddress);

      const startDate = new Date();
      startDate.setDate(startDate.getDate() - 2);
      const endDate = new Date();

      const result = await getMeasurementsBySensorSet(
        network.code,
        sensorMacs,
        startDate,
        endDate
      );

      expect(result).toHaveLength(2);

      const resultSensorMacs = result.map((r) => r.sensorMacAddress).sort();
      const expectedSensorMacs = sensorMacs.sort();
      expect(resultSensorMacs).toEqual(expectedSensorMacs);

      for (const sensorResult of result) {
        expect(sensorResult.measurements).toBeDefined();

        const expectedCount =
          sensorResult.sensorMacAddress === sensors[0].macAddress ? 3 : 2;
        expect(sensorResult.measurements.length).toBe(expectedCount);

        expect(sensorResult.stats).toBeDefined();
      }
    });

    it("should handle empty sensor list by returning all sensors in network", async () => {
      const { network } = await setupTestData();

      const startDate = new Date();
      startDate.setDate(startDate.getDate() - 2);
      const endDate = new Date();

      const result = await getMeasurementsBySensorSet(
        network.code,
        [],
        startDate,
        endDate
      );

      expect(result).toHaveLength(2);
      expect(
        result[0].measurements?.length + result[1].measurements?.length
      ).toBe(5);
    });

    it("should handle undefined sensor list by returning all sensors in network", async () => {
      const { network } = await setupTestData();

      const startDate = new Date();
      startDate.setDate(startDate.getDate() - 2);
      const endDate = new Date();

      const result = await getMeasurementsBySensorSet(
        network.code,
        undefined,
        startDate,
        endDate
      );

      expect(result).toHaveLength(2);
    });

    it("should filter measurements by date range", async () => {
      const { network, sensors } = await setupTestData();
      const sensorMacs = sensors.map((s) => s.macAddress);

      const threeDaysAgo = new Date();
      threeDaysAgo.setDate(threeDaysAgo.getDate() - 3);

      await TestDataSource.getRepository(MeasurementDAO).save({
        createdAt: threeDaysAgo,
        value: 20.0,
        sensor: sensors[0],
      });

      const startDate = new Date();
      startDate.setDate(startDate.getDate() - 2);
      const endDate = new Date();

      const result = await getMeasurementsBySensorSet(
        network.code,
        sensorMacs,
        startDate,
        endDate
      );

      expect(result).toHaveLength(2);

      const sensor0Result = result.find(
        (r) => r.sensorMacAddress === sensors[0].macAddress
      );
      expect(sensor0Result.measurements).toHaveLength(3);
    });

    it("should log info when some sensor MACs are invalid", async () => {
      const { network, sensors } = await setupTestData();
      const validSensorMac = sensors[0].macAddress;
      const invalidSensorMac = "11:22:33:ZZ";

      const startDate = new Date();
      startDate.setDate(startDate.getDate() - 2);
      const endDate = new Date();

      const result = await getMeasurementsBySensorSet(
        network.code,
        [validSensorMac, invalidSensorMac],
        startDate,
        endDate
      );

      expect(result).toHaveLength(1);
      expect(result[0].sensorMacAddress).toBe(validSensorMac);
    });

    it("should throw NotFoundError for non-existent network", async () => {
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - 2);
      const endDate = new Date();

      await expect(
        getMeasurementsBySensorSet("NONEXISTENT", [], startDate, endDate)
      ).rejects.toThrow(NotFoundError);
    });
  });

  describe("getMeasurementsBySensor", () => {
    it("should retrieve measurements for a single sensor", async () => {
      const { network, gateway, sensors } = await setupTestData();
      const sensor = sensors[0];

      const startDate = new Date();
      startDate.setDate(startDate.getDate() - 2);
      const endDate = new Date();

      const result = await getMeasurementsBySensor(
        network.code,
        gateway.macAddress,
        sensor.macAddress,
        startDate,
        endDate
      );

      expect(result).toBeDefined();
      expect(result.sensorMacAddress).toBe(sensor.macAddress);
      expect(result.measurements).toHaveLength(3);
      expect(result.stats).toBeDefined();
      expect(result.measurements.length).toBe(3);
    });

    it("should filter measurements by date range", async () => {
      const { network, gateway, sensors } = await setupTestData();
      const sensor = sensors[0];

      const threeDaysAgo = new Date();
      threeDaysAgo.setDate(threeDaysAgo.getDate() - 3);

      await TestDataSource.getRepository(MeasurementDAO).save({
        createdAt: threeDaysAgo,
        value: 18.0,
        sensor: sensor,
      });

      const startDate = new Date();
      startDate.setDate(startDate.getDate() - 2);
      const endDate = new Date();

      const result = await getMeasurementsBySensor(
        network.code,
        gateway.macAddress,
        sensor.macAddress,
        startDate,
        endDate
      );

      expect(result).toBeDefined();
      expect(result.measurements).toHaveLength(3);

      expect(
        result.measurements.every((m) => {
          const createdAt = new Date(m.createdAt);
          return createdAt >= startDate && createdAt <= endDate;
        })
      ).toBe(true);
    });

    it("should throw NotFoundError for non-existent sensor", async () => {
      const { network, gateway } = await setupTestData();
      const nonExistentSensorMac = "11:22:33:ZZ";

      const startDate = new Date();
      startDate.setDate(startDate.getDate() - 2);
      const endDate = new Date();

      await expect(
        getMeasurementsBySensor(
          network.code,
          gateway.macAddress,
          nonExistentSensorMac,
          startDate,
          endDate
        )
      ).rejects.toThrow(NotFoundError);
    });

    it("should throw NotFoundError for non-existent gateway", async () => {
      const { network, sensors } = await setupTestData();
      const sensor = sensors[0];
      const nonExistentGatewayMac = "99:99:99";

      const startDate = new Date();
      startDate.setDate(startDate.getDate() - 2);
      const endDate = new Date();

      await expect(
        getMeasurementsBySensor(
          network.code,
          nonExistentGatewayMac,
          sensor.macAddress,
          startDate,
          endDate
        )
      ).rejects.toThrow(NotFoundError);
    });

    it("should throw NotFoundError for non-existent network", async () => {
      const { gateway, sensors } = await setupTestData();
      const sensor = sensors[0];
      const nonExistentNetworkCode = "NONEXISTENT";

      const startDate = new Date();
      startDate.setDate(startDate.getDate() - 2);
      const endDate = new Date();

      await expect(
        getMeasurementsBySensor(
          nonExistentNetworkCode,
          gateway.macAddress,
          sensor.macAddress,
          startDate,
          endDate
        )
      ).rejects.toThrow(NotFoundError);
    });
  });

  describe("getAllMeasurements", () => {
    it("should retrieve all measurements in the system", async () => {
      await setupTestData();

      const result = await getAllMeasurements();

      expect(Array.isArray(result)).toBe(true);
      expect(result.length).toBe(5);

      for (const measurement of result) {
        expect(measurement).toHaveProperty("value");
        expect(measurement).toHaveProperty("createdAt");
      }
    });

    it("should return empty array when no measurements exist", async () => {
      const result = await getAllMeasurements();

      expect(Array.isArray(result)).toBe(true);
      expect(result.length).toBe(0);
    });
  });

  describe("getStatsBySensorSet", () => {
    it("should retrieve stats for multiple sensors in a network", async () => {
      const { network, sensors } = await setupTestData();
      const sensorMacs = sensors.map((s) => s.macAddress);

      const startDate = new Date();
      startDate.setDate(startDate.getDate() - 2);
      const endDate = new Date();

      const result = await getStatsBySensorSet(
        network.code,
        sensorMacs,
        startDate,
        endDate
      );

      expect(result).toHaveLength(2);

      for (const sensorStats of result) {
        expect(sensorStats.sensorMacAddress).toBeDefined();
        expect(sensorStats.stats).toBeDefined();
        expect(sensorStats.measurements).toBeUndefined();
      }
    });

    it("should throw NotFoundError for non-existent network", async () => {
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - 2);
      const endDate = new Date();

      await expect(
        getStatsBySensorSet("NONEXISTENT", [], startDate, endDate)
      ).rejects.toThrow(NotFoundError);
    });
  });

  describe("getOutliersBySensorSet", () => {
    it("should retrieve only outlier measurements for multiple sensors", async () => {
      const { network, sensors, outlierValue } = await setupTestData();
      const sensorMacs = sensors.map((s) => s.macAddress);

      const startDate = new Date();
      startDate.setDate(startDate.getDate() - 2);
      const endDate = new Date();

      const result = await getOutliersBySensorSet(
        network.code,
        sensorMacs,
        startDate,
        endDate
      );

      expect(result).toHaveLength(2);

      const resultSensorMacs = result.map((r) => r.sensorMacAddress).sort();
      const expectedSensorMacs = sensorMacs.sort();
      expect(resultSensorMacs).toEqual(expectedSensorMacs);

      for (const sensorResult of result) {
        expect(sensorResult.stats).toBeDefined();
      }
    });

    it("should handle case when no sensors have outliers", async () => {
      const { network } = await setupTestData();

      const gateway2 = await TestDataSource.getRepository(GatewayDAO).save({
        macAddress: "44:55:66",
        name: "Gateway 2",
        network,
      });

      const sensor3 = await TestDataSource.getRepository(SensorDAO).save({
        macAddress: "44:55:66:CC",
        name: "Normal Sensor",
        variable: "pressure",
        unit: "hPa",
        gateway: gateway2,
      });

      await TestDataSource.getRepository(MeasurementDAO).save([
        { createdAt: new Date(), value: 1010.0, sensor: sensor3 },
        { createdAt: new Date(), value: 1012.0, sensor: sensor3 },
      ]);

      const startDate = new Date();
      startDate.setDate(startDate.getDate() - 2);
      const endDate = new Date();

      const result = await getOutliersBySensorSet(
        network.code,
        [sensor3.macAddress],
        startDate,
        endDate
      );

      expect(result).toHaveLength(1);
      const sensorResult = result[0];
      expect(sensorResult.sensorMacAddress).toBe(sensor3.macAddress);

      if (sensorResult.measurements) {
        expect(sensorResult.measurements.length).toBe(0);
      }
    });

    it("should throw NotFoundError for non-existent network", async () => {
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - 2);
      const endDate = new Date();

      await expect(
        getOutliersBySensorSet("NONEXISTENT", [], startDate, endDate)
      ).rejects.toThrow(NotFoundError);
    });
  });

  describe("getStatsBySensor", () => {
    it("should retrieve stats for a single sensor", async () => {
      const { network, gateway, sensors } = await setupTestData();
      const sensor = sensors[0];

      const startDate = new Date();
      startDate.setDate(startDate.getDate() - 2);
      const endDate = new Date();

      const result = await getStatsBySensor(
        network.code,
        gateway.macAddress,
        sensor.macAddress,
        startDate,
        endDate
      );

      expect(result).toBeDefined();
      expect(result.mean).toBeDefined();
      expect(result.variance).toBeDefined();
      expect(result.upperThreshold).toBeDefined();
      expect(result.lowerThreshold).toBeDefined();
    });

    it("should throw NotFoundError for non-existent sensor", async () => {
      const { network, gateway } = await setupTestData();
      const nonExistentSensorMac = "11:22:33:ZZ";

      const startDate = new Date();
      startDate.setDate(startDate.getDate() - 2);
      const endDate = new Date();

      await expect(
        getStatsBySensor(
          network.code,
          gateway.macAddress,
          nonExistentSensorMac,
          startDate,
          endDate
        )
      ).rejects.toThrow(NotFoundError);
    });
  });

  describe("getOutliersBySensor", () => {
    it("should retrieve only outlier measurements for a single sensor", async () => {
      const { network, gateway, sensors, outlierValue } = await setupTestData();
      const sensor = sensors[0];

      const startDate = new Date();
      startDate.setDate(startDate.getDate() - 2);
      const endDate = new Date();

      const result = await getOutliersBySensor(
        network.code,
        gateway.macAddress,
        sensor.macAddress,
        startDate,
        endDate
      );

      expect(result).toBeDefined();
      expect(result.sensorMacAddress).toBe(sensor.macAddress);
      expect(result.stats).toBeDefined();

      expect(result.measurements).toBeDefined();
      if (result.measurements && result.measurements.length > 0) {
        expect(result.measurements.some((m) => m.value === outlierValue)).toBe(
          true
        );
      }
    });

    it("should throw NotFoundError for non-existent sensor", async () => {
      const { network, gateway } = await setupTestData();
      const nonExistentSensorMac = "11:22:33:ZZ";

      const startDate = new Date();
      startDate.setDate(startDate.getDate() - 2);
      const endDate = new Date();

      await expect(
        getOutliersBySensor(
          network.code,
          gateway.macAddress,
          nonExistentSensorMac,
          startDate,
          endDate
        )
      ).rejects.toThrow(NotFoundError);
    });
  });
});
