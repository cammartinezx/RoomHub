const UserInfoHandler = require("../../src/Handler/UserInfoHandler");
const { mockRequest, mockResponse } = require("mock-req-res");

jest.mock("../../src/Utility/Services", () => ({
    get_user_persistence: () => ({
        save_new_user: jest.fn(),
    }),
}));

describe("Mock test for creating user", () => {
    let user_info_handler;
    let req, res;

    beforeEach(() => {
        user_info_handler = new UserInfoHandler();
        req = mockRequest();
        res = mockResponse();

        res.status = jest.fn().mockReturnValue(res); // Allows chaining like res.status(200).json()
        res.json = jest.fn();
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

    it("should call save_new_user with valid user_id", async () => {
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
