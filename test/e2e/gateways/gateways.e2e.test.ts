import request from "supertest";
import { app } from "@app";
import { generateToken } from "@services/authService";
import { beforeAllE2e, afterAllE2e, TEST_USERS } from "@test/e2e/lifecycle";
import { TestDataSource } from "@test/setup/test-datasource";
import { NetworkDAO } from "@models/dao/NetworkDAO";
import { GatewayDAO } from "@models/dao/GatewayDAO";
import { Gateway as GatewayDTO } from "@models/dto/Gateway";

describe("Gateway (e2e)", () => {
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
  });

  describe("TS1: GET /networks/:networkCode/gateways", () => {
    const NET = "NET01";
    const GAT = "11:22:33";
    const NET2 = "NET02";
    const GAT2 = "11:22:44";
    const GAT3 = "11:22:55";

    // Setup del DB pre-test
    beforeEach(async () => {
      let network = await TestDataSource.getRepository(NetworkDAO).save({ code: NET });
      await TestDataSource.getRepository(GatewayDAO).save({ macAddress: GAT, network: network })
      await TestDataSource.getRepository(GatewayDAO).save({ macAddress: GAT2, network: network })

      let network2 = await TestDataSource.getRepository(NetworkDAO).save({ code: NET2 });
      await TestDataSource.getRepository(GatewayDAO).save({ macAddress: GAT3, network: network2 })
    });

    it("T1.1: All valid params", async () => {
      const res = await request(app)
        .get(`/api/v1/networks/${NET}/gateways/`)
        .set("Authorization", `Bearer ${token}`);

      expect(res.status).toBe(200);

      const gateways = res.body;
      expect(Array.isArray(gateways)).toBe(true);
      expect(gateways).toHaveLength(2);
      expect(gateways.map((s: GatewayDAO) => s.macAddress).sort()).toEqual(["11:22:33", "11:22:44"]);
    });

    it("T1.2: Network not found", async () => {
      const NET = "NET03";

      const res = await request(app)
        .get(`/api/v1/networks/${NET}/gateways`)
        .set("Authorization", `Bearer ${token}`);

      expect(res.status).toBe(404);
      expect(res.body.name).toBe("NotFoundError");
    });

    it("T1.3: Null Networkcode", async () => {
      const NET: string = null;

      const res = await request(app)
        .get(`/api/v1/networks/${NET}/gateways`)
        .set("Authorization", `Bearer ${token}`);

      expect(res.status).toBe(404);
      expect(res.body.name).toBe("NotFoundError");
    });

  });

  describe("TS2: POST /networks/:networkCode/gateways", () => {
    const NET = "NET01";
    const GAT = "11:22:33";
    // Setup del DB pre-test
    beforeEach(async () => {
      let network = await TestDataSource.getRepository(NetworkDAO).save({ code: NET });
      await TestDataSource.getRepository(GatewayDAO).save({ macAddress: GAT, network: network })

    });

    it("T2.1: All valid params", async () => {
      const GAT = "11:22:44";
      const gatewayDTO: GatewayDTO = {
        macAddress: GAT,
        name: "Gateway1",
        description: "dscr Gateway1",
        sensors: [],
      };

      const res = await request(app)
        .post(`/api/v1/networks/${NET}/gateways`)
        .set("Authorization", `Bearer ${token}`)
        .send(gatewayDTO);

      expect(res.status).toBe(201);

      await expect(
        TestDataSource.getRepository(GatewayDAO).findOneOrFail({ where: { macAddress: GAT } })
      ).resolves.toMatchObject({
        macAddress: GAT,
        name: "Gateway1",
        description: "dscr Gateway1"
      } as GatewayDAO);
    });

    it("T2.2: Error if gateway with same GAT exists", async () => {
      const GAT = "11:22:33";
      const gatewayDTO: GatewayDTO = {
        macAddress: GAT,
        name: "Gateway1",
        description: "dscr Gateway1",
        sensors: [],
      };

      const res = await request(app)
        .post(`/api/v1/networks/${NET}/gateways`)
        .set("Authorization", `Bearer ${token}`)
        .send(gatewayDTO);

      expect(res.status).toBe(409);
      expect(res.body.name).toBe("ConflictError");
    });

    it("T2.3: Invalid GAT (empty string)", async () => {
      const GAT = "";
      const gatewayDTO: GatewayDTO = {
        macAddress: GAT,
        name: "Gateway1",
        description: "dscr Gateway1",
        sensors: [],
      };

      const res = await request(app)
        .post(`/api/v1/networks/${NET}/gateways`)
        .set("Authorization", `Bearer ${token}`)
        .send(gatewayDTO);

      expect(res.status).toBe(400);
      expect(res.body.name).toBe("Bad Request");
    });

    it("T2.4: Invalid GAT (spaces only)", async () => {
      const GAT = "    ";
      const gatewayDTO: GatewayDTO = {
        macAddress: GAT,
        name: "Gateway1",
        description: "dscr Gateway1",
        sensors: [],
      };

      const res = await request(app)
        .post(`/api/v1/networks/${NET}/gateways`)
        .set("Authorization", `Bearer ${token}`)
        .send(gatewayDTO);

      expect(res.status).toBe(400);
      expect(res.body.name).toBe("Bad Request");
    });

    it("T2.5: Invalid GAT (null)", async () => {
      const GAT: string = null;
      const gatewayDTO: GatewayDTO = {
        macAddress: GAT,
        name: "Gateway1",
        description: "dscr Gateway1",
        sensors: [],
      };

      const res = await request(app)
        .post(`/api/v1/networks/${NET}/gateways`)
        .set("Authorization", `Bearer ${token}`)
        .send(gatewayDTO);

      expect(res.status).toBe(400);
      expect(res.body.name).toBe("Bad Request");
    });

    it("T2.6: Valid GAT, name with spaces", async () => {
      const GAT = "11:22:44";
      const NAME = "     ";
      const gatewayDTO: GatewayDTO = {
        macAddress: GAT,
        name: NAME,
        description: "dscr Gateway1",
        sensors: [],
      };

      const res = await request(app)
        .post(`/api/v1/networks/${NET}/gateways`)
        .set("Authorization", `Bearer ${token}`)
        .send(gatewayDTO);

      expect(res.status).toBe(201);

      await expect(
        TestDataSource.getRepository(GatewayDAO).findOneOrFail({ where: { macAddress: GAT } })
      ).resolves.toMatchObject({
        macAddress: GAT,
        name: "",
      } as GatewayDAO);
    });

    it("T2.7: Invalid Network Code", async () => {
      const NET = "NET03";
      const GAT = "11:22:44";
      const gatewayDTO: GatewayDTO = {
        macAddress: GAT,
        name: "Gateway1",
        description: "dscr Gateway1",
        sensors: [],
      };


      const res = await request(app)
        .post(`/api/v1/networks/${NET}/gateways`)
        .set("Authorization", `Bearer ${token}`)
        .send(gatewayDTO);

      expect(res.status).toBe(404);
      expect(res.body.name).toBe("NotFoundError");
    });

    it("T2.8: Invalid token", async () => {
      const GAT = "11:22:44";
      const gatewayDTO: GatewayDTO = {
        macAddress: GAT,
        name: "Gateway1",
        description: "dscr Gateway1",
        sensors: [],
      };

      const res = await request(app)
        .post(`/api/v1/networks/${NET}/gateways`)
        .set("Authorization", `Bearer ${tokenInvalid}`)
        .send(gatewayDTO);

      expect(res.status).toBe(401);
      expect(res.body.name).toBe("UnauthorizedError");
    });

    it("T2.9: Insufficient permissions", async () => {
      const GAT = "11:22:44";
      const gatewayDTO: GatewayDTO = {
        macAddress: GAT,
        name: "Gateway1",
        description: "dscr Gateway1",
        sensors: [],
      };

      const res = await request(app)
        .post(`/api/v1/networks/${NET}/gateways`)
        .set("Authorization", `Bearer ${tokenViewer}`)
        .send(gatewayDTO);

      expect(res.status).toBe(403);
      expect(res.body.name).toBe("InsufficientRightsError");
    });
  });

  describe("TS3: GET /networks/:networkCode/gateways/:gatewayMac", () => {
    const NET = "NET01";
    const GAT = "11:22:33";
    const NET2 = "NET02";
    const GAT2 = "11:22:44";

    // Setup del DB pre-test
    beforeEach(async () => {
      let network = await TestDataSource.getRepository(NetworkDAO).save({ code: NET });
      await TestDataSource.getRepository(GatewayDAO).save({ macAddress: GAT, network: network })

      let network2 = await TestDataSource.getRepository(NetworkDAO).save({ code: NET2 });
      await TestDataSource.getRepository(GatewayDAO).save({ macAddress: GAT2, network: network2 })
    });


    it("T3.1: All valid params", async () => {

      const res = await request(app)
        .get(`/api/v1/networks/${NET}/gateways/${GAT}`)
        .set("Authorization", `Bearer ${token}`);

      expect(res.status).toBe(200);
      expect(res.body).toMatchObject({
        macAddress: GAT
      });
    });

    it("T3.2: Invalid Gateway mac", async () => {
      const GAT = "11:22:66";

      const res = await request(app)
        .get(`/api/v1/networks/${NET}/gateways/${GAT}`)
        .set("Authorization", `Bearer ${token}`);

      expect(res.status).toBe(404);
      expect(res.body.name).toBe("NotFoundError");
    });

    it("T3.3: Gateway mac not bound to passed network", async () => {
      const GAT = "11:22:44";

      const res = await request(app)
        .get(`/api/v1/networks/${NET}/gateways/${GAT}`)
        .set("Authorization", `Bearer ${token}`);

      expect(res.status).toBe(404);
      expect(res.body.name).toBe("NotFoundError");
    });

    it("T3.4: Null Gateway mac", async () => {
      const GAT = null;

      const res = await request(app)
        .get(`/api/v1/networks/${NET}/gateways/${GAT}`)
        .set("Authorization", `Bearer ${token}`);

      expect(res.status).toBe(404);
      expect(res.body.name).toBe("NotFoundError");
    });

    it("T3.5: Invalid Network Code", async () => {
      const NET = "NET03";
      const GAT = "11:22:33";

      const res = await request(app)
        .get(`/api/v1/networks/${NET}/gateways/${GAT}`)
        .set("Authorization", `Bearer ${token}`);

      expect(res.status).toBe(404);
      expect(res.body.name).toBe("NotFoundError");
    });

    it("T3.6: Null Network Code", async () => {
      const NET = null;
      const GAT = "11:22:33";

      const res = await request(app)
        .get(`/api/v1/networks/${NET}/gateways/${GAT}`)
        .set("Authorization", `Bearer ${token}`);

      expect(res.status).toBe(404);
      expect(res.body.name).toBe("NotFoundError");
    });


  });

  describe("TS4: PATCH /networks/:networkCode/gateways/:gatewayMac", () => {
    const NET = "NET01";
    const GAT = "11:22:33"
    let network: NetworkDAO=null;
    // Setup del DB pre-test
    beforeEach(async () => {
      network = await TestDataSource.getRepository(NetworkDAO).save({ code: NET });
      await TestDataSource.getRepository(GatewayDAO).save({ macAddress: GAT, network: network })
    });

    it("T4.1: All valid params", async () => {
      const NEW_MAC = "11:22:44";
      const gatewayDTO: GatewayDTO = {
        macAddress: NEW_MAC,
        name: "updated gateway",
        description: "dscr updated gateway",
        sensors: [],
      };

      const res = await request(app)
        .patch(`/api/v1/networks/${NET}/gateways/${GAT}`)
        .set("Authorization", `Bearer ${token}`)
        .send(gatewayDTO);

      expect(res.status).toBe(204);

      await expect(
        TestDataSource.getRepository(GatewayDAO).findOneOrFail({ where: { macAddress: NEW_MAC } })
      ).resolves.toMatchObject({
        macAddress: NEW_MAC,
        name: "updated gateway",
        description: "dscr updated gateway",
      } as GatewayDAO);
    });

    it("T4.2: Optional params with spaces", async () => {
      const NEW_MAC = "11:22:44";
      const gatewayDTO: GatewayDTO = {
        macAddress: NEW_MAC,
        name: "updated gateway            ",
        description: "dscr updated gateway",
        sensors: [],
      };

      const res = await request(app)
        .patch(`/api/v1/networks/${NET}/gateways/${GAT}`)
        .set("Authorization", `Bearer ${token}`)
        .send(gatewayDTO);

      expect(res.status).toBe(204);

      await expect(
        TestDataSource.getRepository(GatewayDAO).findOneOrFail({ where: { macAddress: NEW_MAC } })
      ).resolves.toMatchObject({
        macAddress: NEW_MAC,
        name: "updated gateway",
        description: "dscr updated gateway",
      } as GatewayDAO);
    });

    it("T4.3: No mac address change (undefined)", async () => {
      
      const gatewayDTO: GatewayDTO = {
        name: "updated gateway",
        description: "dscr updated gateway",
        sensors: [],
      };

      const res = await request(app)
        .patch(`/api/v1/networks/${NET}/gateways/${GAT}`)
        .set("Authorization", `Bearer ${token}`)
        .send(gatewayDTO);

      expect(res.status).toBe(204);

      await expect(
        TestDataSource.getRepository(GatewayDAO).findOneOrFail({ where: { macAddress: GAT } })
      ).resolves.toMatchObject({
        macAddress: GAT,
        name: "updated gateway",
        description: "dscr updated gateway",
      } as GatewayDAO);
    });

    it("T4.4: No mac address change (NEW_MAC == GAT)", async () => {
      const NEW_MAC = GAT;
      const gatewayDTO: GatewayDTO = {
        macAddress: NEW_MAC,
        name: "updated gateway",
        description: "dscr updated gateway",
        sensors: [],
      };

      const res = await request(app)
        .patch(`/api/v1/networks/${NET}/gateways/${GAT}`)
        .set("Authorization", `Bearer ${token}`)
        .send(gatewayDTO);

      expect(res.status).toBe(204);

      await expect(
        TestDataSource.getRepository(GatewayDAO).findOneOrFail({ where: { macAddress: GAT } })
      ).resolves.toMatchObject({
        macAddress: GAT,
        name: "updated gateway",
        description: "dscr updated gateway",
      } as GatewayDAO);
    });

    it("T4.5: mac address change to create conflict", async () => {
      await TestDataSource.getRepository(GatewayDAO).save({ macAddress: "11:22:44", network: network })

      const NEW_MAC = "11:22:44";
      const gatewayDTO: GatewayDTO = {
        macAddress: NEW_MAC,
        name: "updated gateway",
        description: "dscr updated gateway",
        sensors: [],
      };
      

      const res = await request(app)
        .patch(`/api/v1/networks/${NET}/gateways/${GAT}`)
        .set("Authorization", `Bearer ${token}`)
        .send(gatewayDTO);

      expect(res.status).toBe(409);
      expect(res.body.name).toBe("ConflictError");
    });

    it("T4.6: mac address change to empty string", async () => {
      const GAT = "11:22:33";
      const NEW_MAC = "";
      const gatewayDTO: GatewayDTO = {
        macAddress: NEW_MAC,
        name: "updated gateway",
        description: "dscr updated gateway",
        sensors: [],
      };

      const res = await request(app)
        .patch(`/api/v1/networks/${NET}/gateways/${GAT}`)
        .set("Authorization", `Bearer ${token}`)
        .send(gatewayDTO);

      expect(res.status).toBe(400);
      expect(res.body.name).toBe("Bad Request"); 
    });

    it("T4.7: mac address change to only spaces", async () => {
      const NEW_MAC = "    ";
      const gatewayDTO: GatewayDTO = {
        macAddress: NEW_MAC,
        name: "updated gateway",
        description: "dscr updated gateway",
        sensors: [],
      };

      const res = await request(app)
        .patch(`/api/v1/networks/${NET}/gateways/${GAT}`)
        .set("Authorization", `Bearer ${token}`)
        .send(gatewayDTO);

      expect(res.status).toBe(400);
      expect(res.body.name).toBe("Bad Request"); 
    });

    it("T4.8: mac address change to null", async () => {
      const NEW_MAC = null;
      const gatewayDTO: GatewayDTO = {
        macAddress: NEW_MAC,
        name: "updated gateway",
        description: "dscr updated gateway",
        sensors: [],
      };

      const res = await request(app)
        .patch(`/api/v1/networks/${NET}/gateways/${GAT}`)
        .set("Authorization", `Bearer ${token}`)
        .send(gatewayDTO);

      expect(res.status).toBe(400);
      expect(res.body.name).toBe("Bad Request"); //TODO: Waiting for Mancini
    });

    it("T4.9: Invalid Gateway mac", async () => {
      const GAT = "11:22:55";
      const NEW_MAC = "11:22:44";
      const gatewayDTO: GatewayDTO = {
        macAddress: NEW_MAC,
        name: "updated gateway",
        description: "dscr updated gateway",
        sensors: [],
      };

      const res = await request(app)
        .patch(`/api/v1/networks/${NET}/gateways/${GAT}`)
        .set("Authorization", `Bearer ${token}`)
        .send(gatewayDTO);

      expect(res.status).toBe(404);
      expect(res.body.name).toBe("NotFoundError");
    });


    it("T4.10: Invalid Gateway mac (null)", async () => {
      const GAT = null;
      const NEW_MAC = "11:22:44";
      const gatewayDTO: GatewayDTO = {
        macAddress: NEW_MAC,
        name: "updated gateway",
        description: "dscr updated gateway",
        sensors: [],
      };

      const res = await request(app)
        .patch(`/api/v1/networks/${NET}/gateways/${GAT}`)
        .set("Authorization", `Bearer ${token}`)
        .send(gatewayDTO);

      expect(res.status).toBe(404);
      expect(res.body.name).toBe("NotFoundError");
    });

    it("T4.11: Invalid Network Code", async () => {
      const NET = "NET03";
      const GAT = "11:22:33";
      const NEW_MAC = "11:22:33:xx";
      const gatewayDTO: GatewayDTO = {
        macAddress: NEW_MAC,
        name: "updated gateway            ",
        description: "dscr updated gateway",
        sensors: [],
      };

      const res = await request(app)
        .patch(`/api/v1/networks/${NET}/gateways/${GAT}`)
        .set("Authorization", `Bearer ${token}`)
        .send(gatewayDTO);

      expect(res.status).toBe(404);
      expect(res.body.name).toBe("NotFoundError");
    });

    it("T4.12: Invalid token", async () => {
      const gatewayDTO: GatewayDTO = {
        name: "updated gateway",
        description: "dscr updated gateway",
        sensors: [],
      };

      const res = await request(app)
        .patch(`/api/v1/networks/${NET}/gateways/${GAT}`)
        .set("Authorization", `Bearer ${tokenInvalid}`)
        .send(gatewayDTO);

      expect(res.status).toBe(401);
      expect(res.body.name).toBe("UnauthorizedError");
    });

    it("T4.13: Insufficient permissions", async () => {
      const gatewayDTO: GatewayDTO = {
        name: "updated gateway            ",
        description: "dscr updated gateway",
        sensors: [],
      };

      const res = await request(app)
        .patch(`/api/v1/networks/${NET}/gateways/${GAT}`)
        .set("Authorization", `Bearer ${tokenViewer}`)
        .send(gatewayDTO);

      expect(res.status).toBe(403);
      expect(res.body.name).toBe("InsufficientRightsError");
    });
  });

  describe("TS5: DELETE /networks/:networkCode/gateways/:gatewayMac", () => {
    const NET = "NET01";
    const GAT = "11:22:33";
    const NET2 = "NET02";
    const GAT2 = "11:22:44";

    // Setup del DB pre-test
    beforeEach(async () => {
      let network = await TestDataSource.getRepository(NetworkDAO).save({ code: NET });
      await TestDataSource.getRepository(GatewayDAO).save({ macAddress: GAT, network: network })

      let network2 = await TestDataSource.getRepository(NetworkDAO).save({ code: NET2 });
      await TestDataSource.getRepository(GatewayDAO).save({ macAddress: GAT2, network: network2 })
    });

    it("T5.1: All valid params", async () => {

      const res = await request(app)
        .delete(`/api/v1/networks/${NET}/gateways/${GAT}`)
        .set("Authorization", `Bearer ${token}`);

      expect(res.status).toBe(204);
    });

    it("T5.2: Invalid Gateway mac", async () => {
      const GAT = "11:22:55";

      const res = await request(app)
        .delete(`/api/v1/networks/${NET}/gateways/${GAT}`)
        .set("Authorization", `Bearer ${token}`);

      expect(res.status).toBe(404);
      expect(res.body.name).toBe("NotFoundError");
    });

    it("T5.3: Gateway mac not bound to passed gateway", async () => {
      const GAT = "11:22:44";

      const res = await request(app)
        .delete(`/api/v1/networks/${NET}/gateways/${GAT}`)
        .set("Authorization", `Bearer ${token}`);

      expect(res.status).toBe(404);
      expect(res.body.name).toBe("NotFoundError");
    });

    it("T5.4: Invalid Gateway mac (null)", async () => {
      const GAT = null;

      const res = await request(app)
        .delete(`/api/v1/networks/${NET}/gateways/${GAT}`)
        .set("Authorization", `Bearer ${token}`);

      expect(res.status).toBe(404);
      expect(res.body.name).toBe("NotFoundError");
    });

    it("T5.5: Invalid Network Code", async () => {
      const NET = "NET03";
      const GAT = "11:22:33";

      const res = await request(app)
        .delete(`/api/v1/networks/${NET}/gateways/${GAT}`)
        .set("Authorization", `Bearer ${token}`);

      expect(res.status).toBe(404);
      expect(res.body.name).toBe("NotFoundError");
    });

    it("T5.6: Invalid Network Code (null)", async () => {
      const NET = null;
      const GAT = "11:22:33";

      const res = await request(app)
        .delete(`/api/v1/networks/${NET}/gateways/${GAT}`)
        .set("Authorization", `Bearer ${token}`);

      expect(res.status).toBe(404);
      expect(res.body.name).toBe("NotFoundError");
    });

    it("T5.7: Invalid token", async () => {
      const GAT = "11:22:33";

      const res = await request(app)
        .delete(`/api/v1/networks/${NET}/gateways/${GAT}`)
        .set("Authorization", `Bearer ${tokenInvalid}`);

      expect(res.status).toBe(401);
      expect(res.body.name).toBe("UnauthorizedError");
    });

    it("T5.8: Insufficient permissions", async () => {
      const GAT = "11:22:33";

      const res = await request(app)
        .delete(`/api/v1/networks/${NET}/gateways/${GAT}`)
        .set("Authorization", `Bearer ${tokenViewer}`);

      expect(res.status).toBe(403);
      expect(res.body.name).toBe("InsufficientRightsError");
    });
  });
});
