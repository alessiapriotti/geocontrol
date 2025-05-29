import { generateToken, processToken } from "@services/authService";
import { createAppError } from "@services/errorService";
import { afterAllE2e, beforeAllE2e, TEST_USERS } from "@test/e2e/lifecycle";
import { parseStringArrayParam } from "@utils"
import { ErrorDTO } from "@dto/ErrorDTO";
import { initializeTestDataSource } from "@test/setup/test-datasource";

describe("Other misc tests to increase coverage", () => {
    describe("src/utils.ts", () => {
        // Non si può ottenere da e2e siccome il parametro viene già validato e parsato dai middleware
        it("parseStringArrayParam: StringArray param passed as string", () => {
            const res = parseStringArrayParam("a,b,c");
            expect(res).toStrictEqual(["a", "b", "c"]);
        });
    });

    describe("src/services/authService.ts", () => {
        beforeAll(async () => {
            await beforeAllE2e();
        });

        afterAll(async () => {
            await afterAllE2e();
        });

        // Non si può ottenere da e2e siccome la funzione chiamante passa sempre un valore
        // quindi non userà mai il valore di default
        it("processToken: no allowedRoles passed", async () => {
            const tokenV = generateToken(TEST_USERS.viewer);
            await expect(processToken(`Bearer ${tokenV}`)).resolves.not.toThrow();
        });
    });

    describe("src/services/errorService.ts", () => {
        // Un 500 InternalServerError è generato solamente da un errore senza nome,
        // quindi solo un errore del DB non gestito.
        it("createAppError: Error 500", () => {
            const ERR_REASON = "Generic error from the DB.";
            const err = createAppError(new Error(ERR_REASON));
            expect(err).toMatchObject({
                code: 500,
                name: "InternalServerError",
                message: ERR_REASON
            } as ErrorDTO);
        });

        it("createAppError: Error 500 no reason", () => {
            const err = createAppError(new Error());
            expect(err).toMatchObject({
                code: 500,
                name: "InternalServerError",
                message: "Internal Server Error"
            } as ErrorDTO);
        });

        it("createAppError: Error 500 with stacktrace", () => {
            let err = new Error();
            err.stack = "il mio bellissimo stacktrace";

            const errDTO = createAppError(err);
            expect(errDTO).toMatchObject({
                code: 500,
                name: "InternalServerError",
                message: "Internal Server Error"
            } as ErrorDTO);
        });
    });
});