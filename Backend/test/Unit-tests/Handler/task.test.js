const TaskHandler = require("../../../src/Handler/TaskHandler");
const taskRoutes = require("../../../src/router/Task");
const { mockRequest, mockResponse } = require("mock-req-res");

const express = require("express");
const request = require("supertest");
const UserInfoHandler = require("../../../src/Handler/UserInfoHandler");

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

    get_task_persistence: () => ({
        get_msg_type: jest.fn(),
        update_notification_status: jest.fn(),
    }),
}));

describe("Unit test for GET /", () => {
    let app;

    beforeAll(() => {
        app = express();
        app.use("/", taskRoutes);
    });

    it("should return a 200 status with a welcome message", async () => {
        const res = await request(app).get("/");

        expect(res.status).toBe(200);
        expect(res.body).toEqual({ message: "Welcome to the Task paths" });
    });
});

describe("Unit test for creating a task", () => {
    let task_handler;
    let user_info_handler;
    let req, res;
    let mock_is_valid_user;
    let mock_are_roommates;
    let mock_generate_new_task;
    let mock_add_task_to_room;

    beforeEach(() => {
        task_handler = new TaskHandler();
        user_info_handler = new UserInfoHandler();
        req = mockRequest();
        res = mockResponse();

        res.status = jest.fn().mockReturnValue(res);
        res.json = jest.fn();
        jest.clearAllMocks();

        // Mocking the validation functions
        mock_is_valid_user = jest.spyOn(user_info_handler, "is_valid_user").mockResolvedValue(true);
        mock_are_roommates = jest.spyOn(user_info_handler, "areRoommates").mockResolvedValue(true);
        mock_generate_new_task = jest
            .spyOn(task_handler, "#task_persistence.generate_new_task")
            .mockResolvedValue("SUCCESS");
        mock_add_task_to_room = jest
            .spyOn(task_handler, "#room_persistence.add_task_to_room")
            .mockResolvedValue("SUCCESS");
    });

    afterEach(() => {
        jest.restoreAllMocks();
    });

    it("Send a success response verifying that the user was correctly created", async () => {
        // Setup valid request body
        req.body = {
            tn: "washing dishes",
            frm: "user1@gmail.com",
            to: "user2@gmail.com",
            date: "2024-11-11",
        };

        await task_handler.create_task(req, res);

        // Verify the response
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({ message: "Task created successfully" });
    });
    it("should return 403 when the user is invalid", async () => {
        // Setup invalid request body
        req.body = {
            tn: "washing dishes",
            frm: "user1@gmail.com",
            to: "user2@gmail.com",
            date: "2024-11-11",
        };

        mock_is_valid_user.mockResolvedValue(false);

        // Call create_user
        await task_handler.create_task(req, res);
        // Check response status and message
        expect(res.status).toHaveBeenCalledWith(403);
        expect(res.json).toHaveBeenCalledWith({
            message: "Invalid users involved",
        });
    });
    it("should return 403 when the users are not roommates", async () => {
        // Setup invalid request body
        req.body = {
            tn: "washing dishes",
            frm: "user1@gmail.com",
            to: "user2@gmail.com",
            date: "2024-11-11",
        };
        mock_are_roommates.mockResolvedValue(false);
        // Call create_user
        await task_handler.create_task(req, res);
        // Check response status and message
        expect(res.status).toHaveBeenCalledWith(403);
        expect(res.json).toHaveBeenCalledWith({
            message: "Users are not roommates",
        });
    });
    it("should return 403 when the date is invalid", async () => {
        // Setup invalid request body
        req.body = {
            tn: "Task 1",
            frm: "user1@gmail.com",
            to: "user2@gmail.com",
            date: "2004-11-11",
        };
        // Call create_user
        await task_handler.create_task(req, res);
        // Check response status and message
        expect(res.status).toHaveBeenCalledWith(403);
        expect(res.json).toHaveBeenCalledWith({
            message: "Invalid task name or due date",
        });
    });
    it("should return 500 when an exception is thrown", async () => {
        // Setup valid request body
        req.body = {
            tn: "washing dishes",
            frm: "user1@gmail.com",
            to: "user2@gmail.com",
            date: "2024-11-11",
        };

        // Mock generate_new_task to return a success response
        const create_task_mock = task_handler.get_task_persistence().generate_new_task;
        create_task_mock.mockResolvedValue(new Error("Error message from backend"));

        // Call create_task
        await task_handler.create_task(req, res);

        // Verify the response
        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({ message: "Something went wrong" });
    });
});

