import request from "supertest";
import { app } from "@app";
import { generateToken } from "@services/authService";
import { beforeAllE2e, afterAllE2e, TEST_USERS } from "@test/e2e/lifecycle";

describe("GET /auth (e2e)", () => {
  let token: string;

  beforeAll(async () => {
    await beforeAllE2e();
    token = generateToken(TEST_USERS.admin);
  });

  afterAll(async () => {
    await afterAllE2e();
  });

  it("T1.1: all valid", async () => {
    const res = await request(app)
      .post("/api/v1/auth")
      .send({
        username: "admin", 
        password: "adminpass"
      });

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("token");
    
    // Provo a fare una richiesta usando il token
    const token = res.body.token;
    const res2 = await request(app)
      .get("/api/v1/users")
      .set("Authorization", `Bearer ${token}`);

    expect(res2.status).toBe(200);
  });

  it("T1.2: wrong password", async () => {
    const res = await request(app)
      .post("/api/v1/auth")
      .send({
        username: "admin", 
        password: "wrong-password"
      });

    expect(res.status).toBe(401);
    expect(res.body.name).toBe("UnauthorizedError");
  });

  it("T1.3: user do not exist", async () => {
    const res = await request(app)
      .post("/api/v1/auth")
      .send({
        username: "pippo", 
        password: "pippopass"
      });

    expect(res.status).toBe(404);
    expect(res.body.name).toBe("NotFoundError");
  });
});
