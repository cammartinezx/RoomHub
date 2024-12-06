const ProfileHandler = require("../../../src/Handler/ProfileHandler");
const { mockRequest, mockResponse } = require("mock-req-res");
const {
    validateString,
    validateUserExist,
    validateNonEmptyList,
    validateProfileExist,
} = require("../../../src/Utility/validator");
const { get_user_persistence, get_profile_persistence, get_room_persistence, get_notification_persistence } = require("../../../src/Utility/Services");

jest.mock("../../../src/Utility/Services", () => ({
    get_user_persistence: () => ({
        update_user_notifications: jest.fn(),
    }),

    get_profile_persistence: () => ({
        create_profile: jest.fn(),
        update_profile: jest.fn(),
        update_tags: jest.fn(),
        get_profile: jest.fn(),
        is_user_liked_by: jest.fn(),
        add_match: jest.fn(),
        delete_like: jest.fn(),
        add_like: jest.fn(),
    }),

    get_room_persistence: () => ({

    }),

    get_notification_persistence: () => ({
        generate_new_notification: jest.fn(),
    }),
}));

jest.mock("../../../src/Utility/validator", () => ({
    validateString: jest.fn(),
    validatePositiveInteger: jest.fn(),
    validateDate: jest.fn(),
    validateUserExist: jest.fn(),
    validateProfileExist: jest.fn(),
    validateContributorsAreRoommates: jest.fn(),
    validateOutstandingBalance: jest.fn(),
    validateUsersAreRoommates: jest.fn(),
    validateNonEmptyList: jest.fn(),
}));

describe("Unit test for create_profile function", () => {
    let profileHandler;
    let req, res;

    beforeEach(() => {
        jest.resetAllMocks();
        profileHandler = new ProfileHandler();
        req = mockRequest({
            params: { id: "test@gmail.com" },
        });
        res = mockResponse();

        req.body = {
            name: "test",
            location: "winnipeg",
            gender: "male",
            contact_type: "mobile",
            dob: "2001-01-14",
            bio: "hello world",
            contact: "2048072877",
        };
        res.status = jest.fn().mockReturnValue(res);
        res.json = jest.fn();
        jest.clearAllMocks();
    });

    it("Send a success response verifying that the new profile was correctly created", async () => {

        await profileHandler.create_profile(req, res);

        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({ message: "Profile created successfully" });
    });

    it("Send a response signifying that there's an error from request body-- Sync Validator Fail", async () => {
        // mock Validate string to throw error
        validateString.mockImplementation(() => {
            throw new Error("Invalid Name Profile");
        });

        await profileHandler.create_profile(req, res);

        expect(res.status).toHaveBeenCalledWith(422);
        expect(res.json).toHaveBeenCalledWith({ message: "Invalid Name Profile" });
    });

    it("Send a response signifying that there's an error validating request body parameters-- Async Validator Fail", async () => {
        // mock Validate user exist function to throw error
        validateUserExist.mockImplementation(() => {
            throw new Error("User does not exist");
        });

        await profileHandler.create_profile(req, res);

        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({ message: "User does not exist" });
    });

    it("Send a response signifying that there's a db error", async () => {
        profileHandler.get_profile_persistence().create_profile.mockImplementation(() => {
            throw new Error("You don't have access to this service.");
        });

        await profileHandler.create_profile(req, res);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({ message: "You don't have access to this service." });
    });
});


describe("Unit test for update_profile function", () => {
    let profileHandler;
    let req, res;

    beforeEach(() => {
        jest.resetAllMocks();
        profileHandler = new ProfileHandler();
        req = mockRequest({
            params: { id: "test@gmail.com" },
        });
        res = mockResponse();

        req.body = {
            name: "test123",
            location: "toronto",
            gender: "female",
            contact_type: "mobile",
            dob: "2000-02-15",
            bio: "hello baby",
            contact: "23456789",
        };
        res.status = jest.fn().mockReturnValue(res);
        res.json = jest.fn();
        jest.clearAllMocks();
    });

    it("Send a success response verifying that the profile was correctly updated", async () => {

        await profileHandler.update_profile(req, res);

        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({ message: "Profile updated successfully." });
    });

    it("Send a response signifying that there's an error from request body-- Sync Validator Fail", async () => {
        // mock Validate string to throw error
        validateString.mockImplementation(() => {
            throw new Error("Invalid Name Profile");
        });

        await profileHandler.update_profile(req, res);

        expect(res.status).toHaveBeenCalledWith(422);
        expect(res.json).toHaveBeenCalledWith({ message: "Invalid Name Profile" });
    });

    it("Send a response signifying that there's an error validating request body parameters (user not exist)-- Async Validator Fail", async () => {
        // mock Validate user exist function to throw error
        validateUserExist.mockImplementation(() => {
            throw new Error("User does not exist");
        });

        await profileHandler.update_profile(req, res);

        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({ message: "User does not exist" });
    });

    it("Send a response signifying that there's an error validating request body parameters (profile not exist)-- Async Validator Fail", async () => {
        // mock Validate user exist function to throw error
        validateProfileExist.mockImplementation(() => {
            throw new Error("Profile does not exist");
        });

        await profileHandler.update_profile(req, res);

        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({ message: "Profile does not exist" });
    });

    it("Send a response signifying that there's a db error", async () => {
        profileHandler.get_profile_persistence().update_profile.mockImplementation(() => {
            throw new Error("You don't have access to this service.");
        });

        await profileHandler.update_profile(req, res);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({ message: "You don't have access to this service." });
    });
});


