const request = require("supertest");
const app = require("../../../src/router/index");

jest.mock("../../../src/Handler/UserInfoHandler", () => {
    return jest.fn().mockImplementation(() => ({
        // function mocks
        get_user_room: jest.fn().mockImplementation((req, res) => {
            res.status(200).json({ room_name: "test" });
        }),

        get_user_notification: jest.fn().mockImplementation((req, res) => {
            res.status(200).json({
                All_Notification: [
                    {
                        msg: "dan invite luke to join their room",
                        type: "invite",
                    },
                ],
            });
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

    it("Get /user/:id/get-notification should call getuser with the correct id", async () => {
        const user_id = "test@gmail.com";
        const response = await request(app).get(`/user/${user_id}/get-notification`);
        const exp_stat = 200;
        const exp_msg = {
            All_Notification: [
                {
                    msg: "dan invite luke to join their room",
                    type: "invite",
                },
            ],
        };
        expect(response.status).toBe(exp_stat);
        expect(response.body).toEqual(exp_msg);
    });

    it("POST /user/add-user should call create_user function", async () => {
        const query_params = { id: "test@gmail.com" };

        user_info_handler.create_user = jest.fn((req, res) =>
            res.status(200).json({ message: "User Successfully created" })
        );

        const response = await request(app).post("/user/add-user").send(query_params);

        expect(response.status).toBe(200);
        expect(response.body).toEqual({ message: "User Successfully created" });
    });

    it("GET /user/:id/leave-room should notify user leave success", async () => {
        const user_id = "test@gmail.com";

        user_info_handler.leave_user_room = jest.fn((req, res) =>
            res.status(200).json({ message: "User leave the room successfully" })
        );

        const response = await request(app).get(`/user/${user_id}/leave-room`);

        expect(response.status).toBe(200);
        expect(response.body).toEqual({ message: "User leave the room successfully" });
    });

    it("GET /user/:id/get-roommate should notify roommate status", async () => {
        const user_id = "test@gmail.com";

        user_info_handler.get_roommate = jest.fn((req, res) =>
            res.status(200).json({ message: "You have no roommate" })
        );

        const response = await request(app).get(`/user/${user_id}/get-roommate`);

        expect(response.status).toBe(200);
        expect(response.body).toEqual({ message: "You have no roommate" });
    });

    it("DELETE /user/:id/notification/:notif_id should delete a notification", async () => {
        const user_id = "test@gmail.com";
        const notif_id = "111-444";

        user_info_handler.delete_notification = jest.fn((req, res) =>
            res.status(200).json({ message: "Notification deleted successfully" })
        );

        const response = await request(app).delete(`/user/${user_id}/notification/${notif_id}`);

        expect(response.status).toBe(200);
        expect(response.body).toEqual({ message: "Notification deleted successfully" });
    });

});
