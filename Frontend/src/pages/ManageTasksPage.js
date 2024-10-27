import React, { useState } from 'react';
import styles from '../styles/ManageTasksPage.module.css'; // Assuming you'll add relevant CSS styling
import Header from '../Header';
import { useLocation, useNavigate } from 'react-router-dom';

const ManageTasksPage = () => {
    const [tasks, setTasks] = useState([]);
    const [newTask, setNewTask] = useState({ task: '', assignee: '', dueDate: '', completed: false });
    const [editIndex, setEditIndex] = useState(null);
    const [editingTask, setEditingTask] = useState(null);
    const navigate = useNavigate();
    const location = useLocation();
    const email = location.state?.email;  // The current user's email
    const hasRoom = location.state?.hasRoom;

    // Mock list of room members
    const roomMembers = ['John Doe', 'Jane Smith', 'Bob Johnson'];

    // Function to add a new task
    const handleAddTask = () => {
        if (newTask.task && newTask.assignee && newTask.dueDate) {
            setTasks([...tasks, { ...newTask, id: tasks.length + 1 }]);
            setNewTask({ task: '', assignee: '', dueDate: '', completed: false });
        } else {
            alert('Please fill in all fields to create a task.');
        }
    };

    // Function to delete a task
    const handleDeleteTask = (index) => {
        setTasks(tasks.filter((_, i) => i !== index));
    };

    // Function to edit a task
    const handleEditTask = (index) => {
        setEditIndex(index);
        setEditingTask(tasks[index]);
    };

    // Function to update an edited task
    const handleUpdateTask = () => {
        const updatedTasks = [...tasks];
        updatedTasks[editIndex] = editingTask;
        setTasks(updatedTasks);
        setEditIndex(null);
        setEditingTask(null);
    };

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

            {/* Task List */}
            <div className={styles.taskList}>
                <h3>Current Tasks</h3>
                <ul>
                    {tasks.map((task, index) => (
                        <li key={index}>
                            {editIndex === index ? (
                                // Edit mode
                                <div>
                                    <input
                                        type="text"
                                        value={editingTask.task}
                                        onChange={(e) =>
                                            setEditingTask({ ...editingTask, task: e.target.value })
                                        }
                                    />
                                    <select
                                        value={editingTask.assignee}
                                        onChange={(e) =>
                                            setEditingTask({ ...editingTask, assignee: e.target.value })
                                        }
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
                                        onChange={(e) =>
                                            setEditingTask({ ...editingTask, dueDate: e.target.value })
                                        }
                                    />
                                    <button onClick={handleUpdateTask}>Update Task</button>
                                </div>
                            ) : (
                                // Normal view
                                <div>
                                    <span>{task.task}</span> - <span>Assigned to: {task.assignee}</span> -{' '}
                                    <span>Due: {new Date(task.dueDate).toLocaleString()}</span> -{' '}
                                    <span>{task.completed ? 'Completed' : 'Incomplete'}</span>
                                    <button onClick={() => handleEditTask(index)}>Edit</button>
                                    <button onClick={() => handleDeleteTask(index)}>Delete</button>
                                </div>
                            )}
                        </li>
                    ))}
                </ul>
            </div>

            <button className={styles.backButton} onClick={() => navigate('/virtual-room', { state: { email, hasRoom } })}>
                Back to Virtual Room
            </button>
        </div>
    );
};

export default ManageTasksPage;
