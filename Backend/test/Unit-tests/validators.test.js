const {
    validateString,
    validatePositiveInteger,
    validateDate,
    validateUserExist,
    validateContributorsAreRoommates,
    validateOutstandingBalance,
    validateUsersAreRoommates,
    validateNonEmptyList,
} = require("../../src/Utility/validator");

const express = require("express");
const request = require("supertest");
const UserPersistence = require("../../src/Persistence/UserPersistence");
const RoomPersistence = require("../../src/Persistence/RoomPersistence");

describe("Unit test for validateString", () => {
    it("should not throw an error with a valid string", async () => {
        const testString = "test@gmail.com";
        const testStringType = "email";
        expect(() => validateString(testString, testStringType)).not.toThrow();
    });

    it("should throw an error with an invalid string", async () => {
        const testString = "";
        const testStringType = "email";
        expect(() => validateString(testString, testStringType)).toThrow(`Invalid ${testStringType}`);
    });

    it("should throw an error with an invalid string", async () => {
        const testString = 5;
        const testStringType = "roommate";
        expect(() => validateString(testString, testStringType)).toThrow(`Invalid ${testStringType}`);
    });
});

describe("Unit test for Validating positive integer", () => {
    it("should not throw an error with a valid positive integer", async () => {
        let testInteger = 10;
        let testIntegerType = "amount";
        expect(() => validatePositiveInteger(testInteger, testIntegerType)).not.toThrow();
        testInteger = Number.MAX_SAFE_INTEGER;
        expect(() => validatePositiveInteger(testInteger, testIntegerType)).not.toThrow();
    });

    it("should throw an error with a non positive integer", async () => {
        let testInteger = -23;
        const testIntegerType = "interest";
        expect(() => validatePositiveInteger(testInteger, testIntegerType)).toThrow(
            `Invalid ${testIntegerType}- ${testIntegerType} must be a positive number`,
        );

        testInteger = Number.MIN_SAFE_INTEGER;
        expect(() => validatePositiveInteger(testInteger, testIntegerType)).toThrow(
            `Invalid ${testIntegerType}- ${testIntegerType} must be a positive number`,
        );

        testInteger = 0;
        expect(() => validatePositiveInteger(testInteger, testIntegerType)).toThrow(
            `Invalid ${testIntegerType}- ${testIntegerType} must be a positive number`,
        );

        testInteger = "10";
        expect(() => validatePositiveInteger(testInteger, testIntegerType)).toThrow(
            `Invalid ${testIntegerType}- ${testIntegerType} must be a positive number`,
        );
    });
});

describe("Unit test for validateDate", () => {
    it("should not throw an error with a valid date", async () => {
        const testDate = "2024-10-10";
        expect(() => validateDate(testDate)).not.toThrow();
    });

    it("should throw an error with an invalid date format", async () => {
        const testDate = "10-10-2020";
        expect(() => validateDate(testDate)).toThrow("Invalid Date");
    });

    it("should throw an error with an empty date", async () => {
        const testDate = "";
        expect(() => validateDate(testDate)).toThrow("Invalid Date");
    });

    it("should throw an error with a date in future", async () => {
        const testDate = "2025-01-14";
        expect(() => validateDate(testDate)).toThrow("Invalid Date");
    });
});

describe("Unit test for validating nonempty list", () => {
    it("should not throw an error with a valid input list", async () => {
        const testList = ["apple", "banana", "grape"];
        const testType = "fruit";
        expect(() => validateNonEmptyList(testList, testType)).not.toThrow();
    });

    it("should throw an error with an input length < 0", () => {
        const testList = [];
        const type = "type";
        expect(() => validateNonEmptyList(testList, type)).toThrow(`Invalid ${type}- ${type} must be a non empty list`);
    });

    it("should throw an error with non array list", () => {
        const testList = new Set(["apple", "banana", "grape"]);
        const type = "type";
        expect(() => validateNonEmptyList(testList, type)).toThrow(`Invalid ${type}- ${type} must be a non empty list`);
    });
});

describe("Unit test for validating user exist", () => {
    it("should not throw an error with an existing user", async () => {
        let userId = "test@gmail.com";
        const user_persistence = {
            get_user: jest.fn().mockResolvedValue(userId),
        };

        await expect(validateUserExist(user_persistence, userId)).resolves.not.toThrow();
    });

    it("should throw an error with an non existing user", async () => {
        let userId = "test@gmail.com";
        const user_persistence = {
            get_user: jest.fn().mockResolvedValue(null),
        };

        await expect(validateUserExist(user_persistence, userId)).rejects.toThrow("User does not exist");
    });
});

describe("Unit test for validating Users are roommates", () => {
    it("should not throw an error with users are roommates", async () => {
        let test_roommates_list = ["test1", "test2", "test3"];
        let user = "test1";
        const room_id = "hello baby";
        const room_persistence = {
            get_room_users: jest.fn().mockResolvedValue(test_roommates_list),
        };

        await expect(validateUsersAreRoommates(room_persistence, user, room_id)).resolves.not.toThrow();
    });

    it("should throw an error if users are not roommates", async () => {
        let test_roommates_list = ["test1", "test2", "test3"];
        let user = "testok";
        const room_id = "hello baby";
        const room_persistence = {
            get_room_users: jest.fn().mockResolvedValue(test_roommates_list),
        };

        await expect(validateUsersAreRoommates(room_persistence, user, room_id)).rejects.toThrow(
            "Users are not roommates",
        );
    });
});
