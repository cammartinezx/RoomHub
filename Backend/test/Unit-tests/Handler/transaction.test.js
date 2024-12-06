const TransactionHandler = require("../../../src/Handler/TransactionHandler");
const { mockRequest, mockResponse } = require("mock-req-res");
const {
    validateString,
    validateUserExist,
    validatePositiveInteger,
    validateUsersAreRoommates,
    validateOutstandingBalance,
} = require("../../../src/Utility/validator");

jest.mock("../../../src/Utility/validator", () => ({
    validateString: jest.fn(),
    validateUserExist: jest.fn(),
}));

jest.mock("../../../src/Utility/Services", () => ({
    get_user_persistence: () => ({
        get_user: jest.fn(),
        get_room_id: jest.fn(),
    }),

    get_transaction_persistence: () => ({
        generate_new_transaction: jest.fn(),
        getBalanceRecord: jest.fn(),
        updateBalance: jest.fn(),
        get_amounts_by_role: jest.fn(),
        get_relationships_by_role: jest.fn(),
        get_transaction_details: jest.fn(),
    }),

    get_room_persistence: () => ({
        get_room_users: jest.fn(),
    }),

    get_notification_persistence: () => ({}),
}));

jest.mock("../../../src/Utility/validator", () => ({
    validateString: jest.fn(),
    validatePositiveInteger: jest.fn(),
    validateDate: jest.fn(),
    validateUserExist: jest.fn(),
    validateContributorsAreRoommates: jest.fn(),
    validateOutstandingBalance: jest.fn(),
    validateUsersAreRoommates: jest.fn(),
    validateNonEmptyList: jest.fn(),
}));
describe("Unit test for create_expense function", () => {
    let transactionHandler;
    let req, res;

    beforeEach(() => {
        jest.resetAllMocks();
        transactionHandler = new TransactionHandler();
        req = mockRequest();
        res = mockResponse();
        // expense body-- validators mocked such that they always pass.
        req.body = { name: "test", price: "test", payer: "test", contributors: "test", date: "test" };

        res.status = jest.fn().mockReturnValue(res); // Allows chaining like res.status(200).json()
        res.json = jest.fn();
        jest.clearAllMocks();
    });

    it("Send a success response verifying that the new expense was correctly created", async () => {
        // all validators by default don't do any internal logic here.
        // all persistence functions by default don't do any internal logic and just return once they;re called

        await transactionHandler.create_expense(req, res);

        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({ message: "Expense created successfully" });
    });

    it("Send a response signifying that there's an error from the request body-- Sync Validator Fail", async () => {
        // all other validators by default don't do any internal logic here.
        // all persistence functions by default don't do any internal logic and just return once they;re called

        // mock Validate string to throw error
        validateString.mockImplementation(() => {
            throw new Error("Invalid Transaction Name");
        });

        await transactionHandler.create_expense(req, res);

        expect(res.status).toHaveBeenCalledWith(422);
        expect(res.json).toHaveBeenCalledWith({ message: "Invalid Transaction Name" });
    });

    it("Send a response signifying that there's an error validating request body parameters-- Async Validator Fail", async () => {
        // all other validators by default don't do any internal logic here.
        // all persistence functions by default don't do any internal logic and just return once they;re called
        // mock Validate user exist function to throw error
        validateUserExist.mockImplementation(() => {
            throw new Error("User does not exist");
        });

        await transactionHandler.create_expense(req, res);
        console.log(res.json);
        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({ message: "User does not exist" });
    });

    it("Send a response signifying that there's a db error", async () => {
        // all other validators by default don't do any internal logic here.
        // all persistence functions by default don't do any internal logic and just return once they;re called

        // mock Validate user exist function to throw error
        transactionHandler.get_transaction_persistence().generate_new_transaction.mockImplementation(() => {
            throw new Error("You don't have access to this service.");
        });

        await transactionHandler.create_expense(req, res);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({ message: "You don't have access to this service." });
    });
});

