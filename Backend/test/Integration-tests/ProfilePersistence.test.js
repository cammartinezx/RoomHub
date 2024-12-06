require("dotenv").config(); // Load environment variables
const { populate_profile } = require("./DbSetup");
const ProfilePersistence = require("../../src/Persistence/ProfilePersistence");

describe("Profile Persistence-- Test create a new profile", () => {
    let profile_persistence;

    beforeAll(async () => {
        profile_persistence = new ProfilePersistence();
        await populate_profile();
    });

    it("Should not throw any error-- Signifying that a profile was properly created", async () => {
        const result = await profile_persistence.create_profile(
            "superman",
            "winnipeg",
            "ahihi",
            "male",
            "2000-10-10",
            "chim to",
            "20202020202",
            "mobile"
        );

        expect(result).toEqual({
            status: 200,
            message: "User Successfully created",
        });
    });

    it("Should not throw any error-- Signifying that a profile already existed", async () => {
        const result = await profile_persistence.create_profile(
            "test",
            "winnipeg",
            "ahihi",
            "male",
            "2000-10-10",
            "chim to",
            "20202020202",
            "mobile"
        );

        expect(result).toEqual({
            status: 200,
            message: "This user name already exist",
        });
    });

    it("Should throw an error-- Signifying that a profile was not created", async () => {
        await expect(
            profile_persistence.create_profile(
                15,
            ),
        ).rejects.toThrow();
    });
});


describe("Profile Persistence-- Test update a profile", () => {
    let profile_persistence;

    beforeAll(async () => {
        profile_persistence = new ProfilePersistence();
        await populate_profile();
    });

    it("Should not throw any error-- Signifying that a profile was properly updated", async () => {
        const result = await profile_persistence.update_profile(
            "test",
            "toronto",
            "ahihi",
            "female",
            "2001-10-10",
            "chim to",
            "20202020202",
            "mobile"
        );

        expect(result).toEqual({
            status: 200,
            message: "Profile Successfully Updated",
        });
    });

    it("Should throw an 400 error-- Signifying that an user doesn't exist", async () => {
        const result = await profile_persistence.update_profile(
            "ok chua",
            "winnipeg",
            "ahihi",
            "male",
            "2000-10-10",
            "chim to",
            "20202020202",
            "mobile"
        );

        expect(result).toEqual({
            status: 400,
            message: "This user doesn't exist",
        });
    });

    it("Should throw an error-- Signifying that a profile was not updated", async () => {
        await expect(
            profile_persistence.update_profile(
                15,
            ),
        ).rejects.toThrow();
    });
});


describe("Profile Persistence-- Test get a profile", () => {
    let profile_persistence;

    beforeAll(async () => {
        profile_persistence = new ProfilePersistence();
        await populate_profile();
    });

    it("Should not throw an error-- Signifying that getting a profile successfully", async () => {
        const user_id = "test";
        const expected_result = {
            user_id: "test",
            bio: "hello",
            chores: "4.00",
            cleanliness: "2.00",
            communication: "4.00",
            contact: "202020202",
            contact_type: "mobile",
            dob: "2001-01-01",
            gender: "male",
            likes: new Set(["test1", "test2"]),
            location: "winnipeg",
            matches: new Set(["test456"]),
            name: "baby",
            noise_levels: "4.00",
            overall: "4.00",
            paying_rent: "4.00",
            respect: "2.00",
            tags: new Set([
                "Eco-Conscious ♻️",
                "Likes Cooking 🍲",
                "Short-Term Friendly 🗓️",
                "Vegetarian/Vegan 🌱",
            ]),
        }
        const result = await profile_persistence.get_profile(user_id);

        expect(result).toEqual(expected_result);
    });

    it("Should throw an error-- Signifying that profile not existed yet", async () => {
        const user_id = "cudo";
        const result = await profile_persistence.get_profile(user_id);

        expect(result).toEqual(null);
    });
});


