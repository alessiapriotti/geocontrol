import request from "supertest";
import { app } from "@app";
import { generateToken } from "@services/authService";
import { beforeAllE2e, afterAllE2e, TEST_USERS } from "@test/e2e/lifecycle";
import { TestDataSource } from "@test/setup/test-datasource";
import { NetworkDAO } from "@models/dao/NetworkDAO";
import { Network as NetworkDTO } from "@dto/Network";
import { before } from "node:test";

describe("Network routes (e2e)", () => {
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
    });

    describe("TNE1: POST /networks", () => {

        it("TNE1.1: All parameters valid", async () => {
            const newNetwork: NetworkDTO = {
                code: "NET01",
                name: "Test Network",
                description: "This is a test network"
            };

            const res = await request(app)
                .post("/api/v1/networks")
                .set("Authorization", `Bearer ${token}`)
                .send(newNetwork);

            expect(res.status).toBe(201);
        });

        it("TNE1.2: Error if Network with same code exists", async () => {
            const existingNetwork: NetworkDTO = {
                code: "NET01",
                name: "Existing Network",
                description: "This network already exists"
            };

            await TestDataSource.getRepository(NetworkDAO).save(existingNetwork);

            const newNetwork: NetworkDTO = {
                code: "NET01",
                name: "New Test Network",
                description: "This is a new test network"
            };

            const res = await request(app)
                .post("/api/v1/networks")
                .set("Authorization", `Bearer ${token}`)
                .send(newNetwork);

            expect(res.status).toBe(409);
            expect(res.body.name).toBe(ConflictError);
        });

        it("TNE1.3: Unauthorized access", async () => {
            const newNetwork: NetworkDTO = {
                code: "NET02",
                name: "Unauthorized Network",
                description: "This should not be created"
            };

            const res = await request(app)
                .post("/api/v1/networks")
                .set("Authorization", `Bearer ${tokenInvalid}`)
                .send(newNetwork);

            expect(res.status).toBe(401);
            expect(res.body.name).toBe(UnauthorizedError);
        });

        it("TNE1.4: Insufficient rights", async () => {
            const newNetwork: NetworkDTO = {
                code: "NET03",
                name: "Viewer Network",
                description: "This should not be created by viewer"
            };

            const res = await request(app)
                .post("/api/v1/networks")
                .set("Authorization", `Bearer ${tokenViewer}`)
                .send(newNetwork);
            expect(res.status).toBe(403);
            expect(res.body.name).toBe(InsufficientRightsError);
        });
    });

    describe("TNE2: GET /networks/:code", () => {

        it("TNE2.1: All parameters valid", async () => {

            const netCode = "NET01";
            const network: NetworkDTO = {
                code: "NET01",
                name: "Test Network",
                description: "This is a test network"
            };

            await TestDataSource.getRepository(NetworkDAO).save(network);

            const res = await request(app)
                .get(`/api/v1/networks/${netCode}`)
                .set("Authorization", `Bearer ${token}`);

            expect(res.status).toBe(200);
            expect(res.body.code).toBe(network.code);
            expect(res.body.name).toBe(network.name);
            expect(res.body.description).toBe(network.description);
        });

        it("TNE2.2: Network not found", async () => {

            const netCode = "INVALID";
            const res = await request(app)
                .get(`/api/v1/networks/${netCode}`)
                .set("Authorization", `Bearer ${token}`);

            expect(res.status).toBe(404);
            expect(res.body.name).toBe(NotFoundError);
        });

        it("TNE2.3: Unauthorized access", async () => {

            const netCode = "NET01";
            const res = await request(app)
                .get(`/api/v1/networks/${netCode}`)
                .set("Authorization", `Bearer ${tokenInvalid}`);

            expect(res.status).toBe(401);
            expect(res.body.name).toBe(UnauthorizedError);
        });

    });

    describe("TNE3: GET /networks", () => {

        beforeEach(async () => {
            await TestDataSource.getRepository(NetworkDAO).save([
                { code: "NET01", name: "Network 1", description: "First network" },
                { code: "NET02", name: "Network 2", description: "Second network" }
            ]);
        });

        it("TNE3.1: All parameters valid", async () => {
            const res = await request(app)
                .get("/api/v1/networks")
                .set("Authorization", `Bearer ${token}`);

            expect(res.status).toBe(200);
            expect(res.body).toHaveLength(2);
            expect(res.body.map((n: NetworkDAO) => n.code).sort()).toEqual(["NET01", "NET02"]);
        });

        it("TNE3.2: Unauthorized access", async () => {
            const res = await request(app)
                .get("/api/v1/networks")
                .set("Authorization", `Bearer ${tokenInvalid}`);

            expect(res.status).toBe(401);
            expect(res.body.name).toBe(UnauthorizedError);
        });
        
    });

    describe("TNE4: patch /networks/:code", () => {

        beforeEach(async () => {
            await TestDataSource.getRepository(NetworkDAO).save({
                code: "NET01",
                name: "Test Network",
                description: "This is a test network"
            });
        });

        it("TNE4.1: All parameters valid", async () => {

            const netCode = "NET01";
            const updatedNetwork: NetworkDTO = {
                code: "NET02",
                name: "Updated Network",
                description: "This is an updated test network"
            };

            const res = await request(app)
                .patch(`/api/v1/networks/${netCode}`)
                .set("Authorization", `Bearer ${token}`)
                .send(updatedNetwork);

            expect(res.status).toBe(204);
            expect (await TestDataSource.getRepository(NetworkDAO).findOneOrFail({ where :{code: updatedNetwork.code} })
            ).toMatchObject({
                code: updatedNetwork.code,
                name: updatedNetwork.name,
                description: updatedNetwork.description
            } as NetworkDAO);
        });

        it("TNE4.2: Network not found", async () => {
            const netCode = "INVALID";
            const updatedNetwork: NetworkDTO = {
                code: "NET01",
                name: "Updated Network",
                description: "This should not be updated"
            };

            const res = await request(app)
                .patch(`/api/v1/networks/${netCode}`)
                .set("Authorization", `Bearer ${token}`)
                .send(updatedNetwork);

            expect(res.status).toBe(404);
            expect(res.body.name).toBe(NotFoundError);
        });

        it("TNE4.3: Unauthorized access", async () => {

            const netCode = "NET01";
            const updatedNetwork: NetworkDTO = {
                code: "NET01",
                name: "Unauthorized Update",
                description: "This should not be updated"
            };

            const res = await request(app)
                .patch(`/api/v1/networks/${netCode}`)
                .set("Authorization", `Bearer ${tokenInvalid}`)
                .send(updatedNetwork);

            expect(res.status).toBe(401);
            expect(res.body.name).toBe(UnauthorizedError);
        });

        it("TNE4.4: Insufficient rights", async () => {

            const netCode = "NET01";
            const updatedNetwork: NetworkDTO = {
                code: "NET01",
                name: "Viewer Update",
                description: "This should not be updated by viewer"
            };

            const res = await request(app)
                .patch(`/api/v1/networks/${netCode}`)
                .set("Authorization", `Bearer ${tokenViewer}`)
                .send(updatedNetwork);
            expect(res.status).toBe(403);
            expect(res.body.name).toBe(InsufficientRightsError);
        });
    });

    describe("TNE5: DELETE /networks/:code", () => {

        beforeEach(async () => {
            await TestDataSource.getRepository(NetworkDAO).save({
                code: "NET01",
                name: "Test Network",
                description: "This is a test network"
            });
        });

        it("TNE5.1: All parameters valid", async () => {
            const netCode = "NET01";

            const res = await request(app)
                .delete(`/api/v1/networks/${netCode}`)
                .set("Authorization", `Bearer ${token}`);

            expect(res.status).toBe(204);
        });

        it("TNE5.2: Network not found", async () => {
            const netCode = "INVALID";

            const res = await request(app)
                .delete(`/api/v1/networks/${netCode}`)
                .set("Authorization", `Bearer ${token}`);

            expect(res.status).toBe(404);
            expect(res.body.name).toBe(NotFoundError);
        });

        it("TNE5.3: Unauthorized access", async () => {
            const netCode = "NET01";

            const res = await request(app)
                .delete(`/api/v1/networks/${netCode}`)
                .set("Authorization", `Bearer ${tokenInvalid}`);

            expect(res.status).toBe(401);
            expect(res.body.name).toBe(UnauthorizedError);
        });

        it("TNE5.4: Insufficient rights", async () => {
            const netCode = "NET01";

            const res = await request(app)
                .delete(`/api/v1/networks/${netCode}`)
                .set("Authorization", `Bearer ${tokenViewer}`);

            expect(res.status).toBe(403);
            expect(res.body.name).toBe(InsufficientRightsError);
        });
    });
    
});