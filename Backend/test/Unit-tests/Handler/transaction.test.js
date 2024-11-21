const TransactionHandler = require("../../../src/Handler/TransactionHandler");
const transactionRoutes = require("../../../src/router/Transaction");
const { mockRequest, mockResponse } = require("mock-req-res");

const express = require("express");
const request = require("supertest");
const { validateString, validateUserExist } = require("../../../src/Utility/validator");
const { get_user_persistence, get_room_persistence, get_notification_persistence } = require("../../../src/Utility/Services");

jest.mock("../../../src/Utility/validator", () => ({
    validateString: jest.fn(),
    validateUserExist: jest.fn(),
}));

jest.mock("../../../src/Utility/Services", () => ({
    get_transaction_persistence: () => ({
        generate_new_transaction: jest.fn(),
        getBalanceRecord: jest.fn(),
        updateBalance: jest.fn(),
        get_amounts_by_role: jest.fn(),
        get_relationships_by_role: jest.fn(),
        get_transaction_details: jest.fn(),
    }),

    get_user_persistence: () => ({
        get_user: jest.fn(),
        get_room_id: jest.fn(),
    }),

    get_room_persistence: () => ({
        get_room_users: jest.fn(),
    }),

    get_notification_persistence: () => ({
        get_msg_type: jest.fn(),
        update_notification_status: jest.fn(),
        delete_notification: jest.fn(),
    }),
}));

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

        const mockDebts = [10, 20, 30];
        const mockCredits = [50, 60];
        const mockDebtRelationships = ["You own ladykiller CAD 20", "You own babygirl CAD 40"];
        const mockCreditRelationships = ["LadyGaga own you CAD 50", "Superman own you CAD 60"];

        // Mock persistence methods
        transactionHandler.get_transaction_persistence().get_amounts_by_role = jest
            .fn()
            .mockImplementationOnce(() => mockDebts) // Debts
            .mockImplementationOnce(() => mockCredits); // Credits

        transactionHandler.get_transaction_persistence().get_relationships_by_role = jest
            .fn()
            .mockImplementationOnce(() => mockDebtRelationships) // Debtor relationships
            .mockImplementationOnce(() => mockCreditRelationships); // Creditor relationships

        // Mock sum_array method
        transactionHandler.sum_array = jest.fn((array) => array.reduce((a, b) => a + b, 0));

        await transactionHandler.get_summary(req, res);
        
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({ 
            owed: 60,
            owns: 110,
            relationships: [
                "You own ladykiller CAD 20", 
                "You own babygirl CAD 40", 
                "LadyGaga own you CAD 50", 
                "Superman own you CAD 60", 
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
        const details = [
            {
                transaction_amount: 12,
                transaction_name: 'ok',
                creator: 'lucifer',
                paid_by_creator: 6,
                transaction_date: '2024-11-20',
                owed_to_creator: 6,
                type: 'expense',
            },
            {
                transaction_date: '2024-11-18',
                transaction_amount: 12,
                transaction_name: 'lucifer paid lukaku CAD 12.00',
                creator: 'lucifer',
                type: 'settle-up',
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

        await transactionHandler.get_transaction(req, res);

        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({
            All_Transactions: [
                {
                    transaction_amount: 12,
                    transaction_name: 'ok',
                    creator: 'lucifer',
                    paid_by_creator: 6,
                    transaction_date: '2024-11-20',
                    owed_to_creator: 6,
                    type: 'expense',
                    summary: "You paid CAD 6.00 and lent CAD 6.00",
                },
                {
                    transaction_date: '2024-11-18',
                    transaction_amount: 12,
                    transaction_name: 'lucifer paid lukaku CAD 12.00',
                    creator: 'lucifer',
                    type: 'settle-up',
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
                transaction_name: 'ok',
                creator: 'lucifer',
                paid_by_creator: 6,
                transaction_date: '2024-11-20',
                owed_to_creator: 6,
                type: 'expense',
            },
            {
                transaction_date: '2024-11-18',
                transaction_amount: 12,
                transaction_name: 'lucifer paid lukaku CAD 12.00',
                creator: 'lucifer',
                type: 'settle-up',
            },
        ];
        req.query.id = user_id;

        validateString.mockResolvedValue();
        validateUserExist.mockResolvedValue();

        transactionHandler.get_user_persistence().get_room_id.mockImplementation((user_id) => {
            return room_id;
        });

        transactionHandler.get_transaction_persistence().get_transaction_details.mockRejectedValue(new Error("Server error"));

        await transactionHandler.get_transaction(req, res);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({ message: "Server error" });
    });
});