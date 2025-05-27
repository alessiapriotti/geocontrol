import {
  initializeTestDataSource,
  closeTestDataSource,
  TestDataSource
} from "@test/setup/test-datasource";
import { NetworkDAO } from "@models/dao/NetworkDAO";
import { GatewayDAO } from "@models/dao/GatewayDAO";
import { SensorDAO } from "@models/dao/SensorDAO";
import * as ctrl from "@controllers/sensorController";
import { Sensor as SensorDTO } from "@models/dto/Sensor";
import { ConflictError } from "@models/errors/ConflictError";
import { NotFoundError } from "@models/errors/NotFoundError";

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

describe("SensorController integration: actual Repository, SQLite in-memory", () => {
  describe("TS1: createSensor()", () => {
    const NET = "NET01";
    const GAT = "11:22:33";

    // Setup del DB pre-test
    beforeEach(async () => {
      let network = await TestDataSource.getRepository(NetworkDAO).save({code: NET});
      let gateway = await TestDataSource.getRepository(GatewayDAO).save({macAddress: GAT, network: network})
      await TestDataSource.getRepository(SensorDAO).save({macAddress: "11:22:33:aa", gateway: gateway});
    });

    it("T1.1: All valid params", async () => {
      const MAC = "11:22:33:bb";
      const sensorDTO: SensorDTO = {
        macAddress: MAC,
        name: "bbb",
        description: "bbb",
        variable: "temp",
        unit: "K"
      }
      await ctrl.createSensor(NET, GAT, sensorDTO);

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
      const sensorDTO: SensorDTO = {
        macAddress: MAC,
        name: "aaa",
        description: "aaa",
        variable: "temp",
        unit: "K"
      }

      await expect(
        ctrl.createSensor(NET, GAT, sensorDTO)
      ).rejects.toThrow(ConflictError);
    });

    it("T1.3: Invalid MAC (null)", async () => {
      const MAC: string = null;
      const sensorDTO: SensorDTO = {
        macAddress: MAC,
        name: "aaa",
        description: "aaa",
        variable: "temp",
        unit: "K"
      }
      
      await expect(
        ctrl.createSensor(NET, GAT, sensorDTO)
      ).rejects.toThrow();
    });
  });

  describe("TS2: getAllSensors()", () => {
    const NET = "NET01";
    const GAT = "11:22:33";
    const NET2 = "NET02";
    const GAT2 = "22:33:44";

    // Setup del DB pre-test
    beforeEach(async () => {
      let network = await TestDataSource.getRepository(NetworkDAO).save({code: NET});
      let gateway = await TestDataSource.getRepository(GatewayDAO).save({macAddress: GAT, network: network})
      await TestDataSource.getRepository(SensorDAO).save({macAddress: "11:22:33:aa", gateway: gateway});
      await TestDataSource.getRepository(SensorDAO).save({macAddress: "11:22:33:bb", gateway: gateway});
      
      let network2 = await TestDataSource.getRepository(NetworkDAO).save({code: NET2});
      let gateway2 = await TestDataSource.getRepository(GatewayDAO).save({macAddress: GAT2, network: network2})
      await TestDataSource.getRepository(SensorDAO).save({macAddress: "22:33:44:aa", gateway: gateway2});
    });

    it("T2.1: All valid params", async () => {
      const sensors = await ctrl.getAllSensors(NET, GAT);

      expect(Array.isArray(sensors)).toBe(true);
      expect(sensors).toHaveLength(2);
      expect(sensors.map(s => s.macAddress).sort()).toEqual(["11:22:33:aa", "11:22:33:bb"]);
    });

    it("T2.2: Gateway not found", async () => {
      await expect(ctrl.getAllSensors(NET, "pippo")).rejects.toThrow(NotFoundError);
    });

    it("T2.3: Gateway not bound to passed network", async () => {
      await expect(ctrl.getAllSensors(NET, GAT2)).rejects.toThrow(NotFoundError);
    });

    it("T2.4: Network not found", async () => {
      await expect(ctrl.getAllSensors("pippo", GAT)).rejects.toThrow(NotFoundError);
    });

    it("T2.5: Invalid Gateway MAC (empty string)", async () => {
      await expect(ctrl.getAllSensors(NET, "")).rejects.toThrow(NotFoundError);
    });

    it("T2.6: Invalid Network Code (empty string)", async () => {
      await expect(ctrl.getAllSensors("", GAT)).rejects.toThrow(NotFoundError);
    });

    it("T2.7: Null Gateway MAC", async () => {
      // Non può arrivare un valore null dall'alto. 
      // Quindi facciamo la query con null, che ignora il vincolo.
      const sensors = await ctrl.getAllSensors("NET01", null);

      expect(Array.isArray(sensors)).toBe(true);
      expect(sensors).toHaveLength(2);
      expect(sensors.map(s => s.macAddress).sort()).toEqual(["11:22:33:aa", "11:22:33:bb"]);
    });

    it("T2.8: Null Network Code", async () => {
      // Non può arrivare un valore null dall'alto. 
      // Quindi facciamo la query con null, che ignora il vincolo.
      const sensors = await ctrl.getAllSensors(null, "11:22:33");

      expect(Array.isArray(sensors)).toBe(true);
      expect(sensors).toHaveLength(2);
      expect(sensors.map(s => s.macAddress).sort()).toEqual(["11:22:33:aa", "11:22:33:bb"]);
    });
  });

  describe("TS3: getSensorByMacAddress()", () => {
    const NET = "NET01";
    const GAT = "11:22:33";
    const NET2 = "NET02";
    const GAT2 = "22:33:44";

    // Setup del DB pre-test
    beforeEach(async () => {
      let network = await TestDataSource.getRepository(NetworkDAO).save({code: NET});
      let gateway = await TestDataSource.getRepository(GatewayDAO).save({macAddress: GAT, network: network})
      await TestDataSource.getRepository(SensorDAO).save({macAddress: "11:22:33:aa", gateway: gateway});
      
      let network2 = await TestDataSource.getRepository(NetworkDAO).save({code: NET2});
      let gateway2 = await TestDataSource.getRepository(GatewayDAO).save({macAddress: GAT2, network: network2})
      await TestDataSource.getRepository(SensorDAO).save({macAddress: "22:33:44:aa", gateway: gateway2});
    });

    it("T3.1: All valid params", async () => {
      const NET = "NET01";
      const GAT = "11:22:33";
      const MAC = "11:22:33:aa";
      await expect(ctrl.getSensorByMacAddress(NET, GAT, MAC)).resolves.toMatchObject({
        macAddress: MAC
      });
    });

    it("T3.2: Invalid Sensor MAC", async () => {
      const NET = "NET01";
      const GAT = "11:22:33";
      const MAC = "pippo";
      await expect(ctrl.getSensorByMacAddress(NET, GAT, MAC)).rejects.toThrow(NotFoundError);
    });

    it("T3.3: Sensor MAC not bound to passed gateway", async () => {
      const NET = "NET01";
      const GAT = "11:22:33";
      const MAC = "22:33:44:aa";
      await expect(ctrl.getSensorByMacAddress(NET, GAT, MAC)).rejects.toThrow(NotFoundError);
    });

    it("T3.4: Invalid Sensor MAC (empty string)", async () => {
      const NET = "NET01";
      const GAT = "11:22:33";
      const MAC = "";
      await expect(ctrl.getSensorByMacAddress(NET, GAT, MAC)).rejects.toThrow(NotFoundError);
    });

    it("T3.6: Invalid Gateway MAC", async () => {
      const NET = "NET01";
      const GAT = "pippo";
      const MAC = "11:22:33:aa";
      await expect(ctrl.getSensorByMacAddress(NET, GAT, MAC)).rejects.toThrow(NotFoundError);
    });

    it("T3.7: Gateway not bound to passed network", async () => {
      const NET = "NET01";
      const GAT = "22:33:44";
      const MAC = "11:22:33:aa";
      await expect(ctrl.getSensorByMacAddress(NET, GAT, MAC)).rejects.toThrow(NotFoundError);
    });

    it("T3.8: Invalid Gateway MAC (empty string)", async () => {
      const NET = "NET01";
      const GAT = "";
      const MAC = "11:22:33:aa";
      await expect(ctrl.getSensorByMacAddress(NET, GAT, MAC)).rejects.toThrow(NotFoundError);
    });

    it("T3.10: Invalid Network Code", async () => {
      const NET = "pippo";
      const GAT = "11:22:33";
      const MAC = "11:22:33:aa";
      await expect(ctrl.getSensorByMacAddress(NET, GAT, MAC)).rejects.toThrow(NotFoundError);
    });

    it("T3.11: Invalid Network Code (empty string)", async () => {
      const NET = "";
      const GAT = "11:22:33";
      const MAC = "11:22:33:aa";
      await expect(ctrl.getSensorByMacAddress(NET, GAT, MAC)).rejects.toThrow(NotFoundError);
    });
  });

  describe("TS4: updateSensor()", () => {
    const NET = "NET01";
    const GAT = "11:22:33";

    // Setup del DB pre-test
    beforeEach(async () => {
      let network = await TestDataSource.getRepository(NetworkDAO).save({code: NET});
      let gateway = await TestDataSource.getRepository(GatewayDAO).save({macAddress: GAT, network: network})
      await TestDataSource.getRepository(SensorDAO).save({macAddress: "11:22:33:aa", gateway: gateway});
      await TestDataSource.getRepository(SensorDAO).save({macAddress: "11:22:33:bb", gateway: gateway});
    });

    it("T4.1: All valid params", async () => {
      const MAC = "11:22:33:aa";
      const NEW_MAC = "11:22:33:ab";
      const sensorDTO: SensorDTO = {
        macAddress: NEW_MAC,
        name: "aaa",
        description: "aaa",
        variable: "aaa",
        unit: "aaa"
      };
      
      await ctrl.updateSensor(NET, GAT, MAC, sensorDTO);

      await expect(
        TestDataSource.getRepository(SensorDAO).findOneOrFail({ where: { macAddress: NEW_MAC } })
      ).resolves.toMatchObject({
        macAddress: NEW_MAC,
        name: "aaa",
        description: "aaa",
        variable: "aaa",
        unit: "aaa"
      } as SensorDAO);
    });

    it("T4.3: No MAC address change (undefined)", async () => {
      const MAC = "11:22:33:aa";
      const sensorDTO: SensorDTO = {
        // missing macAddress
        name: "aaa",
        description: "aaa",
        variable: "aaa",
        unit: "aaa"
      };
      
      await ctrl.updateSensor(NET, GAT, MAC, sensorDTO);

      await expect(
        TestDataSource.getRepository(SensorDAO).findOneOrFail({ where: { macAddress: MAC } })
      ).resolves.toMatchObject({
        macAddress: MAC,
        name: "aaa",
        description: "aaa",
        variable: "aaa",
        unit: "aaa"
      } as SensorDAO);
    });

    it("T4.4: No MAC address change (NEW_MAC == MAC)", async () => {
      const MAC = "11:22:33:aa";
      const sensorDTO: SensorDTO = {
        macAddress: MAC,
        name: "aaa",
        description: "aaa",
        variable: "aaa",
        unit: "aaa"
      };
      
      await ctrl.updateSensor(NET, GAT, MAC, sensorDTO);

      await expect(
        TestDataSource.getRepository(SensorDAO).findOneOrFail({ where: { macAddress: MAC } })
      ).resolves.toMatchObject({
        macAddress: MAC,
        name: "aaa",
        description: "aaa",
        variable: "aaa",
        unit: "aaa"
      } as SensorDAO);
    });

    it("T4.5: MAC address change to create conflict", async () => {
      const MAC = "11:22:33:bb";
      const NEW_MAC = "11:22:33:aa";
      const sensorDTO: SensorDTO = {
        macAddress: NEW_MAC,
        name: "aaa",
        description: "aaa",
        variable: "aaa",
        unit: "aaa"
      };
      
      await expect(ctrl.updateSensor(NET, GAT, MAC, sensorDTO)).rejects.toThrow(ConflictError);
    });

    it("T4.9: Invalid Sensor MAC", async () => {
      const MAC = "pippo";
      const NEW_MAC = "11:22:33:xx";
      const sensorDTO: SensorDTO = {
        macAddress: NEW_MAC,
        name: "aaa",
        description: "aaa",
        variable: "aaa",
        unit: "aaa"
      };
      
      await expect(ctrl.updateSensor(NET, GAT, MAC, sensorDTO)).rejects.toThrow(NotFoundError);
    });

    it("T4.10: Invalid Sensor MAC (empty string)", async () => {
      const MAC = "";
      const NEW_MAC = "11:22:33:xx";
      const sensorDTO: SensorDTO = {
        macAddress: NEW_MAC,
        name: "aaa",
        description: "aaa",
        variable: "aaa",
        unit: "aaa"
      };
      
      await expect(ctrl.updateSensor(NET, GAT, MAC, sensorDTO)).rejects.toThrow(NotFoundError);
    });
  });

  describe("TS5: deleteSensor()", () => {
    const NET = "NET01";
    const GAT = "11:22:33";
    const NET2 = "NET02";
    const GAT2 = "22:33:44";

    // Setup del DB pre-test
    beforeEach(async () => {
      let network = await TestDataSource.getRepository(NetworkDAO).save({code: NET});
      let gateway = await TestDataSource.getRepository(GatewayDAO).save({macAddress: GAT, network: network})
      await TestDataSource.getRepository(SensorDAO).save({macAddress: "11:22:33:aa", gateway: gateway});
      
      let network2 = await TestDataSource.getRepository(NetworkDAO).save({code: NET2});
      let gateway2 = await TestDataSource.getRepository(GatewayDAO).save({macAddress: GAT2, network: network2})
      await TestDataSource.getRepository(SensorDAO).save({macAddress: "22:33:44:aa", gateway: gateway2});
    });

    it("T5.1: All valid params", async () => {
      const NET = "NET01";
      const GAT = "11:22:33";
      const MAC = "11:22:33:aa";
      await expect(ctrl.deleteSensor(NET, GAT, MAC)).resolves.not.toThrow();
    });

    it("T5.2: Invalid Sensor MAC", async () => {
      const NET = "NET01";
      const GAT = "11:22:33";
      const MAC = "pippo";
      await expect(ctrl.deleteSensor(NET, GAT, MAC)).rejects.toThrow(NotFoundError);
    });

    it("T5.3: Sensor MAC not bound to passed gateway", async () => {
      const NET = "NET01";
      const GAT = "11:22:33";
      const MAC = "22:33:44:aa";
      await expect(ctrl.deleteSensor(NET, GAT, MAC)).rejects.toThrow(NotFoundError);
    });

    it("T5.4: Invalid Sensor MAC (empty string)", async () => {
      const NET = "NET01";
      const GAT = "11:22:33";
      const MAC = "";
      await expect(ctrl.deleteSensor(NET, GAT, MAC)).rejects.toThrow(NotFoundError);
    });

    it("T5.6: Invalid Gateway MAC", async () => {
      const NET = "NET01";
      const GAT = "pippo";
      const MAC = "11:22:33:aa";
      await expect(ctrl.deleteSensor(NET, GAT, MAC)).rejects.toThrow(NotFoundError);
    });

    it("T5.7: Gateway not bound to passed network", async () => {
      const NET = "NET01";
      const GAT = "22:33:44";
      const MAC = "11:22:33:aa";
      await expect(ctrl.deleteSensor(NET, GAT, MAC)).rejects.toThrow(NotFoundError);
    });

    it("T5.8: Invalid Gateway MAC (empty string)", async () => {
      const NET = "NET01";
      const GAT = "";
      const MAC = "11:22:33:aa";
      await expect(ctrl.deleteSensor(NET, GAT, MAC)).rejects.toThrow(NotFoundError);
    });

    it("T5.10: Invalid Network Code", async () => {
      const NET = "pippo";
      const GAT = "11:22:33";
      const MAC = "11:22:33:aa";
      await expect(ctrl.deleteSensor(NET, GAT, MAC)).rejects.toThrow(NotFoundError);
    });

    it("T5.11: Invalid Network Code (empty string)", async () => {
      const NET = "";
      const GAT = "11:22:33";
      const MAC = "11:22:33:aa";
      await expect(ctrl.deleteSensor(NET, GAT, MAC)).rejects.toThrow(NotFoundError);
    });
  });
});