describe("Unit test for editing a task", () => {
    let task_handler;
    let user_info_handler;
    let req, res;
    let mock_is_valid_user;
    let mock_are_roommates;
    let mock_generate_new_task;
    let mock_add_task_to_room;
    let mock_task_exists;

    beforeEach(() => {
        task_handler = new TaskHandler();
        user_info_handler = new UserInfoHandler();
        req = mockRequest();
        res = mockResponse();

        res.status = jest.fn().mockReturnValue(res);
        res.json = jest.fn();
        jest.clearAllMocks();

        // Mocking the validation functions
        mock_is_valid_user = jest.spyOn(user_info_handler, "is_valid_user").mockResolvedValue(true);
        mock_are_roommates = jest.spyOn(user_info_handler, "areRoommates").mockResolvedValue(true);
        mock_generate_new_task = jest
            .spyOn(task_handler, "#task_persistence.generate_new_task")
            .mockResolvedValue("SUCCESS");
        mock_add_task_to_room = jest
            .spyOn(task_handler, "#room_persistence.add_task_to_room")
            .mockResolvedValue("SUCCESS");
        mock_task_exists = jest
            .spyOn(task_handler.get_task_persistence(), "get_task_by_id")
            .mockResolvedValue("SUCCESS");
    });

    afterEach(() => {
        jest.restoreAllMocks();
    });

    it("Send a success response verifying that the user was correctly created", async () => {
        // Setup valid request body
        req.body = {
            tn: "washing dishes",
            frm: "user1@gmail.com",
            to: "user2@gmail.com",
            date: "2024-11-11",
        };
        await task_handler.edit_task(req, res);
        // Verify the response
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({ message: "Task created successfully" });
    });
    it("should return 403 when the user is invalid", async () => {
        // Setup invalid request body
        req.body = {
            tn: "washing dishes",
            frm: "user1@gmail.com",
            to: "user2@gmail.com",
            date: "2024-11-11",
        };
        mock_is_valid_user.mockResolvedValue(false);

        // Call create_user
        await task_handler.edit_task(req, res);
        // Check response status and message
        expect(res.status).toHaveBeenCalledWith(403);
        expect(res.json).toHaveBeenCalledWith({
            message: "Invalid users involved",
        });
    });
    it("should return 403 when the users are not roommates", async () => {
        // Setup invalid request body
        req.body = {
            tn: "washing dishes",
            frm: "user1@gmail.com",
            to: "user2@gmail.com",
            date: "2024-11-11",
        };
        mock_are_roommates.mockResolvedValue(false);
        // Call create_user
        await task_handler.edit_task(req, res);
        // Check response status and message
        expect(res.status).toHaveBeenCalledWith(403);
        expect(res.json).toHaveBeenCalledWith({
            message: "Users are not roommates",
        });
    });
    it("should return 403 when the date is invalid", async () => {
        // Setup invalid request body
        req.body = {
            tn: "Task 1",
            frm: "user1@gmail.com",
            to: "user2@gmail.com",
            date: "2004-11-11",
        };
        // Call create_user
        await task_handler.create_task(req, res);
        // Check response status and message
        expect(res.status).toHaveBeenCalledWith(403);
        expect(res.json).toHaveBeenCalledWith({
            message: "Invalid task name or due date",
        });
    });
    it("should return 403 when the task is not found in the persistence", async () => {
        req.body = {
            tn: "Task 1",
            frm: "user1@gmail.com",
            to: "user2@gmail.com",
            date: "2004-11-11",
        };
        // Call create_user
        await task_handler.create_task(req, res);
        // Check response status and message
        expect(res.status).toHaveBeenCalledWith(403);
        expect(res.json).toHaveBeenCalledWith({
            message: "Invalid task name or due date",
        });
    });
    it("should return 500 when an exception is thrown", async () => {
        // Setup valid request body
        req.body = {
            tn: "washing dishes",
            frm: "user1@gmail.com",
            to: "user2@gmail.com",
            date: "2024-11-11",
        };

        // Mock generate_new_task to return a success response
        const create_task_mock = task_handler.get_task_persistence().generate_new_task;
        create_task_mock.mockResolvedValue(new Error("Error message from backend"));

        // Call create_task
        await task_handler.create_task(req, res);

        // Verify the response
        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({ message: "Something went wrong" });
    });
});

