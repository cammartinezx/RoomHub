import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styles from '../styles/ManageTasksPage.module.css';
import Header from '../Header';
import { useLocation, useNavigate } from 'react-router-dom';

const ManageTasksPage = () => {
    const [pendingTasks, setPendingTasks] = useState([]);
    const [completedTasks, setCompletedTasks] = useState([]);
    const [newTask, setNewTask] = useState({ task: '', assignee: '', dueDate: '' });
    const [editingTask, setEditingTask] = useState(null);
    const navigate = useNavigate();
    const location = useLocation();
    const email = location.state?.email;
    const hasRoom = location.state?.hasRoom;

    const roomMembers = ['John Doe', 'Jane Smith', 'Bob Johnson']; // Replace with actual room members

    // Fetch pending and completed tasks on component load
    useEffect(() => {
        const fetchTasks = async () => {
            console.log('FETCHING TASKS...')
            try {
                const completedTasksResponse = await axios.get(`https://7hm4udd9s2.execute-api.ca-central-1.amazonaws.com/dev/room/get-completed-tasks`, {
                    params: { frm: email }
                });
                const pendingTasksResponse = await axios.get(`https://7hm4udd9s2.execute-api.ca-central-1.amazonaws.com/dev/room/get-pending-tasks`, {
                    params: { frm: email }
                });
                setCompletedTasks(completedTasksResponse.data.complete_tasks || []);
                setPendingTasks(pendingTasksResponse.data.pending_tasks || []);
            } catch (error) {
                console.error("Error fetching tasks:", error);
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
                    to: 'odumahw@myumanitoba.ca',
                    date: formattedDate,
                });
                if(response.status === 200){
                    alert(`Task assigned to ${newTask.assignee}`);
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
            await axios.delete('https://7hm4udd9s2.execute-api.ca-central-1.amazonaws.com/dev/task/delete-task', {
                data: { id: taskId, frm: email }
            });
            setPendingTasks(pendingTasks.filter(task => task.id !== taskId));
            setCompletedTasks(completedTasks.filter(task => task.id !== taskId));
        } catch (error) {
            console.error("Error deleting task:", error);
        }
    };

    // Update an existing task
    const handleUpdateTask = async () => {
        try {
            
            await axios.post('https://7hm4udd9s2.execute-api.ca-central-1.amazonaws.com/dev/task/edit-task', {
                id: editingTask.id,
                tn: editingTask.task,
                frm: email,
                to: editingTask.assignee,
                date: editingTask.dueDate
            });
            setPendingTasks(pendingTasks.map(task => task.id === editingTask.id ? editingTask : task));
            setEditingTask(null);
        } catch (error) {
            console.error("Error updating task:", error);
        }
    };

    // Toggle task completion
    const toggleCompletion = async (taskId, completed) => {
        try {
            await axios.patch('https://7hm4udd9s2.execute-api.ca-central-1.amazonaws.com/dev/task/mark-completed', { id: taskId, frm: email });
            if (completed) {
                // Move from completed to pending
                setPendingTasks([...pendingTasks, { ...completedTasks.find(task => task.id === taskId), completed: false }]);
                setCompletedTasks(completedTasks.filter(task => task.id !== taskId));
            } else {
                // Move from pending to completed
                setCompletedTasks([...completedTasks, { ...pendingTasks.find(task => task.id === taskId), completed: true }]);
                setPendingTasks(pendingTasks.filter(task => task.id !== taskId));
            }
        } catch (error) {
            console.error("Error marking task as completed:", error);
        }
    };

    function formatDateToBackend(dateString) {
        // Use the 'split' method to isolate the date portion before the 'T'
        return dateString.split('T')[0];
    }
    

    return (
        <div className={styles.container}>
            <Header email={email} hasRoom={hasRoom} />
            <h1>Manage Tasks</h1>

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
                    type="datetime-local"
                    value={newTask.dueDate}
                    onChange={(e) => setNewTask({ ...newTask, dueDate: e.target.value })}
                />
                <button onClick={handleAddTask}>Add Task</button>
            </div>

            {/* Pending Tasks List */}
            <div className={styles.taskList}>
                <h3>Pending Tasks</h3>
                <ul>
                    {pendingTasks.map((task) => (
                        <li key={task.id}>
                            {editingTask?.id === task.id ? (
                                // Edit mode
                                <div>
                                    <input
                                        type="text"
                                        value={editingTask.task}
                                        onChange={(e) => setEditingTask({ ...editingTask, task: e.target.value })}
                                    />
                                    <select
                                        value={editingTask.assignee}
                                        onChange={(e) => setEditingTask({ ...editingTask, assignee: e.target.value })}
                                    >
                                        <option value="">Assign to Roommate</option>
                                        {roomMembers.map((member, idx) => (
                                            <option key={idx} value={member}>
                                                {member}
                                            </option>
                                        ))}
                                    </select>
                                    <input
                                        type="datetime-local"
                                        value={editingTask.dueDate}
                                        onChange={(e) => setEditingTask({ ...editingTask, dueDate: e.target.value })}
                                    />
                                    <button onClick={handleUpdateTask}>Update Task</button>
                                </div>
                            ) : (
                                // Normal view
                                <div>
                                    <span>{task.task}</span> - <span>Assigned to: {task.assignee}</span> -{' '}
                                    <span>Due: {new Date(task.dueDate).toLocaleString()}</span>
                                    <input
                                        type="checkbox"
                                        checked={task.completed}
                                        onChange={() => toggleCompletion(task.id, task.completed)}
                                    />
                                    <button onClick={() => setEditingTask(task)}>Edit</button>
                                    <button onClick={() => handleDeleteTask(task.id)}>Delete</button>
                                </div>
                            )}
                        </li>
                    ))}
                </ul>
            </div>

            {/* Completed Tasks List */}
            <div className={styles.taskList}>
                <h3>Completed Tasks</h3>
                <ul>
                    {completedTasks.map((task) => (
                        <li key={task.id}>
                            <span>{task.task_description}</span> - <span>Assigned to: {task.assignee}</span> -{' '}
                            <span>Due: {new Date(task.due_date).toLocaleString()}</span>
                            <input
                                type="checkbox"
                                checked={task.complete}
                                onChange={() => toggleCompletion(task.id, task.complete)}
                            />
                            <button onClick={() => handleDeleteTask(task.id)}>Delete</button>
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

export default ManageTasksPage;
