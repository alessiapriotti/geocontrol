import * as auth from "@middlewares/authMiddleware";
import * as svc from "@services/authService";
import { UserType } from "@models/UserType";
import { afterAllE2e, beforeAllE2e, TEST_USERS } from "@test/e2e/lifecycle";
import request from "supertest";
import { app } from "@app";

describe("AuthMiddleware unit testing", () => {
    // Codici di stato per le risposte
    const MyOk = 207;
    const InsufficientRightsError = 403;
    const UnauthorizedError = 401;

    // Token per le richieste
    let tokenAdmin = "";
    let tokenOperator = "";
    let tokenViewer = "";

    beforeAll(async () => {
        await beforeAllE2e();
        tokenAdmin = svc.generateToken(TEST_USERS.admin);
        tokenOperator = svc.generateToken(TEST_USERS.operator);
        tokenViewer = svc.generateToken(TEST_USERS.viewer);
    })

    afterAll(async () => {
        await afterAllE2e();
    })

    it("T1: Admin-level authorization", async () => {
        const ROUTE = "/test/t1";

        app.get(ROUTE,
            auth.authenticateUser([UserType.Admin]),
            (req, res, next) => {
                res.status(MyOk).send();
            }
        );

        // Admin
        let res = await request(app)
            .get(ROUTE)
            .set("Authorization", `Bearer ${tokenAdmin}`);
        
        expect(res.status).toBe(MyOk);

        // Operator
        res = await request(app)
            .get(ROUTE)
            .set("Authorization", `Bearer ${tokenOperator}`);
        
        expect(res.status).toBe(InsufficientRightsError);

        // Viewer
        res = await request(app)
            .get(ROUTE)
            .set("Authorization", `Bearer ${tokenViewer}`);
        
        expect(res.status).toBe(InsufficientRightsError);

        // Non loggato
        res = await request(app)
            .get(ROUTE);
        
        expect(res.status).toBe(UnauthorizedError);
    });

    it("T2: Operator-level authorization", async () => {
        const ROUTE = "/test/t2";

        app.get(ROUTE,
            auth.authenticateUser([UserType.Admin, UserType.Operator]),
            (req, res, next) => {
                res.status(MyOk).send();
            }
        );

        // Admin
        let res = await request(app)
            .get(ROUTE)
            .set("Authorization", `Bearer ${tokenAdmin}`);
        expect(res.status).toBe(MyOk);

        // Operator
        res = await request(app)
            .get(ROUTE)
            .set("Authorization", `Bearer ${tokenOperator}`);
        expect(res.status).toBe(MyOk);

        // Viewer
        res = await request(app)
            .get(ROUTE)
            .set("Authorization", `Bearer ${tokenViewer}`);
        expect(res.status).toBe(InsufficientRightsError);

        // Non loggato
        res = await request(app)
            .get(ROUTE);
        expect(res.status).toBe(UnauthorizedError);
    });

    it("T3: Viewer-level authorization", async () => {
        const ROUTE = "/test/t3";

        app.get(ROUTE,
            auth.authenticateUser([UserType.Admin, UserType.Operator, UserType.Viewer]),
            (req, res, next) => {
                res.status(MyOk).send();
            }
        );

        // Admin
        let res = await request(app)
            .get(ROUTE)
            .set("Authorization", `Bearer ${tokenAdmin}`);
        expect(res.status).toBe(MyOk);

        // Operator
        res = await request(app)
            .get(ROUTE)
            .set("Authorization", `Bearer ${tokenOperator}`);
        expect(res.status).toBe(MyOk);

        // Viewer
        res = await request(app)
            .get(ROUTE)
            .set("Authorization", `Bearer ${tokenViewer}`);
        expect(res.status).toBe(MyOk);

        // Non loggato
        res = await request(app)
            .get(ROUTE);
        expect(res.status).toBe(UnauthorizedError);
    });

    it("T4: All logged users", async () => {
        const ROUTE = "/test/t4";

        app.get(ROUTE,
            auth.authenticateUser(),
            (req, res, next) => {
                res.status(MyOk).send();
            }
        );

        // Admin
        let res = await request(app)
            .get(ROUTE)
            .set("Authorization", `Bearer ${tokenAdmin}`);
        expect(res.status).toBe(MyOk);

        // Operator
        res = await request(app)
            .get(ROUTE)
            .set("Authorization", `Bearer ${tokenOperator}`);
        expect(res.status).toBe(MyOk);

        // Viewer
        res = await request(app)
            .get(ROUTE)
            .set("Authorization", `Bearer ${tokenViewer}`);
        expect(res.status).toBe(MyOk);

        // Non loggato
        res = await request(app)
            .get(ROUTE);
        expect(res.status).toBe(UnauthorizedError);
    });
});