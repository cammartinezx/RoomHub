require("dotenv").config(); // Load environment variables
const ReviewPersistence = require("../../src/Persistence/ReviewPersistence");
const { populate_db } = require("./DbSetup");

describe("ReviewPersistence Class -- Add Review", () => {
    let review_persistence;

    beforeAll(async () => {
        // Set up the local DynamoDB instance and create the table schema

        review_persistence = new ReviewPersistence();
        await populate_db();
    });


    it("Should add a review successfully", async () => {
        const reviewData = {
            review_id: "review123",
            reviewed_by: "user123",
            reviewed: "user456",
            overall: 4,
            cleanliness: 5,
            noise_levels: 3,
            respect: 4,
            communication: 4,
            paying_rent: 5,
            chores: 4,
        };

        await expect(review_persistence.add_review(
            reviewData.review_id,
            reviewData.reviewed_by,
            reviewData.reviewed,
            reviewData.overall,
            reviewData.cleanliness,
            reviewData.noise_levels,
            reviewData.respect,
            reviewData.communication,
            reviewData.paying_rent,
            reviewData.chores
        )).resolves.not.toThrow();
    });

    it("Should overwrite an existing review with the same ID", async () => {
        const initialReview = {
            review_id: "review456",
            reviewed_by: "user123",
            reviewed: "user456",
            overall: 3,
            cleanliness: 3,
            noise_levels: 2,
            respect: 3,
            communication: 3,
            paying_rent: 3,
            chores: 3,
        };

        const updatedReview = {
            review_id: "review456",
            reviewed_by: "user123",
            reviewed: "user456",
            overall: 5,
            cleanliness: 5,
            noise_levels: 5,
            respect: 5,
            communication: 5,
            paying_rent: 5,
            chores: 5,
        };

        // Overwrite with updated review
         await expect(review_persistence.add_review(
            updatedReview.review_id,
            updatedReview.reviewed_by,
            updatedReview.reviewed,
            updatedReview.overall,
            updatedReview.cleanliness,
            updatedReview.noise_levels,
            updatedReview.respect,
            updatedReview.communication,
            updatedReview.paying_rent,
            updatedReview.chores
        )).resolves.not.toThrow();

    });

    it("Should handle unexpected errors gracefully", async () => {
        const invalidReviewId = null; // Simulate invalid input to trigger an error

        await expect(
            review_persistence.add_review(
                invalidReviewId,
                "user123",
                "user456",
                4,
                5,
                3,
                4,
                4,
                5,
                4
            )
        ).rejects.toThrow();
    });
});