// /pages/index.js -> this is home page 
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';

export default function Home() {

  const router = useRouter()
    const [tasks, setTasks] = useState([]);
    const [taskText, setTaskText] = useState("");

    useEffect(() => {
        fetchTasks();
    }, []);

    const fetchTasks = async () => {
        const res = await fetch('/api/tasks?status=active');
        const data = await res.json();
        setTasks(data.tasks);
    };

    const addTask = async () => {
        if (!taskText) return;

        const taskData = {
            text: taskText,
            dateCreated: new Date().toISOString(),
        };

        const res = await fetch('/api/tasks', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(taskData),
        });
        
        if (res.ok) {
            fetchTasks();
            setTaskText('');
        }
    };

    const deleteTask = async (id) => {
        const res = await fetch(`/api/tasks?id=${id}`, { method: 'DELETE' });
        if (res.ok) fetchTasks();
    };

    const markTaskComplete = async (id) => {
        const res = await fetch(`/api/tasks?id=${id}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ status: 'completed' }),
        });
        if (res.ok) fetchTasks();
    };

    return (
        <div>
            <h1>Task Manager</h1>
            <input 
                type="text" 
                value={taskText} 
                onChange={(e) => setTaskText(e.target.value)} 
                placeholder="Enter a task" 
            />
            <button onClick={addTask}>Add Task</button>
            <ul>
                {tasks.map(task => (
                    <li key={task._id}>
                        {task.text} - <small>{new Date(task.dateCreated).toLocaleDateString()}</small>
                        <button onClick={() => markTaskComplete(task._id)}>Complete</button>
                        <button onClick={() => deleteTask(task._id)}>Delete</button>
                    </li>
                ))}
            </ul>
            <button onClick={()=>{router.push("/completedtaskspage")}}>Check The Completed Tasks</button>
        </div>
    );
}