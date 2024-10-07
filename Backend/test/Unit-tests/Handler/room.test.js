const RoomHandler = require("../../../src/Handler/RoomHandler");
const { mockRequest, mockResponse } = require("mock-req-res");

jest.mock("../../../src/Utility/Services", () => ({
    get_user_persistence: () => ({
        get_user: jest.fn(),
        update_user_room: jest.fn(),
    }),

    get_room_persistence: () => ({
        generate_new_room: jest.fn(),
    }),
}));

describe("Unit test for creating room", () => {
    let roomHandler;
    let req, res;

    beforeEach(() => {
        roomHandler = new RoomHandler();
        req = mockRequest();
        res = mockResponse();

        res.status = jest.fn().mockReturnValue(res); // Allows chaining like res.status(200).json()
        res.json = jest.fn();
        jest.clearAllMocks();
    });

    it("Send a success response verifying that the room was correctly created", async () => {
        // mock get_user and get_room_name
        roomHandler.get_user_persistence().get_user.mockImplementation(() => {
            return { user_id: "test@gmail.com", room_id: "111-111" };
        });
        roomHandler.get_room_persistence().generate_new_room.mockImplementation((room_id, room_name, user_id) => {
            return "SUCCESS";
        });

        req.body = { id: "test@gmail.com", rm: "1000" };

        await roomHandler.create_room(req, res);

        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({ message: "Successfully Created the new room" });
    });

    it("Send a response signifying that the room was not created", async () => {
        // mock get_user and get_room_name
        roomHandler.get_user_persistence().get_user.mockImplementation(() => {
            return { user_id: "test@gmail.com", room_id: "111-111" };
        });
        roomHandler.get_room_persistence().generate_new_room.mockImplementation((room_id, room_name, user_id) => {
            return "FAILURE";
        });

        req.body = { id: "test@gmail.com", rm: "1000" };

        await roomHandler.create_room(req, res);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({ message: "Retry creating the room" });
    });

    it("Send a response signifying that the user name is invalid", async () => {
        // mock get_user and get_room_name
        roomHandler.get_user_persistence().get_user.mockImplementation(() => {
            return null;
        });

        req.body = { id: "test@gmail.com", rm: "1000" };

        await roomHandler.create_room(req, res);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ message: "Bad Request-Invalid User" });
    });

    it("Send a response signifying that the room name is invalid", async () => {
        // mock get_user and get_room_name
        roomHandler.get_user_persistence().get_user.mockImplementation(() => {
            return { user_id: "test@gmail.com", room_id: "111-111" };
        });

        req.body = { id: "test@gmail.com", rm: "" };

        await roomHandler.create_room(req, res);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ message: "Bad Request-Invalid Room Name" });
    });

    it("Send a response signifying that the room name and user name are invalid", async () => {
        // mock get_user and get_room_name
        roomHandler.get_user_persistence().get_user.mockImplementation(() => {
            return null;
        });

        req.body = { id: "test@gmail.com", rm: "" };

        await roomHandler.create_room(req, res);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ message: "Bad Request-Invalid User and room name" });
    });

    it("Send a response signifying that some other error has been thrown from database", async () => {
        // mock get_user and get_room_name
        roomHandler.get_user_persistence().get_user.mockImplementation(() => {
            throw new Error("Sample db error");
        });

        req.body = { id: "test@gmail.com", rm: "" };

        await roomHandler.create_room(req, res);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith(expect.any(Object));
    });
});
