require("dotenv").config(); // Load environment variables
const UserInfoHandler = require("../../src/Handler/UserInfoHandler");
const UserPersistence = require("../../src/Persistence/UserPersistence");
const { populate_db } = require("./DBSetup");

describe("UserPersistence Class-- Testing Creating a new user", () => {
    let user_info_handler;
    let user_persistence;
    let user_id;

    beforeAll(async () => {
        // initialize the userHandlerobject
        user_info_handler = new UserInfoHandler();
        user_persistence = new UserPersistence();
        user_id = "test3@gmail.com";
        await populate_db();
    });

    it("Should return values that signify that the user is created", async () => {
        result = await user_persistence.save_new_user(user_id);

        expect(result.status).toBe(200);
        expect(result.message).toBe("User Successfully created");
    });

    it("Should return a response that signifies that the user alraedy exist", async () => {
        result = await user_persistence.save_new_user(user_id);
        expect(result.status).toBe(200);
        expect(result.message).toBe("This user name already exist");
    });
});

describe("UserPersistence Class-- Getting a user", () => {
    let user_persistence;
    let user_id;

    beforeAll(() => {
        // initialize the userPersistence
        user_persistence = new UserPersistence();

        user_id = "test@gmail.com";
        fake_user_id = "testfake@gmail.com";
    });

    it("Should return the retrieved javascript object", async () => {
        result = await user_persistence.get_user(user_id);

        expect(result).toEqual({ user_id: "test@gmail.com", notification: new Set(["123", "456"]), room_id: "rm_11" });
    });

    it("Should return null- since the user doesn't exist", async () => {
        result = await user_persistence.get_user(fake_user_id);
        expect(result).toEqual(null);
    });
});

describe("UserPersistence Class-- Update a users room", () => {
    let user_persistence;
    let user_id;

    beforeAll(() => {
        // initialize the userPersistence
        user_persistence = new UserPersistence();

        user_id = "test2@gmail.com";
        room_id = "rm_11";
        // populate_db();
    });

    it("Should not throw error- meaning successful update of the room", async () => {
        await expect(user_persistence.update_user_room(room_id, user_id)).resolves.not.toThrow();
    });
});

// describe("UserPersistence Class-- Testing geting a users room -- Pesistence test for getting a user", () => {
//     let user_info_handler;

//     beforeAll(() => {
//         // initialize the userHandlerobject
//         user_info_handler = new UserInfoHandler();
//         // user_persistence = new UserPersistenceit

//         user_data = {
//             id: "test@gmail.com",
//         };
//     });

//     it("Send the users room name successfully", async () => {
//         const response = await request(router)
//             .get("/user/test@gmail.com/get-room")
//             .set("Content-Type", "application/json")
//             .set("Accept", "application/json");

//         expect(response.status).toBe(200);
//         expect(response.body).toEqual({ room_name: "NA" });
//     });
// });
