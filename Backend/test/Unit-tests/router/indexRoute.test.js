// test/Unit-tests/Handler/userRoutes.test.js
const express = require("express");
const request = require("supertest");
const indexRoutes = require("../../../src/router/index"); // Adjust the path as necessary

describe("GET /", () => {
    let app;

    beforeAll(() => {
        app = express();
        app.use("/", indexRoutes); // Mount the userRoutes onto the app
    });

    it("should return a 200 status with a welcome message", async () => {
        const res = await request(app).get("/");

        // Expecting 200 status and the correct JSON response
        expect(res.status).toBe(200);
        expect(res.body).toEqual({ message: "Welcome to the api" });
    });
});
