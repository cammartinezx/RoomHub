const request = require("supertest");
const app = require("../../../src/router/index");

describe("Unit test for userRoute", () => {
    beforeEach(() => {
        userRoute = require("../../../src/router/User");
    });
    it("send nothing, should be error", async () => {
        const res = await request(app).post("/user/add-user");
        expect(res.statusCode).toEqual(500);
    });
    it("correct test, should be true", async () => {
        const random = Math.floor(Math.random() * 100000);
        const res = await request(app)
            .post("/user/add-user")
            .send({
                id: random + "@gmail.com",
            });
        expect(res.statusCode).toEqual(200);
    });
    it("empty id, should be error", async () => {
        const res = await request(app).post("/user/add-user").send({
            id: "",
        });
        expect(res.statusCode).toEqual(400);
    });
});
