import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styles from '../styles/ManageTasksPage.module.css';
import Header from '../Header';
import { useLocation, useNavigate } from 'react-router-dom';

const ManageTasksPage = () => {
    const [roomMembers, setRoomMembers] = useState([]);
    const [pendingTasks, setPendingTasks] = useState([]);
    const [completedTasks, setCompletedTasks] = useState([]);
    const [newTask, setNewTask] = useState({ task: '', assignee: '', dueDate: '' });
    const [editingTask, setEditingTask] = useState(null);
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
                const pendingTasksResponse = await axios.get(`https://7hm4udd9s2.execute-api.ca-central-1.amazonaws.com/dev/room/get-pending-tasks`, {
                    params: { frm: email }
                });
                // const completedTasksResponse = await axios.get(`https://7hm4udd9s2.execute-api.ca-central-1.amazonaws.com/dev/room/get-completed-tasks`, {
                //     params: { frm: email }
                // });
                console.log(pendingTasksResponse.data.pending_tasks);
                setPendingTasks(pendingTasksResponse.data.pending_tasks || []);
                
                // setCompletedTasks(completedTasksResponse.data.complete_tasks || []);
            } catch (error) {
                console.error("Error fetching tasks:", error.message);
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
            await axios.delete('https://7hm4udd9s2.execute-api.ca-central-1.amazonaws.com/dev/task/delete-task', {
                data: { id: taskId, frm: email }
            });
            setCompletedTasks(completedTasks.filter(task => task.task_id !== taskId));
        } catch (error) {
            console.error("Error deleting task:", error);
        }
    };

    // Update an existing task
    const handleUpdateTask = async () => {
        if (editingTask) {
            try {
                await axios.post('https://7hm4udd9s2.execute-api.ca-central-1.amazonaws.com/dev/task/edit-task', {
                    id: editingTask.task_id,
                    tn: editingTask.task,
                    frm: email,
                    to: editingTask.assignee,
                    date: formatDateToBackend(editingTask.dueDate)
                });
                setCompletedTasks(completedTasks.map(task => task.task_id === editingTask.task_id ? editingTask : task));
                setEditingTask(null);
            } catch (error) {
                console.error("Error updating task:", error);
            }
        }
    };

    // Toggle task completion
    const toggleCompletion = async (taskId, completed) => {
        try {
            await axios.patch('https://7hm4udd9s2.execute-api.ca-central-1.amazonaws.com/dev/task/mark-completed', { id: taskId, frm: email });
            if (completed) {
                // Move from completed to pending
                setPendingTasks([...pendingTasks, { ...completedTasks.find(task => task.task_id === taskId), complete: false }]);
                setCompletedTasks(completedTasks.filter(task => task.task_id !== taskId));
            } else {
                // Move from pending to completed
                setCompletedTasks([...completedTasks, { ...pendingTasks.find(task => task.task_id === taskId), complete: true }]);
                setPendingTasks(pendingTasks.filter(task => task.task_id !== taskId));
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
                    type="date"
                    value={newTask.dueDate}
                    onChange={(e) => setNewTask({ ...newTask, dueDate: e.target.value })}
                />
                <button onClick={handleAddTask}>Add Task</button>
            </div>

            {/* Task Lists */}
            <div className={styles.taskList}>
                <h3>Pending Tasks</h3>
                <ul>
                    {pendingTasks.map((task) => (
                        <li key={task.task_id}>
                            <div>
                                <span>{task.task_description}</span> - <span>Assigned to: {task.asignee}</span> -{' '}
                                <span>Due: {new Date(task.due_date).toLocaleDateString()}</span>
                                <input
                                    type="checkbox"
                                    checked={task.complete}
                                    onChange={() => toggleCompletion(task.task_id, task.complete)}
                                />
                            </div>
                        </li>
                    ))}
                </ul>
            </div>

            <div className={styles.taskList}>
                <h3>Completed Tasks</h3>
                <ul>
                    {completedTasks.map((task) => (
                        <li key={task.task_id}>
                            <span>{task.task_description}</span> - <span>Assigned to: {task.asignee}</span> -{' '}
                            <span>Due: {new Date(task.due_date).toLocaleString()}</span>
                            <input
                                type="checkbox"
                                checked={task.complete}
                                onChange={() => toggleCompletion(task.task_id, task.complete)}
                            />
                            <button onClick={() => setEditingTask(task)}>Edit</button>
                            <button onClick={() => handleDeleteTask(task.task_id)}>Delete</button>
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
