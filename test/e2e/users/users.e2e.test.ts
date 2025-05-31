import request from "supertest";
import { app } from "@app";
import { generateToken } from "@services/authService";
import { User as UserDTO } from "@dto/User";
import { beforeAllE2e, afterAllE2e, TEST_USERS } from "@test/e2e/lifecycle";
import { UserType } from "@models/UserType";
import { TestDataSource } from "@test/setup/test-datasource";
import { UserDAO } from "@models/dao/UserDAO";

describe("User Routes (e2e)", () => {
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

  describe("GET /users", () => {
    it("T1.1: all valid", async () => {
      const res = await request(app)
        .get("/api/v1/users")
        .set("Authorization", `Bearer ${token}`);

      expect(res.status).toBe(200);
      expect(res.body.length).toBe(3);

      const usernames = res.body.map((u: any) => u.username).sort();
      const types = res.body.map((u: any) => u.type).sort();

      expect(usernames).toEqual(["admin", "operator", "viewer"]);
      expect(types).toEqual(["admin", "operator", "viewer"]);
    });

    it("T1.2: invalid token", async () => {
      const res = await request(app)
        .get("/api/v1/users")
        .set("Authorization", `Bearer ${tokenInvalid}`);

      expect(res.status).toBe(401);
      expect(res.body.name).toBe("UnauthorizedError");
    });

    it("T1.3: insufficient rights", async () => {
      const res = await request(app)
        .get("/api/v1/users")
        .set("Authorization", `Bearer ${tokenViewer}`);

      expect(res.status).toBe(403);
      expect(res.body.name).toBe("InsufficientRightsError");
    });

    it("T1.4: token is from a user that do not exist", async () => {
      const tokenNoLongerValid = generateToken({ 
        username: "pippo", 
        password: "pippopass", 
        type: UserType.Admin 
      });
      
      const res = await request(app)
        .get("/api/v1/users")
        .set("Authorization", `Bearer ${tokenNoLongerValid}`);

      expect(res.status).toBe(401);
      expect(res.body.name).toBe("UnauthorizedError");
    });

    it("T1.5: token is not formatted correctly", async () => {
      const res = await request(app)
        .get("/api/v1/users")
        .set("Authorization", `Bearerrrrr`);

      expect(res.status).toBe(401);
      expect(res.body.name).toBe("UnauthorizedError");
    });
  });

  describe("POST /users", () => {
    it("T2.1: all valid", async () => {
      const USERNAME = "testuser";
      const userDTO: UserDTO = {
        username: USERNAME,
        password: "secret",
        type: UserType.Operator
      };

      const res = await request(app)
        .post("/api/v1/users")
        .set("Authorization", `Bearer ${token}`)
        .send(userDTO);

      expect(res.status).toBe(201);

      await expect(
        TestDataSource.getRepository(UserDAO).findOneOrFail({where: {username: USERNAME}})
      ).resolves.toMatchObject({
        username: USERNAME,
        type: UserType.Operator
      } as UserDAO);
    });

    it("T1.2: username already used", async () => {
      const USERNAME = "admin";
      const userDTO: UserDTO = {
        username: USERNAME,
        password: "secret",
        type: UserType.Operator
      };

      const res = await request(app)
        .post("/api/v1/users")
        .set("Authorization", `Bearer ${token}`)
        .send(userDTO);

      expect(res.status).toBe(409);
      expect(res.body.name).toBe("ConflictError")
    });
  });

  describe("GET /users/:userName", () => {
    it("T3.1: all valid", async () => {
      const USERNAME = "admin";
      
      const res = await request(app)
        .get(`/api/v1/users/${USERNAME}`)
        .set("Authorization", `Bearer ${token}`);

      expect(res.status).toBe(200);
      expect(res.body).toMatchObject({
        username: USERNAME,
        type: UserType.Admin
      });
    });

    it("T3.2: user do not exist", async () => {
      const USERNAME = "pippo";
      
      const res = await request(app)
        .get(`/api/v1/users/${USERNAME}`)
        .set("Authorization", `Bearer ${token}`);

      expect(res.status).toBe(404);
      expect(res.body.name).toBe("NotFoundError");
    });
  });

  describe("DELETE /users/:userName", () => {
    beforeAll(async () => {
      await TestDataSource.getRepository(UserDAO).save({username: "testuser", password: "secret", type: UserType.Operator});
    });

    it("T2.1: all valid", async () => {
      const USERNAME = "testuser";

      const res = await request(app)
        .delete(`/api/v1/users/${USERNAME}`)
        .set("Authorization", `Bearer ${token}`);

      expect(res.status).toBe(204);

      await expect(
        TestDataSource.getRepository(UserDAO).findOneOrFail({where: {username: USERNAME}})
      ).rejects.toThrow();
    });

    it("T2.2: user not found", async () => {
      const USERNAME = "pippo";

      const res = await request(app)
        .delete(`/api/v1/users/${USERNAME}`)
        .set("Authorization", `Bearer ${token}`);

      expect(res.status).toBe(404);
      expect(res.body.name).toBe("NotFoundError");
    });
  });
});