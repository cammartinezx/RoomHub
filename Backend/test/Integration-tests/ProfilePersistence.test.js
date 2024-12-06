require("dotenv").config(); // Load environment variables
const { populate_profile } = require("./DbSetup");
const ProfilePersistence = require("../../src/Persistence/ProfilePersistence");

describe("Profile Persistence-- Test create a new profile", () => {
    let profile_persistence;

    beforeAll(async () => {
        profile_persistence = new ProfilePersistence();
    });

    it("Should not throw any error-- Signifying that a profile was properly created", async () => {
        await expect(
            profile_persistence.create_profile(
                "superman",
                "winnipeg",
                "ahihi",
                "male",
                "2000-10-10",
                "chim to",
                "20202020202",
                "mobile",
            ),
        ).resolves.not.toThrow();
    });
});
