const UserInfoHandler = require("../../../src/Handler/UserInfoHandler");
const userRoutes = require("../../../src/router/User");
const { mockRequest, mockResponse } = require("mock-req-res");

const express = require("express");
const request = require("supertest");

jest.mock("../../../src/Utility/Services", () => ({
    get_user_persistence: () => ({
        save_new_user: jest.fn(),
        get_user: jest.fn(),
        get_notification: jest.fn(),
    }),

    get_room_persistence: () => ({
        get_room_name: jest.fn(),
    }),

    get_notification_persistence: () => ({
        get_msg_type: jest.fn(),
        update_notification_status: jest.fn(),
    }),
}));

describe("Unit test for GET /", () => {
    let app;

    beforeAll(() => {
        app = express();
        app.use("/", userRoutes);
    });

    it("should return a 200 status with a welcome message", async () => {
        const res = await request(app).get("/");

        expect(res.status).toBe(200);
        expect(res.body).toEqual({ Message: "Welcome to the User paths" });
    });
});

describe("Unit test for creating user", () => {
    let user_info_handler;
    let req, res;

    beforeEach(() => {
        user_info_handler = new UserInfoHandler();
        req = mockRequest();
        res = mockResponse();

        res.status = jest.fn().mockReturnValue(res); // Allows chaining like res.status(200).json()
        res.json = jest.fn();
        jest.clearAllMocks();                                                
    });

    it("Send a success response verifying that the user was correctly created", async () => {
        // Setup valid request body
        req.body = { id: "abc@gmail.com" };

        // Mock save_new_user to return a success response
        const create_user_mock = user_info_handler.get_user_persistence().save_new_user;
        create_user_mock.mockResolvedValue({ status: 200, message: "User created successfully" });

        // Call create_user
        await user_info_handler.create_user(req, res);

        // Verify the call to save_new_user
        expect(create_user_mock).toHaveBeenCalledWith("abc@gmail.com");

        // Verify the response
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({ message: "User created successfully" });
    });

    it("should return 400 when user_id is invalid", async () => {
        // Setup invalid request body
        req.body = { id: "" };

        // Call create_user
        await user_info_handler.create_user(req, res);

        // Check response status and message
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({
            message: "Error Creating User- User id is invalid",
        });
    });

    it("should return 500 when an exception is thrown", async () => {
        // Setup valid request body
        req.body = { id: "bcd@gmail.com" };

        // Mock save_new_user to throw an error
        const create_user_mock = user_info_handler.get_user_persistence().save_new_user;
        create_user_mock.mockRejectedValue(new Error("Something went wrong"));

        // Call create_user
        await user_info_handler.create_user(req, res);

        // Verify the response
        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({ message: "Something went wrong" });
    });
});

describe("Testing getting a users room", () => {
    let userInfoHandler;
    beforeEach(() => {
        userInfoHandler = new UserInfoHandler();
        req = mockRequest();
        res = mockResponse();

        res.status = jest.fn().mockReturnValue(res); // Allows chaining like res.status(200).json()
        res.json = jest.fn();
        jest.clearAllMocks();
    });

    it("Send the users room name successfully", async () => {
        // mock get_user and get_room_name
        userInfoHandler.get_user_persistence().get_user.mockImplementation((user_id) => {
            return { user_id: "test@gmail.com", room_id: "111-111" };
        });
        userInfoHandler.get_room_persistence().get_room_name.mockImplementation((room_id) => {
            return "UpBoyz";
        });

        req = mockRequest({
            params: { id: "test@gmail.com" },
        });

        await userInfoHandler.get_user_room(req, res);

        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({ room_name: "UpBoyz" });
    });

    it("Should send error with invalid username", async () => {
        req = mockRequest({
            params: { id: " " },
        });

        await userInfoHandler.get_user_room(req, res);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ room_name: "This username is invalid" });
    });

    it("Should send error status code with user that doesn't exist", async () => {
        // mock get_user and get_room_name
        userInfoHandler.get_user_persistence().get_user.mockImplementation((user_id) => {
            return null;
        });

        req = mockRequest({
            params: { id: "fake_user@gmail.com" },
        });

        await userInfoHandler.get_user_room(req, res);

        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({ room_name: "User not found" });
    });

    it("Send error from the backend", async () => {
        // mock get_user and get_room_name
        await userInfoHandler.get_user_room(req, res);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith(expect.any(Object));
    });

    it("Send error if the user doesn't have a room", async () => {
        // mock get_user and get_room_name
        userInfoHandler.get_user_persistence().get_user.mockImplementation((user_id) => {
            return { user_id: "test@gmail.com", room_id: undefined };
        });
        userInfoHandler.get_room_persistence().get_room_name.mockImplementation((room_id) => {
            return undefined;
        });

        req = mockRequest({
            params: { id: "test@gmail.com" },
        });

        await userInfoHandler.get_user_room(req, res);

        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({ room_name: "NA" });
    });
});

describe("Testing getting a user notification", () => {
    let userInfoHandler;
    beforeEach(() => {
        userInfoHandler = new UserInfoHandler();
        req = mockRequest();
        res = mockResponse();

        res.status = jest.fn().mockReturnValue(res);
        res.json = jest.fn();
        jest.clearAllMocks();
    });

    it("Send the user notification message and type successfully", async () => {
        // mock get_user get_notification and get_msg_type
        userInfoHandler.get_user_persistence().get_user.mockImplementation((user_id) => {
            return { user_id: "test@gmail.com" };
        });

        userInfoHandler.get_user_persistence().get_notification.mockImplementation((user_id) => {
            return ["111-111", "222-222"];
        });

        userInfoHandler.get_notification_persistence().update_notification_status.mockImplementation((notif_id) => {
            console.log(`Set up the status of notif_id ${notif_id} to be read`);
        });

        userInfoHandler.get_notification_persistence().get_msg_type.mockImplementation((notif_id) => {
            if (notif_id === "111-111") {
                return {
                    msg: "dan invite luke to join their room",
                    type: "invite",
                };
            }
            else if (notif_id === "222-222") {
                return {
                    msg: "daniel invite lu to join their room",
                    type: "invite",
                };
            }
        });

        req = mockRequest({
            params: { id: "test@gmail.com" },
        });

        await userInfoHandler.get_user_notification(req, res);

        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({ 
            All_Notifications: [
                {
                    msg: "dan invite luke to join their room",
                    type: "invite",
                },
                {
                    msg: "daniel invite lu to join their room",
                    type: "invite",
                }
            ]
        });
    });

    it("Should send error with invalid username", async () => {
        req = mockRequest({
            params: { id: " " },
        });

        await userInfoHandler.get_user_notification(req, res);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ message: "This username is invalid" });
    });

    it("Should send error status code with user that doesn't exist", async () => {
        // mock get_user and get_room_name
        userInfoHandler.get_user_persistence().get_user.mockImplementation((user_id) => {
            return null;
        });

        req = mockRequest({
            params: { id: "fake_user@gmail.com" },
        });

        await userInfoHandler.get_user_notification(req, res);

        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({ message: "User not found" });
    });

    it("Send error from the backend", async () => {
        // mock get_user and get_room_name
        await userInfoHandler.get_user_notification(req, res);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith(expect.any(Object));
    });
});