describe("Unit test for Settle_debt function", () => {
    let transactionHandler;
    let req, res;

    beforeEach(() => {
        jest.resetAllMocks();
        transactionHandler = new TransactionHandler();
        req = mockRequest();
        // req built to pass all tests
        req.body = { debtor: "test", creditor: "test", amount: 100, date: "test" };
        res = mockResponse();

        res.status = jest.fn().mockReturnValue(res); // Allows chaining like res.status(200).json()
        res.json = jest.fn();
        jest.clearAllMocks();
    });

    it("Send a success response verifying that transaction was correctly created and balance with roommates updated", async () => {
        // all validators by default don't do any internal logic here.
        // all persistence functions by default don't do any internal logic and just return once they;re called
        const user_id = "lucifer";
        const user = {
            id: user_id,
            name: "luba lubu",
        };

        transactionHandler.get_user_persistence().get_user.mockImplementation((user_id) => {
            return user;
        });
        // expense body-- validators mocked such that they always pass.

        await transactionHandler.settle_debt(req, res);

        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({ message: "Transaction created successfully" });
    });

    it("Send a response signifying that there's an error from the request body-- Sync Validator Fail", async () => {
        // all other validators by default don't do any internal logic here.
        // all persistence functions by default don't do any internal logic and just return once they;re called

        // mock Validate string to throw error
        validatePositiveInteger.mockImplementation(() => {
            throw new Error("Invalid Settle Up amount");
        });

        // expense body-- validators mocked such that they always pass.

        await transactionHandler.settle_debt(req, res);

        expect(res.status).toHaveBeenCalledWith(422);
        expect(res.json).toHaveBeenCalledWith({ message: "Invalid Settle Up amount" });
    });

    it("Send a response signifying that there's an error validating request body parameters-- Async Validator Fail(409 Error)", async () => {
        // all other validators by default don't do any internal logic here.
        // all persistence functions by default don't do any internal logic and just return once they;re called
        // mock Validate user exist function to throw error
        validateOutstandingBalance.mockImplementation(() => {
            throw new Error("No outstanding balance to be settled");
        });

        // expense body-- validators mocked such that they always pass.

        await transactionHandler.settle_debt(req, res);
        console.log(res.json);
        expect(res.status).toHaveBeenCalledWith(409);
        expect(res.json).toHaveBeenCalledWith({ message: "No outstanding balance to be settled" });
    });

    it("Send a response signifying that there's an error validating request body parameters-- Async Validator Fail(404 Error)", async () => {
        // all other validators by default don't do any internal logic here.
        // all persistence functions by default don't do any internal logic and just return once they;re called
        // mock Validate user exist function to throw error
        validateUsersAreRoommates.mockImplementation(() => {
            throw new Error("Users are not roommates");
        });

        // expense body-- validators mocked such that they always pass.

        await transactionHandler.settle_debt(req, res);
        console.log(res.json);
        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({ message: "Users are not roommates" });
    });

    it("Send a response signifying that there's a db error", async () => {
        // all other validators by default don't do any internal logic here.
        // all persistence functions by default don't do any internal logic and just return once they;re called
        const user_id = "lucifer";
        const user = {
            id: user_id,
            name: "luba lubu",
        };

        transactionHandler.get_user_persistence().get_user.mockImplementation((user_id) => {
            return user;
        });
        // mock Validate user exist function to throw error
        transactionHandler.get_transaction_persistence().generate_new_transaction.mockImplementation(() => {
            throw new Error("You don't have access to this service.");
        });

        await transactionHandler.settle_debt(req, res);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({ message: "You don't have access to this service." });
    });
});
const transactionRoutes = require("../../../src/router/Transaction");

const express = require("express");
const request = require("supertest");

