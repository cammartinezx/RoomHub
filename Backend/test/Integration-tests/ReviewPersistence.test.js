require("dotenv").config(); // Load environment variables
const ReviewPersistence = require("../../src/Persistence/ReviewPersistence");
const { populate_db } = require("./DbSetup");

describe("ReviewPersistence Class -- Add Review", () => {
    let review_persistence;

    beforeAll(async () => {
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

        await expect(
            review_persistence.add_review(
                reviewData.review_id,
                reviewData.reviewed_by,
                reviewData.reviewed,
                reviewData.overall,
                reviewData.cleanliness,
                reviewData.noise_levels,
                reviewData.respect,
                reviewData.communication,
                reviewData.paying_rent,
                reviewData.chores,
            ),
        ).resolves.not.toThrow();
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
        await expect(
            review_persistence.add_review(
                updatedReview.review_id,
                updatedReview.reviewed_by,
                updatedReview.reviewed,
                updatedReview.overall,
                updatedReview.cleanliness,
                updatedReview.noise_levels,
                updatedReview.respect,
                updatedReview.communication,
                updatedReview.paying_rent,
                updatedReview.chores,
            ),
        ).resolves.not.toThrow();
    });

    it("Should handle unexpected errors gracefully", async () => {
        const invalidReviewId = null; // Simulate invalid input to trigger an error

        await expect(
            review_persistence.add_review(invalidReviewId, "user123", "user456", 4, 5, 3, 4, 4, 5, 4),
        ).rejects.toThrow();
    });
});

describe("ReviewPersistence Class -- Update Review", () => {
    let review_persistence;

    beforeAll(async () => {
        review_persistence = new ReviewPersistence();
        await populate_db();
    });

    it("Should update an existing review successfully", async () => {
        const initialReview = {
            review_id: "review123",
            reviewed_by: "user123",
            reviewed: "user456",
            overall: 3,
            cleanliness: 3,
            noise_levels: 3,
            respect: 3,
            communication: 3,
            paying_rent: 3,
            chores: 3,
        };

        const updatedReview = {
            review_id: "review123",
            overall: 5,
            cleanliness: 5,
            noise_levels: 5,
            respect: 5,
            communication: 5,
            paying_rent: 5,
            chores: 5,
        };

        // Update the review
        await expect(
            review_persistence.update_review(
                updatedReview.review_id,
                updatedReview.reviewed_by,
                updatedReview.reviewed,
                updatedReview.overall,
                updatedReview.cleanliness,
                updatedReview.noise_levels,
                updatedReview.respect,
                updatedReview.communication,
                updatedReview.paying_rent,
                updatedReview.chores,
            ),
        ).resolves.not.toThrow();
    });

    it("Should handle invalid input gracefully", async () => {
        const invalidInput = {
            review_id: null, // Invalid review ID
            overall: 5,
            cleanliness: 5,
            noise_levels: 5,
            respect: 5,
            communication: 5,
            paying_rent: 5,
            chores: 5,
        };

        await expect(
            review_persistence.update_review(
                invalidInput.review_id,
                invalidInput.reviewed_by,
                invalidInput.reviewed,
                invalidInput.overall,
                invalidInput.cleanliness,
                invalidInput.noise_levels,
                invalidInput.respect,
                invalidInput.communication,
                invalidInput.paying_rent,
                invalidInput.chores,
            ),
        ).rejects.toThrow(); // Update command should throw an error
    });
});

describe("ReviewPersistence Class -- Get Reviews for User", () => {
    let review_persistence;

    beforeAll(async () => {
        review_persistence = new ReviewPersistence();
        await populate_db();
    });

    it("Should return all reviews for a specific user", async () => {
        const reviews = [
            {
                review_id: "review5",
                reviewed_by: "user123",
                reviewed: "user456",
                overall: 5,
                cleanliness: 4,
                noise_levels: 3,
                respect: 4,
                communication: 5,
                paying_rent: 4,
                chores: 3,
            },
            {
                review_id: "review6",
                reviewed_by: "user789",
                reviewed: "user456",
                overall: 4,
                cleanliness: 3,
                noise_levels: 5,
                respect: 4,
                communication: 4,
                paying_rent: 5,
                chores: 4,
            },
        ];

        // Get reviews for user "user456"
        const result = await review_persistence.get_reviews_for_user("user456");

        // Verify all reviews for "user456" are returned
        expect(result).toHaveLength(3);
        expect(result).toEqual(
            expect.arrayContaining([
                expect.objectContaining({ review_id: "reviewsmall", reviewed: "user456" }),
                expect.objectContaining({ review_id: "reviewsmall2", reviewed: "user456" }),
            ]),
        );
    });

    it("Should return an empty array when there are no reviews for the user", async () => {
        // Get reviews for a user with no reviews
        const result = await review_persistence.get_reviews_for_user("user999");
        expect(result).toEqual([]);
    });

    it("Should handle a large number of reviews for a specific user", async () => {
        const reviews = Array.from({ length: 100 }, (_, i) => ({
            review_id: `review${i}`,
            reviewed_by: `user${i}`,
            reviewed: "user_large_test",
            overall: 5,
            cleanliness: 4,
            noise_levels: 3,
            respect: 4,
            communication: 5,
            paying_rent: 4,
            chores: 3,
        }));

        // Get reviews for user "user_large_test"
        const result = await review_persistence.get_reviews_for_user("user_large_test");

        // Verify all 100 reviews are returned
        expect(result).toHaveLength(100);
        expect(result).toEqual(expect.arrayContaining(reviews));
    });
});
