import request from "supertest";
import { app } from "@app";
import * as authService from "@services/authService";
import * as gatewayController from "@controllers/gatewayController";
import { UserType } from "@models/UserType";
import { Gateway as GatewayDTO } from "@dto/Gateway";
import { UnauthorizedError } from "@models/errors/UnauthorizedError";
import { InsufficientRightsError } from "@models/errors/InsufficientRightsError";
import { NotFoundError } from "@models/errors/NotFoundError";
import { ConflictError } from "@models/errors/ConflictError";

jest.mock("@services/authService");
jest.mock("@controllers/gatewayController");

describe("GatewayRoutes integration", () => {
  const token = "Bearer faketoken";

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("TS1: getAllGateway()", () => {

    it("T1.1 get all gateways", async () => {
      const mockGateways: GatewayDTO[] = [
        { macAddress: "11:22:33",
          name: "Gateway1",
          description: "dscr Gateway1",
          sensors: [], },
        { macAddress: "11:22:44",
          name: "Gateway2",
          description: "dscr Gateway2",
          sensors: [], }
      ];

      (authService.processToken as jest.Mock).mockResolvedValue(undefined);
      (gatewayController.getAllGateway as jest.Mock).mockResolvedValue(mockGateways);

      const response = await request(app)
        .get("/api/v1/networks/NET01/gateways")
        .set("Authorization", token);

      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockGateways);
      expect(authService.processToken).toHaveBeenCalledWith(token, [UserType.Admin,UserType.Operator,UserType.Viewer]);
      expect(gatewayController.getAllGateway).toHaveBeenCalledWith("NET01");
    });

    it("T1.2 get all gateways: 401 UnauthorizedError", async () => {
      (authService.processToken as jest.Mock).mockImplementation(() => {
        throw new UnauthorizedError("Unauthorized: No token provided");
      });

      const response = await request(app)
        .get("/api/v1/networks/NET01/gateways")
        .set("Authorization", "Bearer invalid");

      expect(response.status).toBe(401);
      expect(response.body.message).toMatch(/Unauthorized/);
    });

    it("T1.3 get all gateways: 404 Network not found", async () => {
      (authService.processToken as jest.Mock).mockResolvedValue(undefined);
      (gatewayController.getAllGateway as jest.Mock).mockRejectedValue(new NotFoundError("Network not found"));

      const response = await request(app)
        .get("/api/v1/networks/NET01/gateways")
        .set("Authorization", token);

      expect(response.status).toBe(404);
      expect(response.body.message).toMatch(/Network not found/);
    });

    
  });

  describe("TS2: createGateway()", () => {

    let mockGateway:GatewayDTO=null;

    beforeEach(async () => {
      mockGateway= 
        { macAddress: "11:22:33",
          name: "Gateway1",
          description: "dscr Gateway1",
          sensors: []};
    });

    it("T2.1 create a gateway succesfully", async () => {

      (authService.processToken as jest.Mock).mockResolvedValue(undefined);
      (gatewayController.createGateway as jest.Mock).mockResolvedValue(undefined);

      const response = await request(app)
        .post("/api/v1/networks/NET01/gateways")
        .set("Authorization", token)
        .send(mockGateway);

      expect(response.status).toBe(201);
      expect(authService.processToken).toHaveBeenCalledWith(token, [UserType.Admin,UserType.Operator]);
      expect(gatewayController.createGateway).toHaveBeenCalledWith("NET01",mockGateway);
    });

    it("T2.2 create a gateway: 401 UnauthorizedError", async () => {

      (authService.processToken as jest.Mock).mockImplementation(() => {
        throw new UnauthorizedError("Unauthorized: No token provided");
      });

      const response = await request(app)
        .post("/api/v1/networks/NET01/gateways")
        .set("Authorization", "Bearer invalid")
        .send(mockGateway);

      expect(response.status).toBe(401);
      expect(response.body.message).toMatch(/Unauthorized/);
    });

    it("T2.3 create a gateway: 404 Network not found", async () => {

      (authService.processToken as jest.Mock).mockResolvedValue(undefined);
      (gatewayController.createGateway as jest.Mock).mockRejectedValue(new NotFoundError("Network not found"));

      const response = await request(app)
        .post("/api/v1/networks/NET01/gateways")
        .set("Authorization", token)
        .send(mockGateway);

      expect(response.status).toBe(404);
      expect(response.body.message).toMatch(/Network not found/);
    });

    it("T2.4 create a gateway: 403 InsufficientRightsError", async () => {

      (authService.processToken as jest.Mock).mockImplementation(() => {
        throw new InsufficientRightsError("Forbidden: Insufficient rights");
      });
  
      const response = await request(app)
        .post("/api/v1/networks/NET01/gateways")
        .set("Authorization", token)
        .send(mockGateway);
  
      expect(response.status).toBe(403);
      expect(response.body.message).toMatch(/Insufficient rights/);
    });

    it("T2.5 create a gateway: 409 Gateway mac address already in use", async () => {

      (authService.processToken as jest.Mock).mockResolvedValue(undefined);
      (gatewayController.createGateway as jest.Mock).mockRejectedValue(new ConflictError("Gateway mac address already in use"));

      const response = await request(app)
        .post("/api/v1/networks/NET01/gateways")
        .set("Authorization", token)
        .send(mockGateway);

      expect(response.status).toBe(409);
      expect(response.body.message).toMatch(/Gateway mac address already in use/);
    });
 
    
  });

  describe("TS3: getGatewayByMacAddress()", () => {

    let mockGateway:GatewayDTO=null;

    beforeEach(async () => {
      mockGateway= 
        { macAddress: "11:22:33",
          name: "Gateway1",
          description: "dscr Gateway1",
          sensors: []};
    });

    it("T3.1 get a specific gateway", async () => {

      (authService.processToken as jest.Mock).mockResolvedValue(undefined);
      (gatewayController.getGatewayByMacAddress as jest.Mock).mockResolvedValue(mockGateway);

      const response = await request(app)
        .get("/api/v1/networks/NET01/gateways/11:22:33")
        .set("Authorization", token);

      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockGateway);
      expect(authService.processToken).toHaveBeenCalledWith(token, [UserType.Admin,UserType.Operator,UserType.Viewer]);
      expect(gatewayController.getGatewayByMacAddress).toHaveBeenCalledWith("NET01","11:22:33");
    });

    it("T3.2 get a specific gateway: 401 UnauthorizedError", async () => {
      (authService.processToken as jest.Mock).mockImplementation(() => {
        throw new UnauthorizedError("Unauthorized: No token provided");
      });

      const response = await request(app)
        .get("/api/v1/networks/NET01/gateways/11:22:33")
        .set("Authorization", "Bearer invalid");

      expect(response.status).toBe(401);
      expect(response.body.message).toMatch(/Unauthorized/);
    });

      it("T3.3 get a specific gateway: 404 Network/Gateway not found", async () => {
      (authService.processToken as jest.Mock).mockResolvedValue(undefined);
      (gatewayController.getGatewayByMacAddress as jest.Mock).mockRejectedValue(new NotFoundError("Network/Gateway not found"));

      const response = await request(app)
        .get("/api/v1/networks/NET01/gateways/11:22:33")
        .set("Authorization", token);

      expect(response.status).toBe(404);
      expect(response.body.message).toMatch(/Network\/Gateway not found/);
    });
 
    
  });

  describe("TS4: updateGateway()", () => {

    let mockGatewayUpdate: GatewayDTO= null;

    beforeEach(async () => {
      mockGatewayUpdate = {
        name: "UpdatedGateway",
        description: "Updated dscr"
      };
    });

    it("T4.1 update a gateway successfully", async () => {
      (authService.processToken as jest.Mock).mockResolvedValue(undefined);
      (gatewayController.updateGateway as jest.Mock).mockResolvedValue(undefined);

      const response = await request(app)
        .patch("/api/v1/networks/NET01/gateways/11:22:33")
        .set("Authorization", token)
        .send(mockGatewayUpdate);

      expect(response.status).toBe(204);
      expect(authService.processToken).toHaveBeenCalledWith(token, [UserType.Admin, UserType.Operator]);
      expect(gatewayController.updateGateway).toHaveBeenCalledWith("NET01", "11:22:33", mockGatewayUpdate);
    });

    it("T4.2 update a gateway: 401 UnauthorizedError", async () => {
      (authService.processToken as jest.Mock).mockImplementation(() => {
        throw new UnauthorizedError("Unauthorized: No token provided");
      });

      const response = await request(app)
        .patch("/api/v1/networks/NET01/gateways/11:22:33")
        .set("Authorization", "Bearer invalid")
        .send(mockGatewayUpdate);

      expect(response.status).toBe(401);
      expect(response.body.message).toMatch(/Unauthorized/);
    });

    it("T4.3 update a gateway: 404 Network/Gateway not found", async () => {
      (authService.processToken as jest.Mock).mockResolvedValue(undefined);
      (gatewayController.updateGateway as jest.Mock).mockRejectedValue(new NotFoundError("Network/Gateway not found"));

      const response = await request(app)
        .patch("/api/v1/networks/NET01/gateways/11:22:33")
        .set("Authorization", token)
        .send(mockGatewayUpdate);

      expect(response.status).toBe(404);
      expect(response.body.message).toMatch(/Network\/Gateway not found/);
    });

    it("T4.4 update a gateway: 403 InsufficientRightsError", async () => {
      (authService.processToken as jest.Mock).mockImplementation(() => {
        throw new InsufficientRightsError("Forbidden: Insufficient rights");
      });

      const response = await request(app)
        .patch("/api/v1/networks/NET01/gateways/11:22:33")
        .set("Authorization", token)
        .send(mockGatewayUpdate);

      expect(response.status).toBe(403);
      expect(response.body.message).toMatch(/Insufficient rights/);
    });

    it("T4.5 update a gateway: 409 ConflictError, Mac address already in use", async () => {
      (authService.processToken as jest.Mock).mockResolvedValue(undefined);
      (gatewayController.updateGateway as jest.Mock).mockRejectedValue(new ConflictError("Gateway mac address already in use"));

      const response = await request(app)
        .patch("/api/v1/networks/NET01/gateways/11:22:33")
        .set("Authorization", token)
        .send(mockGatewayUpdate);

      expect(response.status).toBe(409);
      expect(response.body.message).toMatch(/Gateway mac address already in use/);
    });
      
  });

  describe("TS5: deleteGateway()", () => {

    it("T5.1 delete a gateway successfully", async () => {
      (authService.processToken as jest.Mock).mockResolvedValue(undefined);
      (gatewayController.deleteGateway as jest.Mock).mockResolvedValue(undefined);

      const response = await request(app)
        .delete("/api/v1/networks/NET01/gateways/11:22:33")
        .set("Authorization", token);

      expect(response.status).toBe(204);
      expect(authService.processToken).toHaveBeenCalledWith(token, [UserType.Admin, UserType.Operator]);
      expect(gatewayController.deleteGateway).toHaveBeenCalledWith("NET01", "11:22:33");
    });

    it("T5.2 delete a gateway: 401 UnauthorizedError", async () => {
      (authService.processToken as jest.Mock).mockImplementation(() => {
        throw new UnauthorizedError("Unauthorized: No token provided");
      });

      const response = await request(app)
        .delete("/api/v1/networks/NET01/gateways/11:22:33")
        .set("Authorization", "Bearer invalid");

      expect(response.status).toBe(401);
      expect(response.body.message).toMatch(/Unauthorized/);
    });

    it("T5.3 delete a gateway: 404 Network/Gateway not found", async () => {
      (authService.processToken as jest.Mock).mockResolvedValue(undefined);
      (gatewayController.deleteGateway as jest.Mock).mockRejectedValue(new NotFoundError("Network/Gateway not found"));

      const response = await request(app)
        .delete("/api/v1/networks/NET01/gateways/11:22:33")
        .set("Authorization", token);

      expect(response.status).toBe(404);
      expect(response.body.message).toMatch(/Network\/Gateway not found/);
    });

    it("T5.4 delete a gateway: 403 InsufficientRightsError", async () => {
      (authService.processToken as jest.Mock).mockImplementation(() => {
        throw new InsufficientRightsError("Forbidden: Insufficient rights");
      });

      const response = await request(app)
        .delete("/api/v1/networks/NET01/gateways/11:22:33")
        .set("Authorization", token);

      expect(response.status).toBe(403);
      expect(response.body.message).toMatch(/Insufficient rights/);
    });

  });
});