describe("Unit test for update_tags function", () => {
    let profileHandler;
    let req, res;

    beforeEach(() => {
        jest.resetAllMocks();
        profileHandler = new ProfileHandler();
        req = mockRequest({
            params: { id: "test@gmail.com" },
        });
        res = mockResponse();

        req.body = {
            tags: [
                "Non-Smoker 🚭",
                "Women-Only 🚺",
                "Open to Guests 👥",
                "Health-Conscious 🥗",
            ],
        };
        res.status = jest.fn().mockReturnValue(res);
        res.json = jest.fn();
        jest.clearAllMocks();
    });

    it("Send a success response verifying that the tags were correctly updated", async () => {

        await profileHandler.update_tags(req, res);

        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({ message: "Tags updated successfully." });
    });

    it("Send a response signifying that there's an error from request body-1- Sync Validator Fail", async () => {
        // mock Validate string to throw error
        validateString.mockImplementation(() => {
            throw new Error("Invalid user ID.");
        });

        await profileHandler.update_tags(req, res);

        expect(res.status).toHaveBeenCalledWith(422);
        expect(res.json).toHaveBeenCalledWith({ message: "Invalid user ID." });
    });

    it("Send a response signifying that there's an error from request body-2- Sync Validator Fail", async () => {
        // mock Validate string to throw error
        validateNonEmptyList.mockImplementation(() => {
            throw new Error("Empty list.");
        });

        await profileHandler.update_tags(req, res);

        expect(res.status).toHaveBeenCalledWith(422);
        expect(res.json).toHaveBeenCalledWith({ message: "Empty list." });
    });

    it("Send a response signifying that there's an error validating request body parameters (user not exist)-- Async Validator Fail", async () => {
        // mock Validate user exist function to throw error
        validateUserExist.mockImplementation(() => {
            throw new Error("User does not exist");
        });

        await profileHandler.update_tags(req, res);

        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({ message: "User does not exist" });
    });

    it("Send a response signifying that there's a db error", async () => {
        profileHandler.get_profile_persistence().update_tags.mockImplementation(() => {
            throw new Error("You don't have access to this service.");
        });

        await profileHandler.update_tags(req, res);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({ message: "You don't have access to this service." });
    });
});


describe("Unit test for get_profile function", () => {
    let profileHandler;
    let req, res;
    let profile;

    beforeEach(() => {
        jest.resetAllMocks();
        profileHandler = new ProfileHandler();
        req = mockRequest({
            params: { id: "hungludao@gmail.com" },
        });
        res = mockResponse();
        res.status = jest.fn().mockReturnValue(res);
        profile = {
            location: "toronto",
            user_id: "hungludao@gmail.com",
            likes: {

            },
            contact_type: "mobile",
            bio: "hello world",
            contact: "2020020202",
            dob: "2001-01-14",
            matches: [
                "daohl@myumanitoba.ca",
                "ngoa4@myumanitoba.ca",
                "victornnah689@gmail.com"
            ],
            name: "lukerq",
            gender: "male",
            tags: [
                "Health-Conscious 🥗",
                "LGBTQ+ Friendly 🏳️‍🌈",
                "Non-Smoker 🚭",
                "Open to Guests 👥",
                "Women-Only 🚺"
            ],
            potential_matches: [],
        }
        res.json = jest.fn();
        jest.clearAllMocks();
    });

    it("Send a success response verifying that getting the profile successfully", async () => {
        const user_id = "hungludao@gmail.com";

        profileHandler.get_profile_persistence().get_profile.mockImplementation((user_id) => {
            return profile;
        });

        await profileHandler.get_profile(req, res);

        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({ profile });
    });

    it("Send a response signifying that there's an error from request body-- Sync Validator Fail", async () => {
        // mock Validate string to throw error
        validateString.mockImplementation(() => {
            throw new Error("Invalid user ID.");
        });

        await profileHandler.get_profile(req, res);

        expect(res.status).toHaveBeenCalledWith(422);
        expect(res.json).toHaveBeenCalledWith({ message: "Invalid user ID." });
    });

    it("Send a response signifying that there's an error validating request body parameters (user not exist)-- Async Validator Fail", async () => {
        // mock Validate user exist function to throw error
        validateUserExist.mockImplementation(() => {
            throw new Error("User does not exist");
        });

        await profileHandler.get_profile(req, res);

        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({ message: "User does not exist" });
    });

    it("Send a response signifying that there's a db error", async () => {
        profileHandler.get_profile_persistence().get_profile.mockImplementation(() => {
            throw new Error("You don't have access to this service.");
        });

        await profileHandler.get_profile(req, res);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({ message: "You don't have access to this service." });
    });
});