describe("Profile Persistence-- Test update tags", () => {
    let profile_persistence;

    beforeAll(async () => {
        profile_persistence = new ProfilePersistence();
        await populate_profile();
    });

    it("Should not throw any error-- Signifying that tags was properly updated", async () => {
        const result = await profile_persistence.update_tags(
            "test",
            new Set([
                "Creative-Friendly 🎨",
                "Eco-Conscious ♻️",
                "Fitness Enthusiast 🏋️",
                "LGBTQ+ Friendly 🏳️‍🌈",
                "Night Owl 🌙",
            ]),
        );

        expect(result).toEqual({
            status: 200,
            message: "Tags successfully updated",
        });
    });

    it("Should throw an 400 error-- Signifying that an user doesn't exist", async () => {
        const result = await profile_persistence.update_tags(
            "ok chua",
            new Set([
                "Creative-Friendly 🎨",
                "Eco-Conscious ♻️",
                "Fitness Enthusiast 🏋️",
                "LGBTQ+ Friendly 🏳️‍🌈",
                "Night Owl 🌙",
            ]),
        );

        expect(result).toEqual({
            status: 400,
            message: "This user doesn't exist",
        });
    });

    it("Should throw an error-- Signifying that tags were not updated", async () => {
        await expect(
            profile_persistence.update_tags(
                15,
            ),
        ).rejects.toThrow();
    });
});


describe("Profile Persistence-- Test add a like", () => {
    let profile_persistence;

    beforeAll(async () => {
        profile_persistence = new ProfilePersistence();
        await populate_profile();
    });

    it("Should not throw any error-- Signifying that like successfully added", async () => {
        const result = await profile_persistence.add_like("test", "test123");

        expect(result).toEqual({
            status: 200,
            message: "Like successfully added",
        });
    });
});


describe("Profile Persistence-- Test add a match", () => {
    let profile_persistence;

    beforeAll(async () => {
        profile_persistence = new ProfilePersistence();
        await populate_profile();
    });

    it("Should not throw any error-- Signifying that match successfully added", async () => {
        const result = await profile_persistence.add_match("test", "test123");

        expect(result).toEqual({
            status: 200,
            message: "Match successfully added",
        });
    });

    it("Should throw any error-- Signifying that user not found", async () => {
        const result = await profile_persistence.add_match("bim hong", "test123");

        expect(result).toEqual({
            status: 400,
            message: "User not found",
        });
    });

    it("Should throw an error-- Signifying that match not add", async () => {
        await expect(
            profile_persistence.add_match(
                15,
            ),
        ).rejects.toThrow();
    });
});


describe("Profile Persistence-- Test delete a like", () => {
    let profile_persistence;

    beforeAll(async () => {
        profile_persistence = new ProfilePersistence();
        await populate_profile();
    });

    it("Should not throw any error-- Signifying that Liked user successfully deleted from list", async () => {
        const result = await profile_persistence.delete_like("test", "test123");

        expect(result).toEqual({
            status: 200,
            message: "Liked user successfully deleted from list",
        });
    });

    it("Should throw any error-- Signifying that user not found", async () => {
        const result = await profile_persistence.delete_like("bim hong", "test123");

        expect(result).toEqual({
            status: 400,
            message: "User not found",
        });
    });

    it("Should throw an error-- Signifying that like is not delete", async () => {
        await expect(
            profile_persistence.delete_like(
                15,
            ),
        ).rejects.toThrow();
    });
});


