import * as ctrl from "@controllers/userController";
import { UserDAO } from "@dao/UserDAO";
import { User as UserDTO } from "@dto/User";
import { ConflictError } from "@models/errors/ConflictError";
import { NotFoundError } from "@models/errors/NotFoundError";
import { UserType } from "@models/UserType";
import { closeTestDataSource, initializeTestDataSource, TestDataSource } from "@test/setup/test-datasource";

beforeAll(async () => {
  await initializeTestDataSource();
  await TestDataSource.getRepository(UserDAO).save({username: "root", password: "rootpassword", type: UserType.Admin});
});

afterAll(async () => {
  await closeTestDataSource();
});

describe("UserController big-bang integration", () => {
  describe("TS1: createUser()", () => {
    it("T1.1: all valid", async () => {
      const USERNAME = "testuser";
      const userDTO: UserDTO = {
        username: USERNAME,
        password: "secret",
        type: UserType.Operator
      };

      await ctrl.createUser(userDTO);

      await expect(
        TestDataSource.getRepository(UserDAO).findOneOrFail({where: {username: USERNAME}})
      ).resolves.toMatchObject({
        username: USERNAME,
        type: UserType.Operator
      } as UserDAO);
    });

    it("T1.2: username already used", async () => {
      const USERNAME = "root";
      const userDTO: UserDTO = {
        username: USERNAME,
        password: "secret",
        type: UserType.Operator
      };

      await expect(ctrl.createUser(userDTO)).rejects.toThrow(ConflictError);
    });
  });

  describe("TS2: deleteUser()", () => {

    beforeAll(async () => {
      await TestDataSource.getRepository(UserDAO).save({username: "testuser", password: "secret", type: UserType.Operator});
    });

    it("T2.1: all valid", async () => {
      const USERNAME = "testuser";

      await ctrl.deleteUser(USERNAME);

      await expect(
        TestDataSource.getRepository(UserDAO).findOneOrFail({where: {username: USERNAME}})
      ).rejects.toThrow();
    });

    it("T2.1: user not found", async () => {
      const USERNAME = "pippo";

      await expect(ctrl.deleteUser(USERNAME)).rejects.toThrow(NotFoundError);
    });
  });
});