describe("testing getting the user summary and relationship", () => {
    let transactionHandler;
    let req, res;

    beforeEach(() => {
        transactionHandler = new TransactionHandler();
        req = mockRequest();
        res = mockResponse();

        res.status = jest.fn().mockReturnValue(res);
        res.json = jest.fn();
        jest.clearAllMocks();
    });

    it("Getting the user summary and relationships successfully", async () => {
        const user_id = "lucifer";
        req.query.id = user_id;

        validateString.mockResolvedValue();
        validateUserExist.mockResolvedValue();

        const mockDebts = { Items: [{ creditor: "ladykiller", amount: 20 }, { creditor: "babygirl", amount: 40 }] };
        const mockCredits = { Items: [{ debtor: "LadyGaga", amount: 50 }, { debtor: "Superman", amount: 60 }] };

        // Mock persistence methods to return arrays of amounts
        transactionHandler.get_transaction_persistence().get_amounts_by_role = jest
            .fn()
            .mockImplementationOnce(() => mockDebts.Items.map((item) => item.amount)) // Extract amounts for debts
            .mockImplementationOnce(() => mockCredits.Items.map((item) => item.amount)); // Extract amounts for credits

        const mockDebtRelationships = { Items: [{ creditor: "ladykiller", amount: 20 }, { creditor: "babygirl", amount: 40 }] };
        const mockCreditRelationships = { Items: [{ debtor: "LadyGaga", amount: 50 }, { debtor: "Superman", amount: 60 }] };

        transactionHandler.get_transaction_persistence().get_relationships_by_role = jest
            .fn()
            .mockImplementationOnce(() => mockDebtRelationships) // Debtor relationships
            .mockImplementationOnce(() => mockCreditRelationships); // Creditor relationships

        transactionHandler.get_user_persistence().get_user = jest.fn(async (userId) => {
            const users = {
                ladykiller: { name: "Ladykiller" },
                babygirl: { name: "Babygirl" },
                LadyGaga: { name: "LadyGaga" },
                Superman: { name: "Superman" },
            };
            return users[userId];
        });

        await transactionHandler.get_summary(req, res);

        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({
            owed: 60,
            owns: 110,
            relationships: [
                "You owe Ladykiller $20",
                "You owe Babygirl $40",
                "LadyGaga owes you $50",
                "Superman owes you $60",
            ],
        });
    });


    it("should send an error with invalid user ID", async () => {
        const user_id = "";
        req.query.id = user_id;

        validateString.mockImplementation(() => {
            throw new Error("Invalid user ID");
        });

        await transactionHandler.get_summary(req, res);

        expect(res.status).toHaveBeenCalledWith(422);
        expect(res.json).toHaveBeenCalledWith({ message: "Invalid user ID" });
    });

    it("should send an error with user not exist", async () => {
        const user_id = "lady killer";
        req.query.id = user_id;

        validateString.mockResolvedValue();
        validateUserExist.mockImplementation(() => {
            throw new Error("User does not exist");
        });

        await transactionHandler.get_summary(req, res);

        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({ message: "User does not exist" });
    });

    it("should send the server error from back end", async () => {
        const user_id = "baby girl";
        req.query.id = user_id;

        validateString.mockResolvedValue();
        validateUserExist.mockResolvedValue();

        // Mock persistence methods to throw an error
        transactionHandler.get_transaction_persistence().get_amounts_by_role = jest
            .fn()
            .mockRejectedValue(new Error("Server error"));

        transactionHandler.sum_array = jest.fn((array) => array.reduce((a, b) => a + b, 0));

        await transactionHandler.get_summary(req, res);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({ message: "Server error" });
    });
});

