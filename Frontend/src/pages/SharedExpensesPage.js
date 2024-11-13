import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styles from '../styles/SharedExpensesPage.module.css';
import Header from '../Header';
import { useLocation, useNavigate } from 'react-router-dom';
import { sendNotification } from '../services/notificationService';

const SharedExpensesPage = () => {
    const [summary, setSummary] = useState({ owed: 15, owns: 20 });
    const [transactions, setTransactions] = useState([]);
    const [newExpense, setNewExpense] = useState({ name: '', price: '', contributors: [], date: '' });
    const [roomMembers, setRoomMembers] = useState([]);
    const [newSettle, setNewSettle] = useState({ creditor: '', amount: '', date: '' });

    const navigate = useNavigate();
    const location = useLocation();
    const email = location.state?.email;
    const hasRoom = location.state?.hasRoom;

    // Fetch roommates on component load
    useEffect(() => {
        const fetchRoommates = async () => {
            try {
                const response = await axios.get(`https://7hm4udd9s2.execute-api.ca-central-1.amazonaws.com/dev/user/${email}/get-user-roommates`);
                if (response.status === 200 && response.data.roommates) {
                    const filteredRoommates = response.data.roommates.filter((roommate) => roommate !== email);
                    setRoomMembers(filteredRoommates);
                }
            } catch (error) {
                console.error("Error fetching roommates:", error.message);
            }
        };
        fetchRoommates();
    }, [email]);

    // Fetch summary on component load
    useEffect(() => {
        const fetchSummary = async () => {
            try {
                // Fetch summary
                const summaryResponse = await axios.get(
                    'http://localhost:3001/transaction/get-summary',
                    {
                        params: { id: email },
                    }
                );
                setSummary(summaryResponse.data.summary);
            } catch (error) {
                if (error.response) {
                    switch (error.response.status) {
                        case 422:
                            console.error('Error: Invalid user.');
                            break;
                        case 404:
                            console.error('Error: No user found.');
                            break;
                        case 500:
                            console.error('Error: Backend error while fetching summary.');
                            break;
                        default:
                            console.error('An unexpected error occurred while fetching summary.');
                    }
                } else if (error.request) {
                    console.error('Error: No response from the server while fetching summary.');
                } else {
                    console.error('Error: Failed to fetch summary.');
                }
            }
        };
        fetchSummary();
    }, [email]);

    // Fetch transactions on component load
    useEffect(() => {
        const fetchTransactions = async () => {
            try {
                // Fetch transaction
                const transactionsResponse = await axios.get(
                    'http://localhost:3001/transaction/get-transaction',
                    {
                        params: { id: email },
                    }
                );
                setTransactions(transactionsResponse.data.transactions);
            } catch (error) {
                if (error.response) {
                    switch (error.response.status) {
                        case 422:
                            console.error('Error: Invalid user.');
                            break;
                        case 404:
                            console.error('Error: No user found.');
                            break;
                        case 500:
                            console.error('Error: Backend error while fetching transactions.');
                            break;
                        default:
                            console.error('An unexpected error occurred while fetching transactions.');
                    }
                } else if (error.request) {
                    console.error('Error: No response from the server while fetching transactions.');
                } else {
                    console.error('Error: Failed to fetch transactions.');
                }
            }
        };
        fetchTransactions();
    }, [email]);

    const handleRoommateSelection = (roommateEmail) => {
        setNewExpense((prevExpense) => {
            console.log("Previous Expense:", prevExpense);
            return {
                ...prevExpense,
                contributors: prevExpense.contributors.includes(roommateEmail)
                    ? prevExpense.contributors.filter((email) => email !== roommateEmail)
                    : [...prevExpense.contributors, roommateEmail],
            };
        });
    };
    const handleCreateExpense = async () => {
        const { name, price, contributors, date } = newExpense;
        if (!name) {
            alert('Please enter an expense name.');
            return;
        } else if (!price) {
            alert('Please enter a valid amount.');
            return;
        } else if (contributors.length === 0) {
            alert('Please select roommates you want to split with.');
            return;
        } else if (date.length === 0) {
            alert('Please enter a valid date.');
            return;
        } else {
            try {
                const formattedDate = formatDateToBackend(newExpense.date);
                const response = await axios.post('http://localhost:3001/transaction/create-expense', {
                    name: newExpense.name,
                    price: parseFloat(newExpense.price),
                    payer: email,
                    contributors: newExpense.contributors,
                    date: formattedDate,
                });
                if(response.status === 200) {
                    alert('Expense created successfully!');
                    sendNotification(email, `A new expense ${newExpense.name} has been created and split to ${newExpense.contributors}.`);
                    window.location.reload();
                }
                setNewExpense({ name: '', price: '', contributors: [], date: '' });
            } catch (error) {
                alert('Error creating expense.');
                console.error("Error creating expense:", error);
            }
        }
    };

    const handleSettleUp = async () => {
        const { creditor, amount , date } = newSettle;
        if (!creditor) {
            alert('Please select a roommate.');
            return;
        } else if (!amount) {
            alert('Please enter a valid amount.');
            return;
        } else if (date.length === 0) {
            alert('Please enter a valid date.');
            return;
        } else {
            try {
                const formattedDate = formatDateToBackend(newSettle.date);
                const response = await axios.post('http://localhost:3001/transaction/create-expense', {
                    debtor: email,
                    creditor: newSettle.creditor,
                    amount: parseFloat(newSettle.amount),
                    date: formattedDate,
                });
                if (response.status === 200) {
                    alert('Settlement completed!');
                    sendNotification(email, `${email} settle a payment of CAD ${newSettle.amount} to ${newSettle.creditor}`);
                    window.location.reload();
                }
                setNewSettle({ creditor: '', amount: '', date: '' });
            } catch (error) {
                alert('Error settling up.');
                console.error("Error settling up:", error);
            }
        }
    };

    function formatDateToBackend(dateString) {
        return dateString.split('T')[0];
    }

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
                        onChange={(e) => setNewExpense({ ...newExpense, name: e.target.value })}
                    />
                    <input
                        type="number"
                        placeholder="Amount"
                        value={newExpense.price}
                        onChange={(e) => setNewExpense({ ...newExpense, price: e.target.value })}
                    />
                    <input
                        type="date"
                        value={newExpense.date}
                        onChange={(e) => setNewExpense({ ...newExpense, date: e.target.value })}
                    />
                    <div className={styles.checkboxGroup}>
                        <p>Select roommates to split with:</p>
                        {roomMembers.map((roommate, index) => (
                            <div key={index} className={styles.checkbox}>
                                <input
                                    type="checkbox"
                                    id={roommate}
                                    checked={newExpense.contributors.includes(roommate)}
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
                        value={newSettle.creditor}
                        onChange={(e) => setNewSettle({ ...newSettle, creditor: e.target.value })}
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
                    <input
                        type="date"
                        value={newSettle.date}
                        onChange={(e) => setNewSettle({ ...newSettle, date: e.target.value })}
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
