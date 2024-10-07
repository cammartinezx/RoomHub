const request = require("supertest");
const app = require("../../../src/router/index");

jest.mock("../../../src/Handler/UserInfoHandler", () => {
    return jest.fn().mockImplementation(() => ({
        // function mocks
        get_user_room: jest.fn().mockImplementation((req, res) => {
            res.status(200).json({ room_name: "test" });
        }),

        create_user: jest.fn().mockImplementation((req, res) => {
            res.status(200).json({ message: "Test successful" });
        }),
    }));
});

describe("User router tests", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("Get /user/:id/get-room should call getuser with the correct id", async () => {
        const user_id = "test@gmail.com";
        const response = await request(app).get(`/user/${user_id}/get-room`);
        const exp_stat = 200;
        const exp_msg = { room_name: "test" };
        expect(response.status).toBe(exp_stat);
        expect(response.body).toEqual(exp_msg);
    });

    it("Post /user/add-user", async () => {
        const query_params = { id: "test@gmail.com" };
        const exp_stat = 200;
        const exp_msg = { message: "Test successful" };
        const response = await request(app).post("/user/add-user").send(query_params);
        expect(response.status).toBe(exp_stat);
        expect(response.body).toEqual(exp_msg);
    });
});
