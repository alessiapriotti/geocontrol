import {
  initializeTestDataSource,
  closeTestDataSource,
  TestDataSource
} from "@test/setup/test-datasource";
import * as NetworkController from "@controllers/networkController";
import { NetworkDAO } from "@dao/NetworkDAO";
import { Network as NetworkDTO } from "@dto/Network";
import { ConflictError } from "@models/errors/ConflictError";
import { NotFoundError } from "@models/errors/NotFoundError";
import { Not } from "typeorm";

beforeAll(async () => {
  await initializeTestDataSource();
});

afterAll(async () => {
  await closeTestDataSource();
});

beforeEach(async () => {
  await TestDataSource.getRepository(NetworkDAO).clear();
});

describe("NetworkController integration", () => {
    
    describe("TNC1: Create Network", () => {

        it("TNC1.1 All parameters valid", async () => {
            const newNetwork: NetworkDTO = {
                code: "NET01",
                name: "New Test Network",
                description: "This is a new test network"
            };

            await NetworkController.createNetwork(newNetwork);
            
            await expect(
                TestDataSource.getRepository(NetworkDAO).findOneBy({ code: newNetwork.code })
            ).resolves.toMatchObject({
                code: newNetwork.code,
                name: newNetwork.name,
                description: newNetwork.description
            } as NetworkDAO);
        });

        it("TNC1.2 Error if Network with same code exists", async () => {
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

            await expect(
                NetworkController.createNetwork(newNetwork)
            ).rejects.toThrow(ConflictError);
        });

        it("TNC1.3 Error if code is empty", async () => {
            const netCode: string = null;
            const newNetwork: NetworkDTO = {
                code: netCode,
                name: "New Test Network",
                description: "This is a new test network"
            };

            await expect(
                NetworkController.createNetwork(newNetwork)
            ).rejects.toThrow();
        });
    });

    describe("TNC2: get Network", () => {
        beforeEach(async () => {
            await TestDataSource.getRepository(NetworkDAO).save({code: "NET01", name: "Test Network", description: "This is a test network"});
        });

        it("TNC2.1 All parameters valid", async () => {
            const netCode: string = "NET01";
            const result = await NetworkController.getNetwork(netCode);

            expect(result).toEqual({
                code: "NET01",
                name: "Test Network",
                description: "This is a test network"
            });
            expect(result).not.toHaveProperty("id");
            expect(result).not.toHaveProperty("gateways");
        });

        it("TNC2.2 Network not found", async () => {
            const netCode: string = "INVALID";
            await expect(NetworkController.getNetwork(netCode)).rejects.toThrow(NotFoundError);
        });

        it("TNC2.3 Empty code", async () => {
            const netCode: string = "";
            await expect(NetworkController.getNetwork(netCode)).rejects.toThrow(NotFoundError);
        });
    });

    describe("TNC3: get All Networks", () => {
        beforeEach(async () => {
            await TestDataSource.getRepository(NetworkDAO).save([
                { code: "NET01", name: "Network 1", description: "First network" },
                { code: "NET02", name: "Network 2", description: "Second network" }
            ]);
        });

        it("TNC3.1 All parameters valid", async () => {

            const result = await NetworkController.getAllNetworks();

            expect(result).toHaveLength(2);
            expect(result[0]).toEqual({
                code: "NET01",
                name: "Network 1",
                description: "First network"
            });
            expect(result[0]).not.toHaveProperty("id");
            expect(result[1]).toEqual({
                code: "NET02",
                name: "Network 2",
                description: "Second network"
            });
            expect(result[1]).not.toHaveProperty("id");
        });

        it("TNC3.2 No Networks found", async () => {
            await TestDataSource.getRepository(NetworkDAO).clear();
            const result = await NetworkController.getAllNetworks();
            expect(result).toHaveLength(0);
        });
    });
    
    describe("TNC4: Update Network", () => {
        beforeEach(async () => {
            await TestDataSource.getRepository(NetworkDAO).save({code: "NET01", name: "Test Network", description: "This is a test network"});
        });

        it("TNC4.1 All parameters valid", async () => {
            const netCode: string = "NET01";
            const updatedNetwork: NetworkDTO = {
                code: "NET02",
                name: "Updated Test Network",
                description: "This is an updated test network"
            };

            const result = await NetworkController.updateNetwork(netCode, updatedNetwork);

            await expect(
                TestDataSource.getRepository(NetworkDAO).findOneBy({ code: updatedNetwork.code }
            )).resolves.toMatchObject({
                code: updatedNetwork.code,
                name: updatedNetwork.name,
                description: updatedNetwork.description
            } as NetworkDAO);
        });

        it("TNC4.2 Error old network doens't exist", async () => {
            const netCode: string = "INVALID";
            const updatedNetwork: NetworkDTO = {
                code: "NET02",
                name: "Updated Test Network",
                description: "This is an updated test network"
            };

            await expect(
                NetworkController.updateNetwork(netCode, updatedNetwork)
            ).rejects.toThrow(NotFoundError);
        });

        it("TNC4.3 Error if code is empty", async () => {

            const netCode: string = "";
            const updatedNetwork: NetworkDTO = {
                code: "NET02",
                name: "Updated Test Network",
                description: "This is an updated test network"
            };

            await expect(
                NetworkController.updateNetwork(netCode, updatedNetwork)
            ).rejects.toThrow(NotFoundError);
        });

        it("TNC4.4 Error update with existing code", async () => {

            const existingNetwork: NetworkDTO = {
                code: "NET02",
                name: "Existing Network",
                description: "This network already exists"
            };
            await TestDataSource.getRepository(NetworkDAO).save(existingNetwork);

            const netCode: string = "NET01";
            const updatedNetwork: NetworkDTO = {
                code: "NET02",
                name: "Updated Test Network",
                description: "This is an updated test network"
            };

            await expect(
                NetworkController.updateNetwork(netCode, updatedNetwork)
            ).rejects.toThrow(ConflictError);
        });

        it("TNC4.5 Update with same code", async () => {
            const netCode: string = "NET01";
            const updatedNetwork: NetworkDTO = {
                code: "NET01",
                name: "Updated Test Network",
                description: "This is an updated test network"
            };

            await expect(
                NetworkController.updateNetwork(netCode, updatedNetwork)
            ).resolves.not.toThrow();
        });

    });

    describe("TNC5: Delete Network", () => {

        beforeEach(async () => {
            await TestDataSource.getRepository(NetworkDAO).save({code: "NET01", name: "Test Network", description: "This is a test network"});
        });

        it("TNC5.1 All parameters valid", async () => {   
            const networkCode = "NET01";

            await expect(NetworkController.deleteNetwork(networkCode)).resolves.not.toThrow();
        });

        it("TNC5.2 Error if network does not exist", async () => {
            const networkCode = "INVALID";

            await expect(NetworkController.deleteNetwork(networkCode)).rejects.toThrow(NotFoundError);
        });

        it("TNC5.3 Error if code is empty", async () => {
            const networkCode: string = "";

            await expect(NetworkController.deleteNetwork(networkCode)).rejects.toThrow(NotFoundError);
        });

    });

});