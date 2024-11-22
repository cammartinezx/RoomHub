const request = require("supertest");
const app = require("../../../src/router/index");
const transactionRouter = require("../../../src/router/Transaction");
const express = require("express");

jest.mock("../../../src/Handler/TransactionHandler", () => {
    return jest.fn().mockImplementation(() => ({
        // function mocks
        create_expense: jest.fn().mockImplementation((req, res) => {
            res.status(200).json({ message: "Expense created successfully" });
        }),

        settle_debt: jest.fn().mockImplementation((req, res) => {
            res.status(200).json({ message: "Transaction created successfully" });
        }),

        get_summary: jest.fn().mockImplementation((req, res) => {
            res.status(200).json({
                owed: 50,
                owns: 50,
                relationships: [
                    "You owe Camila CAD 30",
                    "You owe William CAD 20",
                    "Daniel owes you CAD 10",
                    "Victor owes you CAD 40",
                ],
            });
        }),

        get_transaction: jest.fn().mockImplementation((req, res) => {
            res.status(200).json({
                All_Transactions: [
                    {
                        transaction_amount: 180,
                        transaction_name: "grocery",
                        creator: "Camila",
                        paid_by_creator: 60,
                        transaction_date: "2024-11-15",
                        owed_to_creator: 120,
                        type: "expense",
                        summary: "Camila paid CAD 60 and lent CAD 120",
                    },
                    {
                        transaction_date: "2024-11-15",
                        transaction_amount: 30,
                        transaction_name: "Luke paid Camila CAD 30",
                        creator: "Luke",
                        type: "settle-up",
                    },
                    {
                        transaction_amount: 80,
                        transaction_name: "wifi",
                        creator: "William",
                        paid_by_creator: 40,
                        transaction_date: "2024-10-15",
                        owed_to_creator: 40,
                        type: "expense",
                        summary: "William paid CAD 40 and lent CAD 40",
                    },
                    {
                        transaction_date: "2024-10-16",
                        transaction_amount: 20,
                        transaction_name: "Luke paid William CAD 20",
                        creator: "Luke",
                        type: "settle-up",
                    },
                    {
                        transaction_amount: 20,
                        transaction_name: "toilet paper",
                        creator: "Luke",
                        paid_by_creator: 10,
                        transaction_date: "2024-09-10",
                        owed_to_creator: 10,
                        type: "expense",
                        summary: "Luke paid CAD 10 and lent CAD 10",
                    },
                    {
                        transaction_amount: 80,
                        transaction_name: "gas",
                        creator: "Luke",
                        paid_by_creator: 40,
                        transaction_date: "2024-01-15",
                        owed_to_creator: 40,
                        type: "expense",
                        summary: "Luke paid CAD 40 and lent CAD 40",
                    },
                ],
            });
        }),
    }));
});

describe("Transaction router tests", () => {
    beforeEach(() => {
        jest.clearAllMocks();
        app.use(express.json());
        app.use("/transaction", transactionRouter);
    });

    it("POST /create-expense should create a new transaction", async () => {
        const requestBody = {
            name: "Fruit",
            price: 20,
            payer: "Luke",
            contributors: ["Camila", "Daniel"],
            date: "2024-10-12",
        };
        const response = await request(app).post("/transaction/create-expense").send(requestBody);

        expect(response.status).toBe(200);
        expect(response.body.message).toBe("Expense created successfully");
    });

    it("POST /settle-up should create a new transaction and update the new balance", async () => {
        const requestBody = {
            debtor: "Luke",
            creditor: "William",
            amount: 20,
            date: "2024-10-16",
        };
        const response = await request(app).post("/transaction/settle-up").send(requestBody);

        expect(response.status).toBe(200);
        expect(response.body.message).toBe("Transaction created successfully");
    });

    it("GET transaction/get-summary should return an user balance summary", async () => {
        const query_params = { id: "Luke" };
        const expectedResponse = {
            owed: 50,
            owns: 50,
            relationships: [
                "You owe Camila CAD 30",
                "You owe William CAD 20",
                "Daniel owes you CAD 10",
                "Victor owes you CAD 40",
            ],
        };
        const response = await request(app).get("/transaction/get-summary").query(query_params);
        expect(response.status).toBe(200);
        expect(response.body).toEqual(expectedResponse);
    });

    it("GET transaction/get-transaction should return a list of transactions", async () => {
        const query_params = { id: "Luke" };
        const expectedResponse = {
            All_Transactions: [
                {
                    transaction_amount: 180,
                    transaction_name: "grocery",
                    creator: "Camila",
                    paid_by_creator: 60,
                    transaction_date: "2024-11-15",
                    owed_to_creator: 120,
                    type: "expense",
                    summary: "Camila paid CAD 60 and lent CAD 120",
                },
                {
                    transaction_date: "2024-11-15",
                    transaction_amount: 30,
                    transaction_name: "Luke paid Camila CAD 30",
                    creator: "Luke",
                    type: "settle-up",
                },
                {
                    transaction_amount: 80,
                    transaction_name: "wifi",
                    creator: "William",
                    paid_by_creator: 40,
                    transaction_date: "2024-10-15",
                    owed_to_creator: 40,
                    type: "expense",
                    summary: "William paid CAD 40 and lent CAD 40",
                },
                {
                    transaction_date: "2024-10-16",
                    transaction_amount: 20,
                    transaction_name: "Luke paid William CAD 20",
                    creator: "Luke",
                    type: "settle-up",
                },
                {
                    transaction_amount: 20,
                    transaction_name: "toilet paper",
                    creator: "Luke",
                    paid_by_creator: 10,
                    transaction_date: "2024-09-10",
                    owed_to_creator: 10,
                    type: "expense",
                    summary: "Luke paid CAD 10 and lent CAD 10",
                },
                {
                    transaction_amount: 80,
                    transaction_name: "gas",
                    creator: "Luke",
                    paid_by_creator: 40,
                    transaction_date: "2024-01-15",
                    owed_to_creator: 40,
                    type: "expense",
                    summary: "Luke paid CAD 40 and lent CAD 40",
                },
            ],
        };
        const response = await request(app).get("/transaction/get-transaction").query(query_params);
        expect(response.status).toBe(200);
        expect(response.body).toEqual(expectedResponse);
    });
});