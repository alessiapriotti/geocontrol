import {
  initializeTestDataSource,
  closeTestDataSource,
  TestDataSource
} from "@test/setup/test-datasource";
import { NetworkRepository } from "@repositories/NetworkRepository";
import { NetworkDAO } from "@dao/NetworkDAO";

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

    describe("TN1: Create Network", () => {
        beforeEach(async () => {
            await TestDataSource.getRepository(NetworkDAO).save({code: "NET01"});
        });

        it("TN1.1: All parameters valid", async () => {
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

        it("TN1.2: Error if Network with same code exists", async () => {
            const code = "NET01";
            await expect(
                repo.createNetwork(code, "Test Network", "This is a test network")
            ).rejects.toThrow();
        });

        it("TN1.3: Error if code is empty", async () => {
            await expect(
                repo.createNetwork("", "Test Network", "This is a test network")
            ).rejects.toThrow();
        });
        
    });

    describe("TN2: Get Network by Code", () => {
        beforeEach(async () => {
            await TestDataSource.getRepository(NetworkDAO).save({code: "NET01", name: "Test Network", description: "This is a test network"});
        });

        it("TN2.1: Valid code", async () => {
            const network = await repo.getNetworkByCode("NET01");
            expect(network).toMatchObject({
                code: "NET01",
                name: "Test Network",
                description: "This is a test network"
            } as NetworkDAO);
        });

        it("TN2.2: Invalid code", async () => {
            await expect(repo.getNetworkByCode("INVALID")).rejects.toThrow();
        });

        it("TN2.3: Empty code", async () => {
            await expect(repo.getNetworkByCode("")).rejects.toThrow();
        });
    });

    describe("TN3: GetAllNetworks", () => {
        beforeEach(async () => {
            await TestDataSource.getRepository(NetworkDAO).save([
                { code: "NET01", name: "Network 1", description: "First network" },
                { code: "NET02", name: "Network 2", description: "Second network" }
            ]);
        });

        it("TN3.1: Get all networks", async () => {
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

        it("TN3.2: No networks available", async () => {
            await TestDataSource.getRepository(NetworkDAO).clear();
            const networks = await repo.getAllNetwork();
            expect(networks).toHaveLength(0);
        });
    });
    describe("TN4: Update Network", () => {
        beforeEach(async () => {
            await TestDataSource.getRepository(NetworkDAO).save({code: "NET01", name: "Test Network", description: "This is a test network"});
        });

        it("TN4.1: Valid update", async () => {
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

        it("TN4.2: Invalid code", async () => {
            await expect(repo.updateNetwork("INVALID", "NET02", "Updated Network", "Updated description")).rejects.toThrow();
        });

        it("TN4.3: Empty code", async () => {
            await expect(repo.updateNetwork("", "NET02", "Updated Network", "Updated description")).rejects.toThrow();
        });

        it("TN4.4: Update with existing code", async () => {
            await TestDataSource.getRepository(NetworkDAO).save({code: "NET02", name: "Another Network", description: "Another description"});
            await expect(repo.updateNetwork("NET01", "NET02", "Updated Network", "Updated description")).rejects.toThrow();
        });

    });
    describe("TN5: Delete Network", () => { 
        beforeEach(async () => {
            await TestDataSource.getRepository(NetworkDAO).save({code: "NET01", name: "Test Network", description: "This is a test network"});
        });

        it("TN5.1: Valid deletion", async () => {
            const code = "NET01";
            await repo.deleteNetwork(code);

            const deletedNetwork = await TestDataSource.getRepository(NetworkDAO).findOneBy({ code: code });
            expect(deletedNetwork).toBeNull();
        });

        it("TN5.2: Invalid code", async () => {
            await expect(repo.deleteNetwork("INVALID")).rejects.toThrow();
        });

        it("TN5.3: Empty code", async () => {
            await expect(repo.deleteNetwork("")).rejects.toThrow();
        });
    });
});