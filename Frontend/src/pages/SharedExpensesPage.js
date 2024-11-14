import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styles from '../styles/SharedExpensesPage.module.css';
import Header from '../Header';
import { useLocation, useNavigate } from 'react-router-dom';
import { sendNotification } from '../services/notificationService';

const SharedExpensesPage = () => {
    const [summary, setSummary] = useState({ owed: 0, owns: 0, relationships: [] });
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
                    'https://7hm4udd9s2.execute-api.ca-central-1.amazonaws.com/dev/transaction/get-summary',
                    {
                        params: { id: email },
                    }
                );
                // Update state with the response data
                setSummary(summaryResponse.data);
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

    useEffect(() => {
        const fetchTransactions = async () => {
            try {
                // Fetch transactions
                const transactionsResponse = await axios.get(
                    'https://7hm4udd9s2.execute-api.ca-central-1.amazonaws.com/dev/transaction/get-transaction',
                    {
                        params: { id: email },
                    }
                );
                // Set the transactions state with the response data
                setTransactions(transactionsResponse.data.All_Transactions || []);
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
        } else if (!price || isNaN(price) || parseFloat(price) <= 0) {
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
                const formattedDate = formatDateToBackend(date);
                const response = await axios.post(
                    'https://7hm4udd9s2.execute-api.ca-central-1.amazonaws.com/dev/transaction/create-expense',
                    {
                        name: name.trim(),
                        price: parseFloat(price),
                        payer: email,
                        contributors: contributors,
                        date: formattedDate,
                    }
                );
    
                if (response.status === 200) {
                    alert('Expense created successfully!');
                    sendNotification(
                        email,
                        `A new expense "${name}" has been created and split with: ${contributors.join(', ')}.`
                    );
                    window.location.reload(); // Reload page to reflect changes
                    setNewExpense({ name: '', price: '', contributors: [], date: '' });
                } else {
                    alert('Failed to create expense. Please try again.');
                }
            } catch (error) {
                console.error('Error creating expense:', error);
                alert('Error creating expense. Please check the details and try again.');
            }
        }
    };

    const handleSettleUp = async () => {
        const { creditor, amount , date } = newSettle;
        if (!creditor) {
            alert('Please select a roommate.');
            return;
        } else if (!amount || isNaN(amount) || parseFloat(amount) <= 0) {
            alert('Please enter a valid amount.');
            return;
        } else if (date.length === 0) {
            alert('Please enter a valid date.');
            return;
        } else {
            try {
                const formattedDate = formatDateToBackend(date);
                const response = await axios.post(
                    'https://7hm4udd9s2.execute-api.ca-central-1.amazonaws.com/dev/transaction/settle-up',
                    {
                        debtor: email,
                        creditor: creditor,
                        amount: parseFloat(amount),
                        date: formattedDate,
                    }
                );
    
                if (response.status === 200) {
                    alert('Settlement completed!');
                    sendNotification(
                        email,
                        `${email} settled a payment of CAD ${amount} to ${creditor}.`
                    );
                    window.location.reload(); // Reload the page to reflect changes
                    setNewSettle({ creditor: '', amount: '', date: '' }); // Reset the form
                } else {
                    alert('Failed to complete settlement. Please try again.');
                }
            } catch (error) {
                console.error('Error settling up:', error);
                alert('Error settling up. Please check the details and try again.');
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
                        value={newExpense.name}
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
                    <p>You Owe: <strong>${summary?.owed || 0}</strong></p>
                    <p>You Are Owed: <strong>${summary?.owns || 0}</strong></p>
                    <div className={styles.relationships}>
                        <h4>Relationships:</h4>
                        <ul>
                            {summary?.relationships?.map((relationship, index) => (
                                <li key={index}>{relationship}</li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>

            <div className={styles.transaction}>
                <h3>Transaction History</h3>
                <ul>
                    {transactions.map((transaction, index) => (
                        <li key={index}>
                            <div className={styles.taskDetails}>
                                <span className={styles.taskName}>{transaction.transaction_name}</span>
                                <span className={styles.taskSummary}>{transaction.summary}</span>
                                <span className={styles.taskDate}>on {transaction.transaction_date}</span>
                            </div>
                            <div className={styles.taskAmount}>
                                ${transaction.transaction_amount}
                            </div>
                        </li>
                    )) || 'No transaction available'}
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
