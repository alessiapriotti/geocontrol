import request from "supertest";
import { app } from "@app";
import { generateToken } from "@services/authService";
import { beforeAllE2e, afterAllE2e, TEST_USERS } from "@test/e2e/lifecycle";
import { TestDataSource } from "@test/setup/test-datasource";
import { NetworkDAO } from "@models/dao/NetworkDAO";
import { GatewayDAO } from "@models/dao/GatewayDAO";
import { SensorDAO } from "@models/dao/SensorDAO";
import { Sensor as SensorDTO } from "@models/dto/Sensor";

describe("Sensor routes (e2e)", () => {
  let token: string;

  beforeAll(async () => {
    await beforeAllE2e();
    token = generateToken(TEST_USERS.admin);
  });

  afterAll(async () => {
    await afterAllE2e();
  });

  beforeEach(async () => {
    await TestDataSource.getRepository(NetworkDAO).clear();
    await TestDataSource.getRepository(GatewayDAO).clear();
    await TestDataSource.getRepository(SensorDAO).clear();
  });

  describe("TS1: GET /networks/:networkCode/gateways/:gatewayMac/sensors", () => {
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
      };

      const res = await request(app)
        .post(`/api/v1/networks/${NET}/gateways/${GAT}/sensors`)
        .set("Authorization", `Bearer ${token}`)
        .send(sensorDTO);

      expect(res.status).toBe(201);

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
        name: "bbb",
        description: "bbb",
        variable: "temp",
        unit: "K"
      };
      
      const res = await request(app)
        .post(`/api/v1/networks/${NET}/gateways/${GAT}/sensors`)
        .set("Authorization", `Bearer ${token}`)
        .send(sensorDTO);

      expect(res.status).toBe(409);
      expect(res.body.name).toBe("ConflictError");
    }); 
        
    it("T1.3: Invalid MAC (empty string)", async () => {
      const MAC = "";
      const sensorDTO: SensorDTO = {
        macAddress: MAC,
        name: "aaa",
        description: "aaa",
        variable: "temp",
        unit: "K"
      };
      
      const res = await request(app)
        .post(`/api/v1/networks/${NET}/gateways/${GAT}/sensors`)
        .set("Authorization", `Bearer ${token}`)
        .send(sensorDTO);
      
      expect(res.status).toBe(400);
      expect(res.body.name).toBe("Bad Request"); //TODO: Attendere risposta di Mancini
    });

    it("T1.4: Invalid MAC (spaces only)", async () => {
      const MAC = "    ";
      const sensorDTO: SensorDTO = {
        macAddress: MAC,
        name: "aaa",
        description: "aaa",
        variable: "temp",
        unit: "K"
      };
      
      const res = await request(app)
        .post(`/api/v1/networks/${NET}/gateways/${GAT}/sensors`)
        .set("Authorization", `Bearer ${token}`)
        .send(sensorDTO);
      
      expect(res.status).toBe(400);
      expect(res.body.name).toBe("Bad Request"); //TODO: Attendere risposta di Mancini
    });

    it("T1.5: Invalid MAC (null)", async () => {
      const MAC: string = null;
      const sensorDTO: SensorDTO = {
        macAddress: MAC,
        name: "aaa",
        description: "aaa",
        variable: "temp",
        unit: "K"
      };
      
      const res = await request(app)
        .post(`/api/v1/networks/${NET}/gateways/${GAT}/sensors`)
        .set("Authorization", `Bearer ${token}`)
        .send(sensorDTO);
      
      expect(res.status).toBe(400);
      expect(res.body.name).toBe("Bad Request"); //TODO: Attendere risposta di Mancini
    });

    it("T1.6: Valid MAC, name with spaces", async () => {
      const MAC = "11:22:33:bb";
      const NAME = "     ";
      const sensorDTO: SensorDTO = {
        macAddress: MAC,
        name: NAME,
        description: "aaa",
        variable: "temp",
        unit: "K"
      };
      
      const res = await request(app)
        .post(`/api/v1/networks/${NET}/gateways/${GAT}/sensors`)
        .set("Authorization", `Bearer ${token}`)
        .send(sensorDTO);
      
      expect(res.status).toBe(201);

      await expect(
        TestDataSource.getRepository(SensorDAO).findOneOrFail({ where: { macAddress: MAC } })
      ).resolves.toMatchObject({
        macAddress: MAC,
        name: "",
      } as SensorDAO);
    });
  });
});