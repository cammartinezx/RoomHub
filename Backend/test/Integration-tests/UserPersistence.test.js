require("dotenv").config(); // Load environment variables
const UserInfoHandler = require("../../src/Handler/UserInfoHandler");
const UserPersistence = require("../../src/Persistence/UserPersistence");
const { populate_db } = require("./DbSetup");

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

    beforeAll(async () => {
        // initialize the userPersistence
        user_persistence = new UserPersistence();

        user_id = "test@gmail.com";
        fake_user_id = "testfake@gmail.com";
        await populate_db();
    });

    it("Should return the retrieved javascript object", async () => {
        result = await user_persistence.get_user(user_id);

        expect(result).toEqual({
            user_id: "test@gmail.com",
            notification: ["123", "456", "delete_req"],
            room_id: "rm_11",
        });
    });

    it("Should return null- since the user doesn't exist", async () => {
        result = await user_persistence.get_user(fake_user_id);
        expect(result).toEqual(null);
    });
});

describe("UserPersistence Class-- Update a users room", () => {
    let user_persistence;
    let user_id;

    beforeAll(async () => {
        // initialize the userPersistence
        user_persistence = new UserPersistence();

        user_id = "test2@gmail.com";
        room_id = "rm_11";
        await populate_db();
    });

    it("Should not throw error- meaning successful update of the room", async () => {
        await expect(user_persistence.update_user_room(room_id, user_id)).resolves.not.toThrow();
    });
});

describe("UserPresistence Class -- Getting a room id", () => {
    let user_persistence;
    let user_id;
    let no_room_user_id;

    beforeAll(async () => {
        // initialize the userPersistence
        user_persistence = new UserPersistence();

        user_id = "test@gmail.com";
        no_room_user_id = "test11@gmail.com";
        await populate_db();
    });

    it("Should return room id", async () => {
        result = await user_persistence.get_room_id(user_id);
        expect(result).toEqual("rm_11");
    });

    it("Should return an error that user doesn't have a room yet", async () => {
        await expect(user_persistence.get_room_id(no_room_user_id)).rejects.toThrow(
            `User ${no_room_user_id} doesn't have a room yet`,
        );
    });
});

describe("UserPersistence Class -- Getting notifications", () => {
    let user_persistence;
    let user_id;
    let no_notif_user_id;

    beforeAll(async () => {
        // initialize the userPersistence
        user_persistence = new UserPersistence();

        user_id = "test@gmail.com";
        no_notif_user_id = "test11@gmail.com";
        await populate_db();
    });

    it("Should return notification", async () => {
        result = await user_persistence.get_notification(user_id);
        expect(result).toEqual(["123", "456", "delete_req"]);
    });

    it("Should return an error that user doesn't have a notification yet", async () => {
        let response = await user_persistence.get_notification(no_notif_user_id);
        expect(response).toEqual([]);
    });
});

describe("UserPersistence Class-- Update a users notification", () => {
    let user_persistence;
    let user_id;
    let notif_id;

    beforeAll(async () => {
        // initialize the userPersistence
        user_persistence = new UserPersistence();

        user_id = "test@gmail.com";
        notif_id = "123";
        await populate_db();
    });
    it("Should not throw error- meaning successful update of the notification", async () => {
        await expect(user_persistence.update_user_notifications(notif_id, user_id)).resolves.not.toThrow();
    });
});

describe("UserPersistence Class-- Deleting a notification from a users set of notifications", () => {
    let user_persistence;
    let user_id;
    let notif_id;

    beforeAll(async () => {
        // initialize the userPersistence
        user_persistence = new UserPersistence();

        user_id = "test@gmail.com";
        notif_id = "123";
        await populate_db();
    });

    it("Should not throw error- meaning successful update of the notification", async () => {
        await expect(user_persistence.update_notification_set(notif_id, user_id)).resolves.not.toThrow();
    });
});

describe("UserPersistence Class-- Delete a specific room for specific user", () => {
    let user_persistence;
    let user_id;
    let room_id;

    beforeAll(async () => {
        // initialize the userPersistence
        user_persistence = new UserPersistence();

        user_id = "test@gmail.com";
        room_id = "rm_11";
        await populate_db();
    });

    it("Should not throw error - meaning successful delete the room_id from user", async () => {
        await expect(user_persistence.remove_room_id(room_id, user_id)).resolves.not.toThrow();
    });
});

describe("GET /user/:id/review-page/:roommate_id", () => {
    let user_persistence;
    let user_id;
    let roommate_id;

    beforeAll(async () => {
        user_persistence = new UserPersistence();
        user_id = "test3@gmail.com";
        roommate_id = "roommate1@gmail.com";
        await populate_db();
    });

    it("Should return a roommate's profile when it exists", async () => {
        const profile = await user_persistence.get_profile(roommate_id);
        expect(profile).toEqual(expect.objectContaining({ user_id: roommate_id }));
    });

    it("Should return null when roommate's profile does not exist", async () => {
        const profile = await user_persistence.get_profile("nonexistent@gmail.com");
        expect(profile).toBeNull();
    });
});

describe("POST /user/send-review", () => {
    let user_persistence;
    let user_id;
    let roommate_id;

    beforeAll(async () => {
        user_persistence = new UserPersistence();
        user_id = "test3@gmail.com";
        roommate_id = "roommate1@gmail.com";
        await populate_db();
    });

    it("Should successfully add a new review", async () => {
        const reviewData = {
            reviewed_by: user_id,
            reviewed: roommate_id,
            overall: 5,
            cleanliness: 4,
            noise_levels: 3,
            respect: 5,
            communication: 5,
            paying_rent: 4,
            chores: 3,
        };

        const addReviewResponse = await user_persistence.add_review(
            reviewData.reviewed_by,
            reviewData.reviewed,
            reviewData.overall,
            reviewData.cleanliness,
            reviewData.noise_levels,
            reviewData.respect,
            reviewData.communication,
            reviewData.paying_rent,
            reviewData.chores,
        );

        expect(addReviewResponse).toBeUndefined();
    });

    it("Should successfully update an existing review", async () => {
        const updatedReviewData = {
            reviewed_by: user_id,
            reviewed: roommate_id,
            overall: 4,
            cleanliness: 4,
            noise_levels: 4,
            respect: 4,
            communication: 4,
            paying_rent: 4,
            chores: 4,
        };

        const updateReviewResponse = await user_persistence.update_review(
            updatedReviewData.reviewed_by,
            updatedReviewData.reviewed,
            updatedReviewData.overall,
            updatedReviewData.cleanliness,
            updatedReviewData.noise_levels,
            updatedReviewData.respect,
            updatedReviewData.communication,
            updatedReviewData.paying_rent,
            updatedReviewData.chores,
        );

        expect(updateReviewResponse).toBeUndefined();
    });
});