describe("Unit test for check_match function", () => {
    let profileHandler;
    let req, res;

    beforeEach(() => {
        jest.resetAllMocks();
        profileHandler = new ProfileHandler();
        req = mockRequest({
            params: { id: "test@gmail.com" },
        });
        res = mockResponse();

        req.body = { id: "test123@gmail.com" };
        res.status = jest.fn().mockReturnValue(res);
        res.json = jest.fn();
        jest.clearAllMocks();
    });

    it("Send a success response verifying that users are a match.", async () => {
        const result = { status: 200, message: "true" };
        const user_id = "test@gmail.com";
        const liked_id = "test123@gmail.com";

        profileHandler.get_profile_persistence().is_user_liked_by.mockImplementation((user_id, liked_id) => {
            return result;
        });

        await profileHandler.check_match(req, res);

        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({ message: "users are a match. Added to each matches list" });
    });

    it("Send a success response verifying that user succesfully added to likes.", async () => {
        const result = { status: 200, message: "false" };
        const user_id = "test@gmail.com";
        const liked_id = "test123@gmail.com";

        profileHandler.get_profile_persistence().is_user_liked_by.mockImplementation((user_id, liked_id) => {
            return result;
        });

        await profileHandler.check_match(req, res);

        //expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({ message: "user succesfully added to likes" });
    });

    it("Send a response signifying that there's an error from request body-- Sync Validator Fail", async () => {
        // mock Validate string to throw error
        validateString.mockImplementation(() => {
            throw new Error("Invalid user ID.");
        });

        await profileHandler.check_match(req, res);

        expect(res.status).toHaveBeenCalledWith(422);
        expect(res.json).toHaveBeenCalledWith({ message: "Invalid user ID." });
    });

    it("Send a response signifying that there's an error validating request body parameters (user not exist)-- Async Validator Fail", async () => {
        // mock Validate user exist function to throw error
        validateUserExist.mockImplementation(() => {
            throw new Error("User does not exist");
        });

        await profileHandler.check_match(req, res);

        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({ message: "User does not exist" });
    });

    it("Send a response signifying that there's a db error", async () => {
        profileHandler.get_profile_persistence().is_user_liked_by.mockImplementation(() => {
            throw new Error("You don't have access to this service.");
        });

        await profileHandler.check_match(req, res);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({ message: "You don't have access to this service." });
    });
});


describe("Unit test for notify_match_helper function", () => {
    let profileHandler;
    let user_id, user_id2;

    beforeEach(() => {
        jest.resetAllMocks();
        profileHandler = new ProfileHandler();
        user_id = "test@gmail.com";
        user_id2 = "test123@gmail.com";
        jest.clearAllMocks();
    });

    it("Send a response signifying that there's a db error from notification", async () => {
        profileHandler.get_notification_persistence().generate_new_notification.mockImplementation(() => {
            throw new Error("You don't have access to this service.");
        });

        const result = await profileHandler.notify_match_helper(user_id, user_id2);

        expect(result).toEqual("You don't have access to this service.");
    });

    it("Send a response signifying that there's a db error from user", async () => {
        profileHandler.get_user_persistence().update_user_notifications.mockImplementation(() => {
            throw new Error("You don't have access to this service.");
        });

        const result = await profileHandler.notify_match_helper(user_id, user_id2);

        expect(result).toEqual("You don't have access to this service.");
    });
});