describe("Unit test for delete a notification of specific user", () => {
    let task_handler;
    let user_info_handler;
    let req, res;
    let get_user_mock;
    let get_task_list_mock;
    let delete_task_mock;

    beforeEach(() => {
        task_handler = new TaskHandler();
        user_info_handler = new UserInfoHandler();
        req = mockRequest();
        res = mockResponse();

        res.status = jest.fn().mockReturnValue(res);
        res.json = jest.fn();
        jest.clearAllMocks();

        // Commonly used mocks
        get_user_mock = jest.spyOn(user_info_handler, "is_valid_user").mockResolvedValue(true);
        get_task_list_mock = jest
            .spyOn(task_handler, "get_pending_tasks_for_room")
            .mockResolvedValue(["task1", "task2"]);
        delete_task_mock = jest
            .spyOn(task_handler, "delete_task_from_room")
            .mockResolvedValue({ status: 200, message: "Task marked as completed" });
    });

    afterEach(() => {
        jest.restoreAllMocks();
    });

    it("should return 200 when task is successfully marked as completed", async () => {
        req.body = { id: "task1", frm: "user1@gmail.com" };

        await task_handler.delete_task(req, res);

        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({ message: "Task marked as completed" });
    });

    it("should return 403 when user is invalid", async () => {
        req.body = { id: "task1", frm: "user1@gmail.com" };

        get_user_mock.mockResolvedValue(false); // Overwrite for this specific test

        await task_handler.delete_task(req, res);

        expect(get_user_mock).toHaveBeenCalledTimes(1);
        expect(res.status).toHaveBeenCalledWith(403);
        expect(res.json).toHaveBeenCalledWith({ message: "Invalid user" });
    });

    it("should return 403 when the task is not found in pending tasks", async () => {
        req.body = { id: "task1", frm: "user1@gmail.com" };

        get_task_list_mock.mockResolvedValue(["task2", "task3"]); // Adjust for this test

        await task_handler.delete_task(req, res);

        expect(get_user_mock).toHaveBeenCalledTimes(1);
        expect(get_task_list_mock).toHaveBeenCalledWith("task1");
        expect(res.status).toHaveBeenCalledWith(403);
        expect(res.json).toHaveBeenCalledWith({ message: "Task not found" });
    });

    it("should return 500 when an exception is thrown", async () => {
        req.body = { id: "task1", frm: "user1@gmail.com" };

        delete_task_mock.mockRejectedValue(new Error("Error message from backend")); // Custom mock setup for this test

        await task_handler.delete_task(req, res);

        expect(delete_task_mock).toHaveBeenCalledTimes(1);
        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({ message: "Error message from backend" });
    });
    it("should return 500 when unable to retrieve room ID", async () => {
        req.body = { id: "task1", frm: "user1@gmail.com" };
        const get_user_mock = jest.spyOn(user_info_handler, "is_valid_user").mockResolvedValue(true);
        const get_room_id_mock = jest.spyOn(task_handler.get_user_persistence(), "get_room_id").mockResolvedValue(null); // Simulate failure

        await task_handler.delete_task(req, res);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({ message: "An error occurred while deleting the task" });
    });
});
