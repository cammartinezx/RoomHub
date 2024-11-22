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
const RoomPersistence = require("../../src/Persistence/RoomPersistence");
const UserPersistence = require("../../src/Persistence/UserPersistence");

describe("Unit test for validateString", () => {
    it("should not throw an error with a valid string", () => {
        const testString = "test@gmail.com";
        const testStringType = "email";
        expect(() => validateString(testString, testStringType)).not.toThrow();
    });

    it("should throw an error with an invalid string", () => {
        const testString = "";
        const testStringType = "email";
        expect(() => validateString(testString, testStringType)).toThrow(`Invalid ${testStringType}`);
    });

    it("should throw an error with an invalid string", () => {
        const testString = 5;
        const testStringType = "roommate";
        expect(() => validateString(testString, testStringType)).toThrow(`Invalid ${testStringType}`);
    });
});

describe("Unit test for Validating positive integer", () => {
    it("should not throw an error with a valid positive integer", () => {
        let testInteger = 10;
        let testIntegerType = "amount";
        expect(() => validatePositiveInteger(testInteger, testIntegerType)).not.toThrow();

        testInteger = Number.MAX_SAFE_INTEGER;
        expect(() => validatePositiveInteger(testInteger, testIntegerType)).not.toThrow();
    });

    it("should throw an error with a non positive integer", () => {
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

describe("Unit test for Validating Contributors Are Roommates", () => {
    it("should not throw an error with valid roommates list matched with contributors list", async () => {
        let test_roommates_List = ["user1", "user2", "user3"];
        let test_contributors_List = ["user1", "user2"];
        const test_payer = "user3";
        const test_room_id = "test_room";
        const room_persistence = {
            get_room_users: jest.fn().mockResolvedValue(test_roommates_List),
        };
        // room_persistence.get_room_users.mockImplementation(() => {return test_contributors_List})

        await expect(
            validateContributorsAreRoommates(room_persistence, test_contributors_List, test_payer, test_room_id),
        ).resolves.not.toThrow();

        test_contributors_List = [];
        await expect(
            validateContributorsAreRoommates(room_persistence, test_contributors_List, test_payer, test_room_id),
        ).resolves.not.toThrow();
    });

    it("should throw an error with valid roommates list does not match with contributors list", async () => {
        let test_roommates_List = [];
        let test_contributors_List = ["user1", "user2"];
        const test_payer = "user3";
        const test_room_id = "test_room";
        const room_persistence = {
            get_room_users: jest.fn().mockResolvedValue(test_roommates_List),
        };
        // room_persistence.get_room_users.mockImplementation(() => {return test_contributors_List})

        await expect(
            validateContributorsAreRoommates(room_persistence, test_contributors_List, test_payer, test_room_id),
        ).rejects.toThrow("One or more contributors do not belong to this room: user1, user2, user3");
    });
});

describe("Unit test for Validating Outstanding balance", () => {
    it("should not throw an error with valid outstanding balance", async () => {
        let creditor = "user1@users.test";
        let debtor = "user2@users.test";
        let settle_up_amount = 100;
        const owed_amount = 200;
        const transaction_persistence = {
            getBalanceRecord: jest.fn().mockResolvedValue({ amount: owed_amount }),
        };

        await expect(
            validateOutstandingBalance(transaction_persistence, creditor, debtor, settle_up_amount),
        ).resolves.not.toThrow();

        settle_up_amount = 200;
        await expect(
            validateOutstandingBalance(transaction_persistence, creditor, debtor, settle_up_amount),
        ).resolves.not.toThrow();
    });

    it("should throw an error with settle up amount less than owed amount ", async () => {
        let creditor = "user1@users.test";
        let debtor = "user2@users.test";
        let settle_up_amount = 200;
        let owed_amount = 100;
        let transaction_persistence = {
            getBalanceRecord: jest.fn().mockResolvedValue({ amount: owed_amount }),
        };

        await expect(
            validateOutstandingBalance(transaction_persistence, creditor, debtor, settle_up_amount),
        ).rejects.toThrow("Settle up amount must be less than or equal to outstanding balance");

        owed_amount = 0;
        transaction_persistence = {
            getBalanceRecord: jest.fn().mockResolvedValue({ amount: owed_amount }),
        };
        await expect(
            validateOutstandingBalance(transaction_persistence, creditor, debtor, settle_up_amount),
        ).rejects.toThrow("Settle up amount must be less than or equal to outstanding balance");
    });

    it("should throw an error when there's no balance record between the creditor and the debtor ", async () => {
        let creditor = "user1@users.test";
        let debtor = "user2@users.test";
        let settle_up_amount = 200;
        let owed_amount = 100;
        let transaction_persistence = {
            getBalanceRecord: jest.fn().mockResolvedValue(null),
        };

        await expect(
            validateOutstandingBalance(transaction_persistence, creditor, debtor, settle_up_amount),
        ).rejects.toThrow("No outstanding balance to be settled");
    });
});

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

    it("should throw an error with invalid date number", async () => {
        const testDate = "2024-20-20";
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
