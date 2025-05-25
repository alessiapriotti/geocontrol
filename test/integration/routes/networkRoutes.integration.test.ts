import request from "supertest";
import { app } from "@app";
import * as authService from "@services/authService";
import * as networkController from "@controllers/networkController";
import { Network as NetworkDTO } from "@dto/Network";
import { UnauthorizedError } from "@models/errors/UnauthorizedError";
import { NotFoundError } from "@models/errors/NotFoundError";
import { ConflictError } from "@models/errors/ConflictError";
import { InsufficientRightsError } from "@models/errors/InsufficientRightsError";

jest.mock("@services/authService");
jest.mock("@controllers/networkController");

describe("NetworkRoutes integration", () => {
    const token = "Bearer faketoken";

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe("get all networks integration tests", () => {
        it("get all networks", async () => {
            const mockNetworks: NetworkDTO[] = [
                { code: "NET01", name: "Network 1", description: "First network" },
                { code: "NET02", name: "Network 2", description: "Second network" }
            ];

            (authService.processToken as jest.Mock).mockResolvedValue(undefined);
            (networkController.getAllNetworks as jest.Mock).mockResolvedValue(mockNetworks);

            const response = await request(app)
                .get("/api/v1/networks")
                .set("Authorization", token);

            expect(response.status).toBe(200);
            expect(response.body).toEqual(mockNetworks);
            expect(authService.processToken).toHaveBeenCalledWith(token, ["admin", "operator", "viewer"]);
            expect(networkController.getAllNetworks).toHaveBeenCalled();
        });

        it("get all networks: 401 UnauthorizedError", async () => {
            (authService.processToken as jest.Mock).mockImplementation(() => {
                throw new UnauthorizedError("Unauthorized: No token provided");
            });

            const response = await request(app)
                .get("/api/v1/networks")
                .set("Authorization", "Bearer invalid");

            expect(response.status).toBe(401);
            //expect(response.body.message).toMatch(/Unauthorized/);
        });
    });

    describe("get network by code integration tests", () => {
        it("get network by code", async () => {
            const mockNetwork: NetworkDTO = { code: "NET01", name: "Network 1", description: "First network" };

            (authService.processToken as jest.Mock).mockResolvedValue(undefined);
            (networkController.getNetwork as jest.Mock).mockResolvedValue(mockNetwork);

            const response = await request(app)
                .get("/api/v1/networks/NET01")
                .set("Authorization", token);

            expect(response.status).toBe(200);
            expect(response.body).toEqual(mockNetwork);
            expect(authService.processToken).toHaveBeenCalledWith(token, ["admin", "operator", "viewer"]);
            expect(networkController.getNetwork).toHaveBeenCalledWith("NET01");
        });

        it("get network by code: 401 UnauthorizedError", async () => {
            (authService.processToken as jest.Mock).mockImplementation(() => {
                throw new UnauthorizedError("Unauthorized: No token provided");
            });

            const response = await request(app)
                .get("/api/v1/networks/NET01")
                .set("Authorization", "Bearer invalid");

            expect(response.status).toBe(401);
            //expect(response.body.message).toMatch(/Unauthorized/);
        });
        
        it("get network by code: 404 NotFoundError", async () => {
            (authService.processToken as jest.Mock).mockResolvedValue(undefined);
            (networkController.getNetwork as jest.Mock).mockImplementation(() => {
                throw new NotFoundError("Network not found");
            });

            const response = await request(app)
                .get("/api/v1/networks/INVALID")
                .set("Authorization", token);

            expect(response.status).toBe(404);
            //expect(response.body.message).toMatch(/Network not found/);
        });
    });

    describe("create network integration tests", () => {
        it("create network", async () => {
            const mockNetwork: NetworkDTO = { code: "NET01", name: "Network 1", description: "First network" };

            (authService.processToken as jest.Mock).mockResolvedValue(undefined);
            (networkController.createNetwork as jest.Mock).mockResolvedValue(mockNetwork);

            const response = await request(app)
                .post("/api/v1/networks")
                .set("Authorization", token)
                .send(mockNetwork);

            expect(response.status).toBe(201);
            expect(authService.processToken).toHaveBeenCalledWith(token, ["admin", "operator"]);
            expect(networkController.createNetwork).toHaveBeenCalledWith(mockNetwork);
        });

        it("create network: 401 UnauthorizedError", async () => {
            (authService.processToken as jest.Mock).mockImplementation(() => {
                throw new UnauthorizedError("Unauthorized: No token provided");
            });

            const response = await request(app)
                .post("/api/v1/networks")
                .set("Authorization", "Bearer invalid")
                .send({ code: "NET01", name: "Network 1", description: "First network" });

            expect(response.status).toBe(401);
            //expect(response.body.message).toMatch(/Unauthorized/);
        });

        it("create network: 403 InsufficientRightsError", async () => {
            (authService.processToken as jest.Mock).mockImplementation(() => {
                throw new InsufficientRightsError("Insufficient rights to create network");
            });

            const response = await request(app)
                .post("/api/v1/networks")
                .set("Authorization", token)
                .send({ code: "NET01", name: "Network 1", description: "First network" });

            expect(response.status).toBe(403);
            //expect(response.body.message).toMatch(/Insufficient rights/);
        });

        it("create network: 409 ConflictError", async () => {
            
            (authService.processToken as jest.Mock).mockResolvedValue(undefined);
            (networkController.createNetwork as jest.Mock).mockImplementation(() => {
                throw new ConflictError("Network already exists");
            });

            const response = await request(app)
                .post("/api/v1/networks")
                .set("Authorization", token)
                .send({ code: "NET01", name: "Network 1", description: "First network" });

            expect(response.status).toBe(409);
            //expect(response.body.message).toMatch(/Network already exists/);
        });
    });

    describe("update network integration tests", () => {
        it("update network", async () => {
            const mockNetwork: NetworkDTO = { code: "NET01", name: "Updated Network", description: "Updated description" };

            (authService.processToken as jest.Mock).mockResolvedValue(undefined);
            (networkController.updateNetwork as jest.Mock).mockResolvedValue(mockNetwork);

            const response = await request(app)
                .patch("/api/v1/networks/NET01")
                .set("Authorization", token)
                .send(mockNetwork);

            expect(response.status).toBe(204);
            expect(response.body).toEqual({});
            expect(authService.processToken).toHaveBeenCalledWith(token, ["admin", "operator"]);
            expect(networkController.updateNetwork).toHaveBeenCalledWith("NET01", mockNetwork);
        });

        it("update network: 401 UnauthorizedError", async () => {
            (authService.processToken as jest.Mock).mockImplementation(() => {
                throw new UnauthorizedError("Unauthorized: No token provided");
            });

            const response = await request(app)
                .patch("/api/v1/networks/NET01")
                .set("Authorization", "Bearer invalid")
                .send({ code: "NET01", name: "Updated Network", description: "Updated description" });

            expect(response.status).toBe(401);
            //expect(response.body.message).toMatch(/Unauthorized/);
        });

        it("update network: 403 InsufficientRightsError", async () => {
            (authService.processToken as jest.Mock).mockImplementation(() => {
                throw new InsufficientRightsError("Insufficient rights to update network");
            });

            const response = await request(app)
                .patch("/api/v1/networks/NET01")
                .set("Authorization", token)
                .send({ code: "NET01", name: "Updated Network", description: "Updated description" });

            expect(response.status).toBe(403);
            //expect(response.body.message).toMatch(/Insufficient rights/);
        });

        it("update network: 404 NotFoundError", async () => {
            (authService.processToken as jest.Mock).mockResolvedValue(undefined);
            (networkController.updateNetwork as jest.Mock).mockImplementation(() => {
                throw new NotFoundError("Network not found");
            });

            const response = await request(app)
                .patch("/api/v1/networks/INVALID")
                .set("Authorization", token)
                .send({ code: "INVALID", name: "Updated Network", description: "Updated description" });

            expect(response.status).toBe(404);
            //expect(response.body.message).toMatch(/Network not found/);
        });
    });

    describe("delete network integration tests", () => {
        it("delete network", async () => {
            (authService.processToken as jest.Mock).mockResolvedValue(undefined);
            (networkController.deleteNetwork as jest.Mock).mockResolvedValue(undefined);

            const response = await request(app)
                .delete("/api/v1/networks/NET01")
                .set("Authorization", token);

            expect(response.status).toBe(204);
            expect(response.body).toEqual({});
            expect(authService.processToken).toHaveBeenCalledWith(token, ["admin", "operator"]);
            expect(networkController.deleteNetwork).toHaveBeenCalledWith("NET01");
        });

        it("delete network: 401 UnauthorizedError", async () => {
            (authService.processToken as jest.Mock).mockImplementation(() => {
                throw new UnauthorizedError("Unauthorized: No token provided");
            });

            const response = await request(app)
                .delete("/api/v1/networks/NET01")
                .set("Authorization", "Bearer invalid");

            expect(response.status).toBe(401);
            //expect(response.body.message).toMatch(/Unauthorized/);
        });

        it("delete network: 403 InsufficientRightsError", async () => {
            (authService.processToken as jest.Mock).mockImplementation(() => {
                throw new InsufficientRightsError("Insufficient rights to delete network");
            });

            const response = await request(app)
                .delete("/api/v1/networks/NET01")
                .set("Authorization", token);

            expect(response.status).toBe(403);
            //expect(response.body.message).toMatch(/Insufficient rights/);
        });

        it("delete network: 404 NotFoundError", async () => {
            (authService.processToken as jest.Mock).mockResolvedValue(undefined);
            (networkController.deleteNetwork as jest.Mock).mockImplementation(() => {
                throw new NotFoundError("Network not found");
            });

            const response = await request(app)
                .delete("/api/v1/networks/INVALID")
                .set("Authorization", token);

            expect(response.status).toBe(404);
            //expect(response.body.message).toMatch(/Network not found/);
        });
    });
});