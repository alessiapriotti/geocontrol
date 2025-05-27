import {
  initializeTestDataSource,
  closeTestDataSource,
  TestDataSource
} from "@test/setup/test-datasource";
import { NetworkRepository } from "@repositories/NetworkRepository";
import { NetworkDAO } from "@dao/NetworkDAO";
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

describe("NetworkRepository: SQLite in-memory", () => {
  const repo = new NetworkRepository();

    describe("TNR1: Create Network", () => {
        beforeEach(async () => {
            await TestDataSource.getRepository(NetworkDAO).save({code: "NET01"});
        });

        it("TNR1.1: All parameters valid", async () => {
            const code = "NET02";
            await repo.createNetwork(code, "Test Network", "This is a test network"); 

            await expect(
                TestDataSource.getRepository(NetworkDAO).findOneBy({ code: code })
            ).resolves.toMatchObject({
                code: code,
                name: "Test Network",
                description: "This is a test network"
            } as NetworkDAO);
        });    

        it("TNR1.2: Error if Network with same code exists", async () => {
            const code = "NET01";
            await expect(
                repo.createNetwork(code, "Test Network", "This is a test network")
            ).rejects.toThrow(ConflictError);
        });
        
    });

    describe("TNR2: Get Network by Code", () => {
        beforeEach(async () => {
            await TestDataSource.getRepository(NetworkDAO).save({code: "NET01", name: "Test Network", description: "This is a test network"});
        });

        it("TNR2.1: All parameters valid", async () => {
            const network = await repo.getNetworkByCode("NET01");
            expect(network).toMatchObject({
                code: "NET01",
                name: "Test Network",
                description: "This is a test network"
            } as NetworkDAO);
        });

        it("TNR2.2: Network not found", async () => {
            await expect(repo.getNetworkByCode("INVALID")).rejects.toThrow(NotFoundError);
        });

        it("TNR2.3: Empty code", async () => {
            await expect(repo.getNetworkByCode("")).rejects.toThrow(NotFoundError);
        });
    });

    describe("TNR3: GetAllNetworks", () => {
        beforeEach(async () => {
            await TestDataSource.getRepository(NetworkDAO).save([
                { code: "NET01", name: "Network 1", description: "First network" },
                { code: "NET02", name: "Network 2", description: "Second network" }
            ]);
        });

        it("TNR3.1: All parameters valid", async () => {
            const networks = await repo.getAllNetwork();
            expect(networks).toHaveLength(2);
            expect(networks[0]).toMatchObject({
                code: "NET01",
                name: "Network 1",
                description: "First network"
            } as NetworkDAO);
            expect(networks[1]).toMatchObject({
                code: "NET02",
                name: "Network 2",
                description: "Second network"
            } as NetworkDAO);
        });

        it("TNR3.2: No networks found", async () => {
            await TestDataSource.getRepository(NetworkDAO).clear();
            const networks = await repo.getAllNetwork();
            expect(networks).toHaveLength(0);
        });
    });
    describe("TNR4: Update Network", () => {
        beforeEach(async () => {
            await TestDataSource.getRepository(NetworkDAO).save({code: "NET01", name: "Test Network", description: "This is a test network"});
        });

        it("TNR4.1: All parameters valid", async () => {
            const code = "NET01";
            const newCode = "NET02";
            await repo.updateNetwork(code, newCode, "Updated Network", "Updated description");

            const updatedNetwork = await TestDataSource.getRepository(NetworkDAO).findOneBy({ code: newCode });
            expect(updatedNetwork).toMatchObject({
                code: newCode,
                name: "Updated Network",
                description: "Updated description"
            } as NetworkDAO);
        });

        it("TNR4.2: Error old network doens't exist", async () => {
            await expect(repo.updateNetwork("INVALID", "NET02", "Updated Network", "Updated description")).rejects.toThrow(NotFoundError);
        });

        it("TNR4.3: Error update with empty code", async () => {
            await expect(repo.updateNetwork("", "NET02", "Updated Network", "Updated description")).rejects.toThrow(NotFoundError);
        });

        it("TNR4.4: Error Update with existing code", async () => {
            await TestDataSource.getRepository(NetworkDAO).save({code: "NET02", name: "Another Network", description: "Another description"});
            await expect(repo.updateNetwork("NET01", "NET02", "Updated Network", "Updated description")).rejects.toThrow(ConflictError);
        });

        it("TNR4.5: Update with same code", async () => {
            const code = "NET01";
            await repo.updateNetwork(code, code, "Test Network", "This is a test network");

            const updatedNetwork = await TestDataSource.getRepository(NetworkDAO).findOneBy({ code: code });
            expect(updatedNetwork).toMatchObject({
                code: code,
                name: "Test Network",
                description: "This is a test network"
            } as NetworkDAO);
        });

    });
    describe("TNR5: Delete Network", () => { 
        beforeEach(async () => {
            await TestDataSource.getRepository(NetworkDAO).save({code: "NET01", name: "Test Network", description: "This is a test network"});
        });

        it("TNR5.1: All parameters valid", async () => {
            const code = "NET01";
            await repo.deleteNetwork(code);

            const deletedNetwork = await TestDataSource.getRepository(NetworkDAO).findOneBy({ code: code });
            expect(deletedNetwork).toBeNull();
        });

        it("TNR5.2: Error if network does not exist", async () => {
            await expect(repo.deleteNetwork("INVALID")).rejects.toThrow(NotFoundError);
        });

        it("TNR5.3: Error if code is empty", async () => {
            await expect(repo.deleteNetwork("")).rejects.toThrow(NotFoundError);
        });
    });
});