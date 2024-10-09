require("dotenv").config(); // Load environment variables
const UserInfoHandler = require("../../src/Handler/UserInfoHandler");
// const UserPersistence = require("../../src/Persistence/UserPersistence");
const router = require("../../src/router/index");
const request = require("supertest");

describe("UserInfoHandler Class", () => {
    let user_info_handler;

    beforeAll(() => {
        // initialize the userHandlerobject
        user_info_handler = new UserInfoHandler();
        // user_persistence = new UserPersistence();

        user_data = {
            id: "test@gmail.com",
        };
    });

    it("Should return a success message that a new user was created", async () => {
        const response = await request(router)
            .post("/user/add-user")
            .send(user_data)
            .set("Content-Type", "application/json")
            .set("Accept", "application/json");

        expect(response.status).toBe(200);
        expect(response.body).toEqual({ message: "User Successfully created" });
    });

    it("Should return a message that the user already exist", async () => {
        const response = await request(router)
            .post("/user/add-user")
            .send(user_data)
            .set("Content-Type", "application/json")
            .set("Accept", "application/json");
        expect(response.status).toBe(200);
        expect(response.body).toEqual({ message: "This user name already exist" });
    });
});
