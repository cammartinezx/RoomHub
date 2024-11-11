import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styles from '../styles/SharedExpensesPage.module.css';
import Header from '../Header';
import { useLocation, useNavigate } from 'react-router-dom';
import { sendNotification } from '../services/notificationService';

const SharedExpensesPage = () => {
    const [summary, setSummary] = useState({ owed: 0, owns: 0 });
    const [transactions, setTransactions] = useState([]);
    const [newExpense, setNewExpense] = useState({ expense: '', amount: '', split: [] });
    const [roomMembers, setRoomMembers] = useState([]);
    const [newSettle, setNewSettle] = useState({ assignee: '', amount: '' });

    const navigate = useNavigate();
    const location = useLocation();
    const email = location.state?.email;
    const hasRoom = location.state?.hasRoom;

    useEffect(() => {
        const fetchSummary = async () => {
            const data = { owed: 15, owns: 20 };
            setSummary(data);
        };

        const fetchTransactions = async () => {
            const data = [{ date: "11-03-2024", amount: 20, name: "toilet paper" }];
            setTransactions(data);
        };

        const fetchRoommates = async () => {
            try {
                const response = await axios.get(`https://7hm4udd9s2.execute-api.ca-central-1.amazonaws.com/dev/user/${email}/get-user-roommates`);
                if (response.status === 200 && response.data.roommates) {
                    setRoomMembers(response.data.roommates);
                }
            } catch (error) {
                console.error("Error fetching roommates:", error.message);
            }
        };

        fetchSummary();
        fetchTransactions();
        fetchRoommates();
    }, [email]);

    const handleRoommateSelection = (roommateEmail) => {
        setNewExpense((prevExpense) => ({
            ...prevExpense,
            split: prevExpense.split.includes(roommateEmail)
                ? prevExpense.split.filter((email) => email !== roommateEmail)
                : [...prevExpense.split, roommateEmail],
        }));
    };

    const handleCreateExpense = async () => {
        const { expense, amount, split } = newExpense;
        if (!expense || !amount || split.length === 0) {
            alert('Please provide all details and select roommates to split with.');
            return;
        }

        try {
            await axios.post('/create-expense', {
                email,
                expenseName: expense,
                amount: parseFloat(amount),
                splitWithRoommates: split,
            });
            alert('Expense created successfully!');
            sendNotification(email, `A new expense ${expense} has been created and split to ${split}.`);
            setNewExpense({ expense: '', amount: '', split: [] });
        } catch (error) {
            alert('Error creating expense.');
        }
    };

    const handleSettleUp = async () => {
        const { assignee, amount } = newSettle;
        if (!assignee || !amount) {
            alert('Please select a roommate and enter an amount.');
            return;
        }

        try {
            await axios.post('/settle-up', {
                email,
                roommateEmail: assignee,
                amount: parseFloat(amount),
            });
            alert('Settlement completed!');
            setNewSettle({ assignee: '', amount: '' });
        } catch (error) {
            alert('Error settling up.');
        }
    };

    return (
        <div className={styles.container}>
            <Header email={email} hasRoom={hasRoom} />
            <h1>Shared Expenses</h1>

            <div className={styles.flexContainer}>
                <div className={styles.card}>
                    <h3>Create New Expense</h3>
                    <input
                        type="text"
                        placeholder="Expense Name"
                        value={newExpense.expense}
                        onChange={(e) => setNewExpense({ ...newExpense, expense: e.target.value })}
                    />
                    <input
                        type="number"
                        placeholder="Amount"
                        value={newExpense.amount}
                        onChange={(e) => setNewExpense({ ...newExpense, amount: e.target.value })}
                    />
                    <div className={styles.checkboxGroup}>
                        <p>Select roommates to split with:</p>
                        {roomMembers.map((roommate, index) => (
                            <div key={index} className={styles.checkbox}>
                                <input
                                    type="checkbox"
                                    id={roommate}
                                    checked={newExpense.split.includes(roommate)}
                                    onChange={() => handleRoommateSelection(roommate)}
                                />
                                <label htmlFor={roommate}>{roommate}</label>
                            </div>
                        ))}
                    </div>
                    <button onClick={handleCreateExpense}>Create Expense</button>
                </div>

                <div className={styles.card}>
                    <h3>Settle Up</h3>
                    <select
                        value={newSettle.assignee}
                        onChange={(e) => setNewSettle({ ...newSettle, assignee: e.target.value })}
                    >
                        <option value="">Select Roommate</option>
                        {roomMembers.map((member, index) => (
                            <option key={index} value={member}>
                                {member}
                            </option>
                        ))}
                    </select>
                    <input
                        type="number"
                        placeholder="Amount"
                        value={newSettle.amount}
                        onChange={(e) => setNewSettle({ ...newSettle, amount: e.target.value })}
                    />
                    <button onClick={handleSettleUp}>Settle Up</button>
                </div>

                <div className={styles.card}>
                    <h3>Summary</h3>
                    <p><strong>You Owe:</strong> ${summary?.owed || 0}</p>
                    <p><strong>You Are Owed:</strong> ${summary?.owns || 0}</p>
                </div>
            </div>

            <div className={styles.transaction}>
                <h3>Transaction History</h3>
                <ul>
                    {transactions.map((transaction, index) => (
                        <li key={index}>
                            <div className={styles.taskDetails}>
                                <span className={styles.taskName}>{transaction.name}</span>
                                <span className={styles.taskDate}>on {transaction.date}</span>
                            </div>
                            <div className={styles.taskAmount}>${transaction.amount}</div>
                        </li>
                    ))}
                </ul>
            </div>

            <button
                className={styles.backButton}
                onClick={() => navigate('/virtual-room', { state: { email, hasRoom } })}
            >
                Back to Virtual Room
            </button>
        </div>
    );
};

export default SharedExpensesPage;