describe("Profile Persistence-- Test is user liked by", () => {
    let profile_persistence;

    beforeAll(async () => {
        profile_persistence = new ProfilePersistence();
        await populate_profile();
    });

    it("Should not throw any error-- Signifying that user is like by other user", async () => {
        const result = await profile_persistence.is_user_liked_by("test1", "test");

        expect(result).toEqual({
            status: 200,
            message: "true",
        });
    });

    it("Should not throw any error-- Signifying that user is not like by other user", async () => {
        const result = await profile_persistence.is_user_liked_by("test", "test123");

        expect(result).toEqual({
            status: 200,
            message: "false",
        });
    });

    it("Should throw an 400 error-- Signifying that user not found", async () => {
        const result = await profile_persistence.is_user_liked_by("test", "bu chim");

        expect(result).toEqual({
            status: 400,
            message: "User not found",
        });
    });

    it("Should throw an error-- Signifying that function throw an error", async () => {
        await expect(
            profile_persistence.is_user_liked_by(
                15,
            ),
        ).rejects.toThrow();
    });
});


describe("Profile Persistence-- Test update profile averages", () => {
    let profile_persistence;

    beforeAll(async () => {
        profile_persistence = new ProfilePersistence();
        await populate_profile();
    });

    it("Should not throw any error-- Signifying that successfully update profile averages", async () => {
        const averages = {
            overall: "4.00",
            cleanliness: "1.00",
            noise_levels: "2.00",
            respect: "3.00",
            communication: "4.00",
            paying_rent: "5.00",
            chores: "1.00",
        }

        await expect(
            profile_persistence.update_profile_averages("test", averages),
        ).resolves.not.toThrow();
    });
});


describe("Profile Persistence-- Test getting profiles by locations", () => {
    let profile_persistence;

    beforeAll(async () => {
        profile_persistence = new ProfilePersistence();
        await populate_profile();
    });

    it("Should not throw any error-- Signifying that successfully getting profiles based on location", async () => {
        const result = await profile_persistence.get_profiles_by_location("winnipeg");
        const expected_result = [
            {
                bio: "chim to",
                contact: "20202020202",
                contact_type: "mobile",
                dob: "2000-10-10",
                gender: "male",
                location: "winnipeg",
                name: "ahihi",
                user_id: "superman",
            },
            {
                bio: "chim to",
                chores: "3.00",
                cleanliness: "1.00",
                communication: "5.00",
                contact: "2020242302",
                contact_type: "mobile",
                dob: "2000-03-04",
                gender: "male",
                likes: new Set(["test1", "test2"]), // Convert Set to Array for comparison
                location: "winnipeg",
                matches: new Set(["test456"]), // Convert Set to Array for comparison
                name: "lady",
                noise_levels: "3.00",
                overall: "2.00",
                paying_rent: "1.00",
                respect: "3.00",
                tags: new Set([
                    "Creative-Friendly 🎨",
                    "Eco-Conscious ♻️",
                    "Fitness Enthusiast 🏋️",
                    "LGBTQ+ Friendly 🏳️‍🌈",
                    "Night Owl 🌙",
                ]), // Convert Set to Array for comparison
                user_id: "test123",
            },
            {
                bio: "hello",
                chores: "4.00",
                cleanliness: "2.00",
                communication: "4.00",
                contact: "202020202",
                contact_type: "mobile",
                dob: "2001-01-01",
                gender: "male",
                likes: new Set(["test1", "test2"]), // Convert Set to Array for comparison
                location: "winnipeg",
                matches: new Set(["test456"]), // Convert Set to Array for comparison
                name: "baby",
                noise_levels: "4.00",
                overall: "4.00",
                paying_rent: "4.00",
                respect: "2.00",
                tags: new Set([
                    "Eco-Conscious ♻️",
                    "Likes Cooking 🍲",
                    "Short-Term Friendly 🗓️",
                    "Vegetarian/Vegan 🌱",
                ]), // Convert Set to Array for comparison
                user_id: "test",
            },
        ];
        expect(result).toEqual(expected_result);
    });


    it("Should not throw any error-- Signifying that there is no profiles based on location", async () => {
        const result = await profile_persistence.get_profiles_by_location("toronto");

        expect(result).toEqual([]);
    });

    it("Should throw an error-- Signifying that there is an db error happen", async () => {

        await expect(
            profile_persistence.get_profiles_by_location(undefined),
        ).rejects.toThrow();
    });
});

