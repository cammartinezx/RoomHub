const app = require("../../../src/router/index");
const request = require("supertest");

jest.mock("../../../src/Handler/RoomHandler", () => {
    return jest.fn().mockImplementation(() => ({
        create_room: jest.fn().mockImplementation((req, res) => {
            res.status(200).json({ message: "Test Successful" });
        }),

        add_roommate: jest.fn().mockImplementation((req, res) => {
            res.status(200).json({ message: "Test Successful" });
        }),
    }));
});

describe("Room router tests", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("Post room/create-room should call the create_room function in room_handler", async () => {
        const query_params = {
            rm: "test_rm",
            id: "test@gmail.com",
        };
        const response = await request(app).post("/room/create-room").send(query_params);
        const exp_stat = 200;
        const exp_msg = { message: "Test Successful" };
        expect(response.status).toBe(exp_stat);
        expect(response.body).toEqual(exp_msg);
    });

    it("Post room/add-roommate should call the add_roommate method in the room_handler", async () => {
        const query_params = {
            existing_roommate: "test@gmail.com",
            new_roommate: "testnew@gmail.com",
            room_nm: "test_rm",
        };
        const response = await request(app).post("/room/add-roommate").send(query_params);
        const exp_stat = 200;
        const exp_msg = { message: "Test Successful" };
        expect(response.status).toBe(exp_stat);
        expect(response.body).toEqual(exp_msg);
    });
});
