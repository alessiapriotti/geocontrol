import * as ctrl from "@controllers/authController";
import { UserDAO } from "@dao/UserDAO";
import { User as UserDTO } from "@dto/User";
import { NotFoundError } from "@models/errors/NotFoundError";
import { UnauthorizedError } from "@models/errors/UnauthorizedError";
import { UserType } from "@models/UserType";
import { closeTestDataSource, initializeTestDataSource, TestDataSource } from "@test/setup/test-datasource";

beforeAll(async () => {
  await initializeTestDataSource();
  await TestDataSource.getRepository(UserDAO).save({username: "root", password: "rootpassword", type: UserType.Admin});
});

afterAll(async () => {
  await closeTestDataSource();
});

describe("TS1: AuthController big-bang integration", () => {
  it("T1.1: all valid", async () => {
    const USERNAME = "root";
    const userDTO: UserDTO = {
      username: USERNAME,
      password: "rootpassword",
      type: UserType.Admin
    };

    await expect(ctrl.getToken(userDTO)).resolves.not.toThrow();
  });

  it("T1.2: wrong password", async () => {
    const USERNAME = "root";
    const userDTO: UserDTO = {
      username: USERNAME,
      password: "wrong-password",
      type: UserType.Admin
    };

    await expect(ctrl.getToken(userDTO)).rejects.toThrow(UnauthorizedError);
  });

  it("T1.3: user do not exist", async () => {
    const USERNAME = "testuser";
    const userDTO: UserDTO = {
      username: USERNAME,
      password: "secret",
      type: UserType.Operator
    };

    await expect(ctrl.getToken(userDTO)).rejects.toThrow(NotFoundError);
  });
});
