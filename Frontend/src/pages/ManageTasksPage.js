import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styles from '../styles/ManageTasksPage.module.css';
import Header from '../Header';
import { useLocation, useNavigate } from 'react-router-dom';
import { sendNotification } from '../services/notificationService';


const ManageTasksPage = () => {
    const [roomMembers, setRoomMembers] = useState([]);
    const [pendingTasks, setPendingTasks] = useState([]);
    const [completedTasks, setCompletedTasks] = useState([]);
    const [newTask, setNewTask] = useState({ task: '', assignee: '', dueDate: '' });
    const [editingTask, setEditingTask] = useState(null);
    const [showEditPopup, setShowEditPopup] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();
    const email = location.state?.email;
    const hasRoom = location.state?.hasRoom;

     // Fetch roommates on component load
    useEffect(() => {
        console.log("FETCHING ROOMMATES....")
        const fetchRoommates = async () => {
            try {
                const response = await axios.get(`https://7hm4udd9s2.execute-api.ca-central-1.amazonaws.com/dev/user/${email}/get-user-roommates`);
                console.log(response.data.users)
                if (response.status === 200 && response.data.all_roommates) {
                    console.log(response.data)
                    setRoomMembers(response.data.roommates); // Set roommates in the state
                }
            } catch (error) {
                console.error("Error fetching roommates:", error.message);
            }
        };
        fetchRoommates();
    }, [email]);

    // Fetch pending and completed tasks on component load
    useEffect(() => {
        const fetchTasks = async () => {
            try {
                // Fetch pending tasks
                const pendingTasksResponse = await axios.get(
                    'https://7hm4udd9s2.execute-api.ca-central-1.amazonaws.com/dev/room/get-pending-tasks',
                    {
                        params: { frm: email },
                    }
                );
                console.log(pendingTasksResponse.data.pending_tasks);
                setPendingTasks(pendingTasksResponse.data.pending_tasks || []);
            } catch (error) {
                if (error.response) {
                    switch (error.response.status) {
                        case 403:
                            console.error('Error: Invalid User.');
                            break;
                        case 404:
                            console.error('Error: No pending tasks found.');
                            break;
                        case 500:
                            console.error('Error: Backend error while fetching pending tasks.');
                            break;
                        default:
                            console.error('An unexpected error occurred while fetching pending tasks.');
                    }
                } else if (error.request) {
                    console.error('Error: No response from the server while fetching pending tasks.');
                } else {
                    console.error('Error: Failed to fetch pending tasks.');
                }
            }
    
            try {
                // Fetch completed tasks
                const completedTasksResponse = await axios.get(
                    'https://7hm4udd9s2.execute-api.ca-central-1.amazonaws.com/dev/room/get-completed-tasks',
                    {
                        params: { frm: email },
                    }
                );
    
                if (completedTasksResponse.status === 200) {
                    console.log(completedTasksResponse.data.completed_tasks);
                    setCompletedTasks(completedTasksResponse.data.completed_tasks || []);
                } else if (completedTasksResponse.status === 403) {
                    console.error('Error: Invalid User while fetching completed tasks.');
                } else if (completedTasksResponse.status === 404) {
                    console.error('Error: No completed tasks found.');
                }
            } catch (error) {
                if (error.response) {
                    switch (error.response.status) {
                        case 403:
                            console.error('Error: Invalid User.');
                            break;
                        case 404:
                            console.error('Error: No completed tasks found.');
                            break;
                        case 500:
                            console.error('Error: Backend error while fetching completed tasks.');
                            break;
                        default:
                            console.error('An unexpected error occurred while fetching completed tasks.');
                    }
                } else if (error.request) {
                    console.error('Error: No response from the server while fetching completed tasks.');
                } else {
                    console.error('Error: Failed to fetch completed tasks.');
                }
            }
        };
    
        fetchTasks();
    }, [email]);
    

      // Create a new task
      const handleAddTask = async () => {
        if (newTask.task && newTask.assignee && newTask.dueDate) {
            console.log(`Task is ${newTask.task}`)
            console.log(`Assigned to ${newTask.assignee}`)
            console.log(`DUE ON ${newTask.dueDate}`)
            try {
                const formattedDate = formatDateToBackend(newTask.dueDate); 
                const response = await axios.post('https://7hm4udd9s2.execute-api.ca-central-1.amazonaws.com/dev/task/create-task', {
                    tn: newTask.task,
                    frm: email,
                    to: newTask.assignee,
                    date: formattedDate,
                });
                if(response.status === 200){
                    alert(`Task assigned to ${newTask.assignee}`);
                    sendNotification(email, `A new task "${newTask.task}" has been created and assigned to ${newTask.assignee}.`);
                    window.location.reload();
                }
                setNewTask({ task: '', assignee: '', dueDate: '' });
            } catch (error) {
                console.error("Error creating task:", error);
            }
        } else {
            alert('Please fill in all fields to create a task.');
        }
    };

    // Delete a task
    const handleDeleteTask = async (taskId) => {
        try {
            const response = await fetch(`https://7hm4udd9s2.execute-api.ca-central-1.amazonaws.com/dev/task/delete-task`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ id: taskId, frm: email }),
            });
            if (response.ok) {
                alert('Task deleted successfully!');
                window.location.reload();
            } else {
                console.error('Failed to delete task:', response.status);
            }
        } catch (error) {
            console.error('Error deleting task:', error);
        }
    };

    
    

    const openEditPopup = (task) => {
        setEditingTask(task);
        setShowEditPopup(true);
    };

    const handleEditTaskSubmit = async () => {
        if (editingTask) {
            try {
                await axios.post('https://7hm4udd9s2.execute-api.ca-central-1.amazonaws.com/dev/task/edit-task', {
                    id: editingTask.task_id,
                    tn: editingTask.task_description,
                    frm: email,
                    to: editingTask.asignee,
                    date: editingTask.due_date
                });
                alert('Task updated successfully!');
                setShowEditPopup(false);
                sendNotification(email, `A new task "${editingTask.task}" has been created and assigned to ${editingTask.assignee}.`);
                window.location.reload();
            } catch (error) {
                console.error('Error updating task:', error.message);
            }
        }
    };

    // Toggle task completion
    const toggleCompletion = async (taskId, completed, task) => {
        try {
            await axios.patch('https://7hm4udd9s2.execute-api.ca-central-1.amazonaws.com/dev/task/mark-completed', { id: taskId, frm: email });
            if (completed) {
                // Move from completed to pending
                sendNotification(email, `The task "${task.task_description}" has been marked as completed by ${email}.`);
            }
        } catch (error) {
            console.error("Error marking task as completed:", error);
        }
    };

    function formatDateToBackend(dateString) {
        return dateString.split('T')[0];
    }

    return (
        <div className={styles.container}>
            <Header email={email} hasRoom={hasRoom}  />
            <h1>Manage Tasks</h1>

            <div className={styles.flexContainer}>
                {/* Task Creation Form */}
                <div className={styles.taskForm}>
                    <h3>Create New Task</h3>
                    <input
                        type="text"
                        placeholder="Task Name"
                        value={newTask.task}
                        onChange={(e) => setNewTask({ ...newTask, task: e.target.value })}
                    />
                    <select
                        value={newTask.assignee}
                        onChange={(e) => setNewTask({ ...newTask, assignee: e.target.value })}
                    >
                        <option value="">Assign to Roommate</option>
                        {roomMembers.map((member, index) => (
                            <option key={index} value={member}>
                                {member}
                            </option>
                        ))}
                    </select>
                    <input
                        type="date"
                        value={newTask.dueDate}
                        onChange={(e) => setNewTask({ ...newTask, dueDate: e.target.value })}
                    />
                    <button onClick={() => handleAddTask()}>Add Task</button>
                </div>

               {/* Pending Tasks List */}
                <div className={styles.taskList}>
                    <h3>Pending Tasks</h3>
                    {pendingTasks.length > 0 ? (
                        <ul>
                            {pendingTasks.map((task) => (
                                <li key={task.task_id} className={styles.taskItem}>
                                    <div className={styles.taskDetails}>
                                        <span className={styles.taskName}>{task.task_description}</span>
                                        <span className={styles.taskAssignee}>Assigned to: {task.asignee}</span>
                                        <span className={styles.taskDate}>Due: {new Date(task.due_date).toLocaleDateString()}</span>
                                    </div>
                                    <div className={styles.taskActions}>
                                        <input
                                            type="checkbox"
                                            onChange={() => toggleCompletion(task.task_id, task.complete, task)}
                                            className={styles.checkbox}
                                        />
                                    </div>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p>No pending tasks. Good job!</p>
                    )}
                </div>
            </div>

            {/* Completed Tasks List */}
            <div className={styles.completedTasks}>
                <h3>Completed Tasks</h3>
                {completedTasks.length > 0 ? (
                    <ul>
                        {completedTasks.map((task) => (
                            <li key={task.task_id} className={styles.taskItem}>
                                <div className={styles.taskDetails}>
                                    <span className={styles.taskName}>{task.task_description}</span>
                                </div>
                                <div className={styles.taskActions}>
                                    <button onClick={() => openEditPopup(task)} className={styles.iconButton}>♻️ Reuse</button>
                                    <button onClick={() => handleDeleteTask(task.task_id)} className={styles.iconButton}>🗑️</button>
                                </div>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p>No completed tasks. Go get some work done!</p>
                )}
            </div>

            {/* Edit Task Popup */}
            {showEditPopup && (
                <div className={styles.popup}>
                    <h3>Edit Task</h3>
                    <input
                        type="text"
                        value={editingTask.task_description}
                        onChange={(e) => setEditingTask({ ...editingTask, task_description: e.target.value })}
                    />
                    <select
                        value={editingTask.assignee}
                        onChange={(e) => setEditingTask({ ...editingTask, assignee: e.target.value })}
                    >
                        <option value="">Assign to Roommate</option>
                        {roomMembers.map((member, index) => (
                            <option key={index} value={member}>
                                {member}
                            </option>
                        ))}
                    </select>
                    <input
                        type="date"
                        value={editingTask.due_date}
                        onChange={(e) => setEditingTask({ ...editingTask, due_date: e.target.value })}
                    />
                    <button onClick={handleEditTaskSubmit}>Save Changes</button>
                    <button className={styles.cancelButton} onClick={() => setShowEditPopup(false)}>Cancel</button>
                </div>
            )}

            <button className={styles.backButton} onClick={() => navigate('/virtual-room', { state: { email, hasRoom } })}>
                Back to Virtual Room
            </button>
        </div>
    );
};  

export default ManageTasksPage;
