const {
    validateString,
    validatePositiveInteger,
    validateContributorsAreRoommates,
    validateOutstandingBalance,
} = require("../../src/Utility/validator");

const express = require("express");
const request = require("supertest");
const RoomPersistence = require("../../src/Persistence/RoomPersistence");

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
