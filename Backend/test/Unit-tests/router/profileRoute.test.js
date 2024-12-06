const request = require("supertest");
const app = require("../../../src/router/index");
const profileRouter = require("../../../src/router/Profile");
const express = require("express");

jest.mock("../../../src/Handler/ProfileHandler", () => {
    return jest.fn().mockImplementation(() => ({
        // function mocks
        create_profile: jest.fn().mockImplementation((req, res) => {
            res.status(200).json({ message: "Profile created successfully" });
        }),

        update_profile: jest.fn().mockImplementation((req, res) => {
            res.status(200).json({ message: "Profile updated successfully" });
        }),

        update_tags: jest.fn().mockImplementation((req, res) => {
            res.status(200).json({ message: "Tags updated successfully" });
        }),

        get_profile: jest.fn().mockImplementation((req, res) => {
            res.status(200).json({
                profile: {
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
            });
        }),

        check_match: jest.fn().mockImplementation((req, res) => {
            res.status(200).json({ message: "Users match successfully" });
        }),
    }));
});

describe("Profile router tests", () => {
    beforeEach(() => {
        jest.clearAllMocks();
        app.use(express.json());
        app.use("/profile", profileRouter);
    });

    it("POST /create-profile should create a new profile", async () => {
        const user_id = "test@gmail.com";
        const requestBody = {
            name: "test",
            location: "winnipeg",
            gender: "male",
            contact_type: "mobile",
            dob: "2001-01-14",
            bio: "hello world",
            contact: "2048072877",
        };
        const response = await request(app).post(`/profile/${user_id}/create-profile`).send(requestBody);

        expect(response.status).toBe(200);
        expect(response.body.message).toBe("Profile created successfully");
    });

    it("PATCH /update-profile should update user profile", async () => {
        const user_id = "test@gmail.com";
        const requestBody = {
            name: "test123",
            location: "winnipeg",
            gender: "male",
            contact_type: "mobile",
            dob: "2001-01-14",
            bio: "hello baby",
            contact: "2047770807",
        };
        const response = await request(app).patch(`/profile/${user_id}/update-profile`).send(requestBody);

        expect(response.status).toBe(200);
        expect(response.body.message).toBe("Profile updated successfully");
    });

    it("PATCH /update-tags should update profile tags", async () => {
        const user_id = "test@gmail.com";
        const requestBody = {
            tags: [
                "Non-Smoker 🚭",
                "Women-Only 🚺",
                "Open to Guests 👥",
                "Health-Conscious 🥗",
            ],
        };
        const response = await request(app).patch(`/profile/${user_id}/update-tags`).send(requestBody);

        expect(response.status).toBe(200);
        expect(response.body.message).toBe("Tags updated successfully");
    });

    it("GET /get-profile should retrieve a user profile", async () => {
        const user_id = "hungludao@gmail.com";
        const expectedResponse = {
            profile: {
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
        };
        const response = await request(app).get(`/profile/${user_id}/get-profile`);

        expect(response.status).toBe(200);
        expect(response.body).toEqual(expectedResponse);
    });

    it("POST /check-match should check match for a user", async () => {
        const user_id = "test@gmail.com";
        const requestBody = {
            id: "test123@gmail.com",
        };
        const response = await request(app).post(`/profile/${user_id}/check-match`).send(requestBody);

        expect(response.status).toBe(200);
        expect(response.body.message).toBe("Users match successfully");
    });
});