describe("testing getting the user transactions", () => {
    let transactionHandler;
    let req, res;

    beforeEach(() => {
        transactionHandler = new TransactionHandler();
        req = mockRequest();
        res = mockResponse();

        res.status = jest.fn().mockReturnValue(res);
        res.json = jest.fn();
        jest.clearAllMocks();
    });

    it("Getting the user transactions successfully", async () => {
        const user_id = "lucifer";
        const room_id = "okela";
        const user = {
            id: user_id,
            name: "luba lubu",
        };
        const details = [
            {
                transaction_amount: 12,
                transaction_name: "ok",
                creator: "lucifer",
                paid_by_creator: 6,
                transaction_date: "2024-11-20",
                owed_to_creator: 6,
                type: "expense",
            },
            {
                transaction_amount: 10,
                transaction_name: "chimto",
                creator: "luba lubu",
                paid_by_creator: 5,
                transaction_date: "2024-11-15",
                owed_to_creator: 5,
                type: "expense",
            },
            {
                transaction_date: "2024-11-18",
                transaction_amount: 12,
                transaction_name: "lucifer paid lukaku CAD 12.00",
                creator: "lucifer",
                type: "settle-up",
            },
        ];
        req.query.id = user_id;

        validateString.mockResolvedValue();
        validateUserExist.mockResolvedValue();

        transactionHandler.get_user_persistence().get_room_id.mockImplementation((user_id) => {
            return room_id;
        });

        transactionHandler.get_transaction_persistence().get_transaction_details.mockImplementation((room_id) => {
            return details;
        });

        transactionHandler.get_user_persistence().get_user.mockImplementation((user_id) => {
            return user;
        });

        await transactionHandler.get_transaction(req, res);

        // expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({
            All_Transactions: [
                {
                    transaction_amount: 12,
                    transaction_name: "ok",
                    creator: "lucifer",
                    paid_by_creator: 6,
                    transaction_date: "2024-11-20",
                    owed_to_creator: 6,
                    type: "expense",
                    summary: "You paid CAD 6.00 and lent CAD 6.00",
                },
                {
                    transaction_amount: 10,
                    transaction_name: "chimto",
                    creator: "luba lubu",
                    paid_by_creator: 5,
                    transaction_date: "2024-11-15",
                    owed_to_creator: 5,
                    type: "expense",
                    summary: "luba lubu paid CAD 5.00 and lent CAD 5.00",
                },
                {
                    transaction_date: "2024-11-18",
                    transaction_amount: 12,
                    transaction_name: "lucifer paid lukaku CAD 12.00",
                    creator: "lucifer",
                    type: "settle-up",
                },
            ],
        });
    });

    it("should send an error with invalid user ID", async () => {
        const user_id = "";
        req.query.id = user_id;

        validateString.mockImplementation(() => {
            throw new Error("Invalid user ID");
        });

        await transactionHandler.get_transaction(req, res);

        expect(res.status).toHaveBeenCalledWith(422);
        expect(res.json).toHaveBeenCalledWith({ message: "Invalid user ID" });
    });

    it("should send an error with user not exist", async () => {
        const user_id = "lady killer";
        req.query.id = user_id;

        validateString.mockResolvedValue();
        validateUserExist.mockImplementation(() => {
            throw new Error("User does not exist");
        });

        await transactionHandler.get_transaction(req, res);

        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({ message: "User does not exist" });
    });

    it("should send the server error from back end", async () => {
        const user_id = "lucifer";
        const room_id = "okela";
        const details = [
            {
                transaction_amount: 12,
                transaction_name: "ok",
                creator: "lucifer",
                paid_by_creator: 6,
                transaction_date: "2024-11-20",
                owed_to_creator: 6,
                type: "expense",
            },
            {
                transaction_date: "2024-11-18",
                transaction_amount: 12,
                transaction_name: "lucifer paid lukaku CAD 12.00",
                creator: "lucifer",
                type: "settle-up",
            },
        ];
        req.query.id = user_id;

        validateString.mockResolvedValue();
        validateUserExist.mockResolvedValue();

        transactionHandler.get_user_persistence().get_room_id.mockImplementation((user_id) => {
            return room_id;
        });

        transactionHandler
            .get_transaction_persistence()
            .get_transaction_details.mockRejectedValue(new Error("Server error"));

        await transactionHandler.get_transaction(req, res);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({ message: "Server error" });
    });
});
