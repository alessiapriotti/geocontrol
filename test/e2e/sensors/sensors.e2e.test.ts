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
  const BadRequest = "Bad Request";
  const ConflictError = "ConflictError";
  const InsufficientRightsError = "InsufficientRightsError";
  const UnauthorizedError = "UnauthorizedError";
  const NotFoundError = "NotFoundError";
  const tokenInvalid = "abcdefghijklmnopqrstuvwxyz";
  let token: string;
  let tokenViewer: string;

  beforeAll(async () => {
    await beforeAllE2e();
    token = generateToken(TEST_USERS.admin);
    tokenViewer = generateToken(TEST_USERS.viewer);
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

    it("T1.1: All valid params", async () => {
      const res = await request(app)
        .get(`/api/v1/networks/${NET}/gateways/${GAT}/sensors`)
        .set("Authorization", `Bearer ${token}`);

      expect(res.status).toBe(200);

      const sensors = res.body;
      expect(Array.isArray(sensors)).toBe(true);
      expect(sensors).toHaveLength(2);
      expect(sensors.map((s: SensorDAO) => s.macAddress).sort()).toEqual(["11:22:33:aa", "11:22:33:bb"]);
    });

    it("T1.2: Gateway not found", async () => {
      const GAT = "pippo";

      const res = await request(app)
        .get(`/api/v1/networks/${NET}/gateways/${GAT}/sensors`)
        .set("Authorization", `Bearer ${token}`);

      expect(res.status).toBe(404);
      expect(res.body.name).toBe(NotFoundError);
    });

    it("T1.3: Gateway not bound to passed network", async () => {
      const GAT = GAT2;
      
      const res = await request(app)
        .get(`/api/v1/networks/${NET}/gateways/${GAT}/sensors`)
        .set("Authorization", `Bearer ${token}`);

      expect(res.status).toBe(404);
      expect(res.body.name).toBe(NotFoundError);
    });

    it("T1.4: Network not found", async () => {
      const NET = "pippo";
      
      const res = await request(app)
        .get(`/api/v1/networks/${NET}/gateways/${GAT}/sensors`)
        .set("Authorization", `Bearer ${token}`);

      expect(res.status).toBe(404);
      expect(res.body.name).toBe(NotFoundError);
    });

    // --- Realizza una richiesta ad un'altra rotta
    // it("T1.5: Invalid Gateway MAC (empty string)", async () => {
    //   const GAT = "";
      
    //   const res = await request(app)
    //     .get(`/api/v1/networks/${NET}/gateways/${GAT}/sensors`)
    //     .set("Authorization", `Bearer ${token}`);

    //   expect(res.status).toBe(404);
    //   expect(res.body.name).toBe(NotFoundError);
    // });

    // --- Realizza una richiesta ad un'altra rotta
    // it("T1.6: Invalid Network Code (empty string)", async () => {
    //   const NET = "";
      
    //   const res = await request(app)
    //     .get(`/api/v1/networks/${NET}/gateways/${GAT}/sensors`)
    //     .set("Authorization", `Bearer ${token}`);

    //   expect(res.status).toBe(404);
    //   expect(res.body.name).toBe(NotFoundError);
    // });

    it("T1.5: Null Gateway MAC", async () => {
      const GAT: string = null;
      
      const res = await request(app)
        .get(`/api/v1/networks/${NET}/gateways/${GAT}/sensors`)
        .set("Authorization", `Bearer ${token}`);

      expect(res.status).toBe(404);
      expect(res.body.name).toBe(NotFoundError);
    });

    it("T1.6: Null Network Code", async () => {
      const NET: string = null;
      
      const res = await request(app)
        .get(`/api/v1/networks/${NET}/gateways/${GAT}/sensors`)
        .set("Authorization", `Bearer ${token}`);

      expect(res.status).toBe(404);
      expect(res.body.name).toBe(NotFoundError);
    });
  });

  describe("TS2: POST /networks/:networkCode/gateways/:gatewayMac/sensors", () => {
    const NET = "NET01";
    const GAT = "11:22:33";

    // Setup del DB pre-test
    beforeEach(async () => {
      let network = await TestDataSource.getRepository(NetworkDAO).save({code: NET});
      let gateway = await TestDataSource.getRepository(GatewayDAO).save({macAddress: GAT, network: network})
      await TestDataSource.getRepository(SensorDAO).save({macAddress: "11:22:33:aa", gateway: gateway});
    });

    it("T2.1: All valid params", async () => {
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

    it("T2.2: Error if sensor with same MAC exists", async () => {
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
      expect(res.body.name).toBe(ConflictError);
    }); 
        
    it("T2.3: Invalid MAC (empty string)", async () => {
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
      expect(res.body.name).toBe(BadRequest);
    });

    it("T2.4: Invalid MAC (spaces only)", async () => {
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
      expect(res.body.name).toBe(BadRequest);
    });

    it("T2.5: Invalid MAC (null)", async () => {
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
      expect(res.body.name).toBe(BadRequest);
    });

    it("T2.6: Valid MAC, name with spaces", async () => {
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

    it("T2.7: Invalid Network Code", async () => {
      const NET = "pippo";
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
      
      expect(res.status).toBe(404);
      expect(res.body.name).toBe(NotFoundError);
    });

    it("T2.8: Invalid Gateway MAC", async () => {
      const GAT = "pippo";
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
      
      expect(res.status).toBe(404);
      expect(res.body.name).toBe(NotFoundError);
    });

    it("T2.9: Invalid token", async () => {
      const MAC = "11:22:33:bb";
      const sensorDTO: SensorDTO = {
        macAddress: MAC,
        name: "aaa",
        description: "aaa",
        variable: "temp",
        unit: "K"
      };
      
      const res = await request(app)
        .post(`/api/v1/networks/${NET}/gateways/${GAT}/sensors`)
        .set("Authorization", `Bearer ${tokenInvalid}`)
        .send(sensorDTO);

      expect(res.status).toBe(401);
      expect(res.body.name).toBe(UnauthorizedError);
    });

    it("T2.10: Insufficient permissions", async () => {
      const MAC = "11:22:33:bb";
      const sensorDTO: SensorDTO = {
        macAddress: MAC,
        name: "aaa",
        description: "aaa",
        variable: "temp",
        unit: "K"
      };
      
      const res = await request(app)
        .post(`/api/v1/networks/${NET}/gateways/${GAT}/sensors`)
        .set("Authorization", `Bearer ${tokenViewer}`)
        .send(sensorDTO);
      
      expect(res.status).toBe(403);
      expect(res.body.name).toBe(InsufficientRightsError);
    });
  });

  describe("TS3: GET /networks/:networkCode/gateways/:gatewayMac/sensors/:sensorMac", () => {
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
      const MAC = "11:22:33:aa";

      const res = await request(app)
        .get(`/api/v1/networks/${NET}/gateways/${GAT}/sensors/${MAC}`)
        .set("Authorization", `Bearer ${token}`);

      expect(res.status).toBe(200);
      expect(res.body).toMatchObject({
        macAddress: MAC
      });
    });

    it("T3.2: Invalid Sensor MAC", async () => {
      const MAC = "pippo";

      const res = await request(app)
        .get(`/api/v1/networks/${NET}/gateways/${GAT}/sensors/${MAC}`)
        .set("Authorization", `Bearer ${token}`);

      expect(res.status).toBe(404);
      expect(res.body.name).toBe(NotFoundError);
    });

    it("T3.3: Sensor MAC not bound to passed gateway", async () => {
      const MAC = "22:33:44:aa";

      const res = await request(app)
        .get(`/api/v1/networks/${NET}/gateways/${GAT}/sensors/${MAC}`)
        .set("Authorization", `Bearer ${token}`);

      expect(res.status).toBe(404);
      expect(res.body.name).toBe(NotFoundError);
    });

    // --- Realizza una richiesta ad un'altra rotta
    // it("T3.4: Invalid Sensor MAC (empty string)", async () => {
    //   const MAC = "";

    //   const res = await request(app)
    //     .get(`/api/v1/networks/${NET}/gateways/${GAT}/sensors/${MAC}`)
    //     .set("Authorization", `Bearer ${token}`);

    //   expect(res.status).toBe(404);
    //   expect(res.body.name).toBe(NotFoundError);
    // });

    it("T3.4: Null Sensor MAC", async () => {
      const MAC = null;

      const res = await request(app)
        .get(`/api/v1/networks/${NET}/gateways/${GAT}/sensors/${MAC}`)
        .set("Authorization", `Bearer ${token}`);

      expect(res.status).toBe(404);
      expect(res.body.name).toBe(NotFoundError);
    });

    it("T3.5: Invalid Gateway MAC", async () => {
      const GAT = "pippo";
      const MAC = "11:22:33:aa";
      
      const res = await request(app)
        .get(`/api/v1/networks/${NET}/gateways/${GAT}/sensors/${MAC}`)
        .set("Authorization", `Bearer ${token}`);

      expect(res.status).toBe(404);
      expect(res.body.name).toBe(NotFoundError);
    });

    it("T3.6: Gateway not bound to passed network", async () => {
      const GAT = "22:33:44";
      const MAC = "11:22:33:aa";

      const res = await request(app)
        .get(`/api/v1/networks/${NET}/gateways/${GAT}/sensors/${MAC}`)
        .set("Authorization", `Bearer ${token}`);

      expect(res.status).toBe(404);
      expect(res.body.name).toBe(NotFoundError);
    });

    // --- Realizza una richiesta ad una rotta non valida
    it("T3.7: Invalid Gateway MAC (empty string)", async () => {
      const GAT = "";
      const MAC = "11:22:33:aa";

      const res = await request(app)
        .get(`/api/v1/networks/${NET}/gateways/${GAT}/sensors/${MAC}`)
        .set("Authorization", `Bearer ${token}`);

      expect(res.status).toBe(404);
      //expect(res.body.name).toBe(NotFoundError);
    });

    it("T3.8: Null Gateway MAC", async () => {
      const GAT = null;
      const MAC = "11:22:33:aa";

      const res = await request(app)
        .get(`/api/v1/networks/${NET}/gateways/${GAT}/sensors/${MAC}`)
        .set("Authorization", `Bearer ${token}`);

      expect(res.status).toBe(404);
      expect(res.body.name).toBe(NotFoundError);
    });

    it("T3.9: Invalid Network Code", async () => {
      const NET = "pippo";
      const MAC = "11:22:33:aa";

      const res = await request(app)
        .get(`/api/v1/networks/${NET}/gateways/${GAT}/sensors/${MAC}`)
        .set("Authorization", `Bearer ${token}`);

      expect(res.status).toBe(404);
      expect(res.body.name).toBe(NotFoundError);
    });

    // --- Realizza una richiesta ad una rotta non valida
    it("T3.10: Invalid Network Code (empty string)", async () => {
      const NET = "";
      const MAC = "11:22:33:aa";

      const res = await request(app)
        .get(`/api/v1/networks/${NET}/gateways/${GAT}/sensors/${MAC}`)
        .set("Authorization", `Bearer ${token}`);

      expect(res.status).toBe(404);
      //expect(res.body.name).toBe(NotFoundError);
    });

    it("T3.11: Null Network Code", async () => {
      const NET = null;
      const MAC = "11:22:33:aa";

      const res = await request(app)
        .get(`/api/v1/networks/${NET}/gateways/${GAT}/sensors/${MAC}`)
        .set("Authorization", `Bearer ${token}`);

      expect(res.status).toBe(404);
      expect(res.body.name).toBe(NotFoundError);
    });
  });

  describe("TS4: PATCH /networks/:networkCode/gateways/:gatewayMac/sensors/:sensorMac", () => {
    const NET = "NET01";
    const GAT = "11:22:33"

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

      const res = await request(app)
        .patch(`/api/v1/networks/${NET}/gateways/${GAT}/sensors/${MAC}`)
        .set("Authorization", `Bearer ${token}`)
        .send(sensorDTO);

      expect(res.status).toBe(204);

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

    it("T4.2: Optional params with spaces", async () => {
      const MAC = "11:22:33:aa";
      const NEW_MAC = "11:22:33:ab";
      const sensorDTO: SensorDTO = {
        macAddress: NEW_MAC,
        name: "aaa     ",
        description: "aaa",
        variable: "aaa",
        unit: "aaa"
      };

      const res = await request(app)
        .patch(`/api/v1/networks/${NET}/gateways/${GAT}/sensors/${MAC}`)
        .set("Authorization", `Bearer ${token}`)
        .send(sensorDTO);

      expect(res.status).toBe(204);

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
        name: "aaa",
        description: "aaa",
        variable: "aaa",
        unit: "aaa"
      };

      const res = await request(app)
        .patch(`/api/v1/networks/${NET}/gateways/${GAT}/sensors/${MAC}`)
        .set("Authorization", `Bearer ${token}`)
        .send(sensorDTO);

      expect(res.status).toBe(204);

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
      const NEW_MAC = MAC;
      const sensorDTO: SensorDTO = {
        macAddress: NEW_MAC,
        name: "aaa",
        description: "aaa",
        variable: "aaa",
        unit: "aaa"
      };

      const res = await request(app)
        .patch(`/api/v1/networks/${NET}/gateways/${GAT}/sensors/${MAC}`)
        .set("Authorization", `Bearer ${token}`)
        .send(sensorDTO);

      expect(res.status).toBe(204);

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

      const res = await request(app)
        .patch(`/api/v1/networks/${NET}/gateways/${GAT}/sensors/${MAC}`)
        .set("Authorization", `Bearer ${token}`)
        .send(sensorDTO);

      expect(res.status).toBe(409);
      expect(res.body.name).toBe(ConflictError);
    });

    it("T4.6: MAC address change to empty string", async () => {
      const MAC = "11:22:33:bb";
      const NEW_MAC = "";
      const sensorDTO: SensorDTO = {
        macAddress: NEW_MAC,
        name: "aaa",
        description: "aaa",
        variable: "aaa",
        unit: "aaa"
      };

      const res = await request(app)
        .patch(`/api/v1/networks/${NET}/gateways/${GAT}/sensors/${MAC}`)
        .set("Authorization", `Bearer ${token}`)
        .send(sensorDTO);

      expect(res.status).toBe(400);
      expect(res.body.name).toBe(BadRequest);
    });

    it("T4.7: MAC address change to only spaces", async () => {
      const MAC = "11:22:33:bb";
      const NEW_MAC = "    ";
      const sensorDTO: SensorDTO = {
        macAddress: NEW_MAC,
        name: "aaa",
        description: "aaa",
        variable: "aaa",
        unit: "aaa"
      };

      const res = await request(app)
        .patch(`/api/v1/networks/${NET}/gateways/${GAT}/sensors/${MAC}`)
        .set("Authorization", `Bearer ${token}`)
        .send(sensorDTO);

      expect(res.status).toBe(400);
      expect(res.body.name).toBe(BadRequest);
    });

    it("T4.8: MAC address change to null", async () => {
      const MAC = "11:22:33:bb";
      const NEW_MAC = null;
      const sensorDTO: SensorDTO = {
        macAddress: NEW_MAC,
        name: "aaa",
        description: "aaa",
        variable: "aaa",
        unit: "aaa"
      };

      const res = await request(app)
        .patch(`/api/v1/networks/${NET}/gateways/${GAT}/sensors/${MAC}`)
        .set("Authorization", `Bearer ${token}`)
        .send(sensorDTO);

      expect(res.status).toBe(400);
      expect(res.body.name).toBe(BadRequest);
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

      const res = await request(app)
        .patch(`/api/v1/networks/${NET}/gateways/${GAT}/sensors/${MAC}`)
        .set("Authorization", `Bearer ${token}`)
        .send(sensorDTO);

      expect(res.status).toBe(404);
      expect(res.body.name).toBe(NotFoundError);
    });

    // --- Realizza una richiesta ad un'altra rotta
    // it("T4.10: Invalid Sensor MAC (empty string)", async () => {
    //   const MAC = "";
    //   const NEW_MAC = "11:22:33:xx";
    //   const sensorDTO: SensorDTO = {
    //     macAddress: NEW_MAC,
    //     name: "aaa",
    //     description: "aaa",
    //     variable: "aaa",
    //     unit: "aaa"
    //   };

    //   const res = await request(app)
    //     .patch(`/api/v1/networks/${NET}/gateways/${GAT}/sensors/${MAC}`)
    //     .set("Authorization", `Bearer ${token}`)
    //     .send(sensorDTO);

    //   expect(res.status).toBe(404);
    //   expect(res.body.name).toBe(NotFoundError);
    // });

    it("T4.10: Invalid Sensor MAC (null)", async () => {
      const MAC = null;
      const NEW_MAC = "11:22:33:xx";
      const sensorDTO: SensorDTO = {
        macAddress: NEW_MAC,
        name: "aaa",
        description: "aaa",
        variable: "aaa",
        unit: "aaa"
      };

      const res = await request(app)
        .patch(`/api/v1/networks/${NET}/gateways/${GAT}/sensors/${MAC}`)
        .set("Authorization", `Bearer ${token}`)
        .send(sensorDTO);

      expect(res.status).toBe(404);
      expect(res.body.name).toBe(NotFoundError);
    });

    it("T4.11: Invalid Gateway MAC", async () => {
      const GAT = "pippo";
      const MAC = "11:22:33";
      const NEW_MAC = "11:22:33:xx";
      const sensorDTO: SensorDTO = {
        macAddress: NEW_MAC,
        name: "aaa",
        description: "aaa",
        variable: "aaa",
        unit: "aaa"
      };

      const res = await request(app)
        .patch(`/api/v1/networks/${NET}/gateways/${GAT}/sensors/${MAC}`)
        .set("Authorization", `Bearer ${token}`)
        .send(sensorDTO);

      expect(res.status).toBe(404);
      expect(res.body.name).toBe(NotFoundError);
    });

    it("T4.12: Invalid Network Code", async () => {
      const NET = "pippo";
      const MAC = "11:22:33";
      const NEW_MAC = "11:22:33:xx";
      const sensorDTO: SensorDTO = {
        macAddress: NEW_MAC,
        name: "aaa",
        description: "aaa",
        variable: "aaa",
        unit: "aaa"
      };

      const res = await request(app)
        .patch(`/api/v1/networks/${NET}/gateways/${GAT}/sensors/${MAC}`)
        .set("Authorization", `Bearer ${token}`)
        .send(sensorDTO);

      expect(res.status).toBe(404);
      expect(res.body.name).toBe(NotFoundError);
    });

    it("T2.9: Invalid token", async () => {
      const MAC = "11:22:33:bb";
      const sensorDTO: SensorDTO = {
        name: "aaa",
        description: "aaa",
        variable: "temp",
        unit: "K"
      };

      const res = await request(app)
        .patch(`/api/v1/networks/${NET}/gateways/${GAT}/sensors/${MAC}`)
        .set("Authorization", `Bearer ${tokenInvalid}`)
        .send(sensorDTO);

      expect(res.status).toBe(401);
      expect(res.body.name).toBe(UnauthorizedError);
    });

    it("T2.10: Insufficient permissions", async () => {
      const MAC = "11:22:33:bb";
      const sensorDTO: SensorDTO = {
        name: "aaa",
        description: "aaa",
        variable: "temp",
        unit: "K"
      };

      const res = await request(app)
        .patch(`/api/v1/networks/${NET}/gateways/${GAT}/sensors/${MAC}`)
        .set("Authorization", `Bearer ${tokenViewer}`)
        .send(sensorDTO);
      
      expect(res.status).toBe(403);
      expect(res.body.name).toBe(InsufficientRightsError);
    });
  });

  describe("TS5: DELETE /networks/:networkCode/gateways/:gatewayMac/sensors/:sensorMac", () => {
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
      const MAC = "11:22:33:aa";

      const res = await request(app)
        .delete(`/api/v1/networks/${NET}/gateways/${GAT}/sensors/${MAC}`)
        .set("Authorization", `Bearer ${token}`);

      expect(res.status).toBe(204);
    });

    it("T5.2: Invalid Sensor MAC", async () => {
      const MAC = "pippo";

      const res = await request(app)
        .delete(`/api/v1/networks/${NET}/gateways/${GAT}/sensors/${MAC}`)
        .set("Authorization", `Bearer ${token}`);

      expect(res.status).toBe(404);
      expect(res.body.name).toBe(NotFoundError);
    });

    it("T5.3: Sensor MAC not bound to passed gateway", async () => {
      const MAC = "22:33:44:aa";
      
      const res = await request(app)
        .delete(`/api/v1/networks/${NET}/gateways/${GAT}/sensors/${MAC}`)
        .set("Authorization", `Bearer ${token}`);

      expect(res.status).toBe(404);
      expect(res.body.name).toBe(NotFoundError);
    });

    // --- Realizza una richiesta ad un'altra rotta
    // it("T5.4: Invalid Sensor MAC (empty string)", async () => {
    //   const MAC = "";

    //   const res = await request(app)
    //     .delete(`/api/v1/networks/${NET}/gateways/${GAT}/sensors/${MAC}`)
    //     .set("Authorization", `Bearer ${token}`);

    //   expect(res.status).toBe(404);
    //   expect(res.body.name).toBe(NotFoundError);
    // });

    it("T5.4: Invalid Sensor MAC (null)", async () => {
      const MAC = null;
      
      const res = await request(app)
        .delete(`/api/v1/networks/${NET}/gateways/${GAT}/sensors/${MAC}`)
        .set("Authorization", `Bearer ${token}`);

      expect(res.status).toBe(404);
      expect(res.body.name).toBe(NotFoundError);
    });

    it("T5.5: Invalid Gateway MAC", async () => {
      const GAT = "pippo";
      const MAC = "11:22:33:aa";
      
      const res = await request(app)
        .delete(`/api/v1/networks/${NET}/gateways/${GAT}/sensors/${MAC}`)
        .set("Authorization", `Bearer ${token}`);

      expect(res.status).toBe(404);
      expect(res.body.name).toBe(NotFoundError);
    });

    it("T5.6: Gateway not bound to passed network", async () => {
      const GAT = "22:33:44";
      const MAC = "11:22:33:aa";
      
      const res = await request(app)
        .delete(`/api/v1/networks/${NET}/gateways/${GAT}/sensors/${MAC}`)
        .set("Authorization", `Bearer ${token}`);

      expect(res.status).toBe(404);
      expect(res.body.name).toBe(NotFoundError);
    });

    // --- Realizza una richiesta ad un'altra rotta
    // it("T5.7: Invalid Gateway MAC (empty string)", async () => {
    //   const GAT = "";
    //   const MAC = "11:22:33:aa";
      
    //   const res = await request(app)
    //     .delete(`/api/v1/networks/${NET}/gateways/${GAT}/sensors/${MAC}`)
    //     .set("Authorization", `Bearer ${token}`);

    //   expect(res.status).toBe(404);
    //   expect(res.body.name).toBe(NotFoundError);
    // });

    it("T5.7: Invalid Gateway MAC (null)", async () => {
      const GAT = null;
      const MAC = "11:22:33:aa";
      
      const res = await request(app)
        .delete(`/api/v1/networks/${NET}/gateways/${GAT}/sensors/${MAC}`)
        .set("Authorization", `Bearer ${token}`);

      expect(res.status).toBe(404);
      expect(res.body.name).toBe(NotFoundError);
    });

    it("T5.8: Invalid Network Code", async () => {
      const NET = "pippo";
      const MAC = "11:22:33:aa";
      
      const res = await request(app)
        .delete(`/api/v1/networks/${NET}/gateways/${GAT}/sensors/${MAC}`)
        .set("Authorization", `Bearer ${token}`);

      expect(res.status).toBe(404);
      expect(res.body.name).toBe(NotFoundError);
    });

    // --- Realizza una richiesta ad un'altra rotta
    // it("T5.10: Invalid Network Code (empty string)", async () => {
    //   const NET = "";
    //   const MAC = "11:22:33:aa";
      
    //   const res = await request(app)
    //     .delete(`/api/v1/networks/${NET}/gateways/${GAT}/sensors/${MAC}`)
    //     .set("Authorization", `Bearer ${token}`);

    //   expect(res.status).toBe(404);
    //   expect(res.body.name).toBe(NotFoundError);
    // });

    it("T5.9: Invalid Network Code (null)", async () => {
      const NET = null;
      const MAC = "11:22:33:aa";
      
      const res = await request(app)
        .delete(`/api/v1/networks/${NET}/gateways/${GAT}/sensors/${MAC}`)
        .set("Authorization", `Bearer ${token}`);

      expect(res.status).toBe(404);
      expect(res.body.name).toBe(NotFoundError);
    });

    it("T5.10: Invalid token", async () => {
      const MAC = "11:22:33:aa";
      
      const res = await request(app)
        .delete(`/api/v1/networks/${NET}/gateways/${GAT}/sensors/${MAC}`)
        .set("Authorization", `Bearer ${tokenInvalid}`);

      expect(res.status).toBe(401);
      expect(res.body.name).toBe(UnauthorizedError);
    });

    it("T5.11: Insufficient permissions", async () => {
      const MAC = "11:22:33:bb";
      
      const res = await request(app)
        .delete(`/api/v1/networks/${NET}/gateways/${GAT}/sensors/${MAC}`)
        .set("Authorization", `Bearer ${tokenViewer}`);
      
      expect(res.status).toBe(403);
      expect(res.body.name).toBe(InsufficientRightsError);
    });
  });
});