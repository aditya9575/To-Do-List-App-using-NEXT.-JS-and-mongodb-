import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';

export default function CompletedTasks() {
    const router = useRouter();
    const [tasks, setTasks] = useState([]);

    useEffect(() => {
        fetchCompletedTasks();
    }, []);

    const fetchCompletedTasks = async () => {
        const res = await fetch('/api/tasks?status=completed');
        const data = await res.json();
        setTasks(data.tasks);
    };

    const markAsNotCompleted = async (id) => {
        const res = await fetch(`/api/tasks?id=${id}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ status: 'active' }),
        });
        if (res.ok) fetchCompletedTasks();
    };

    return (
        <div>
            <h1>Completed Tasks</h1>
            <ul>
                {tasks.map(task => (
                    <li key={task._id}>
                        {task.text} - <small>{new Date(task.dateCreated).toLocaleDateString()}</small>
                        <button onClick={() => markAsNotCompleted(task._id)}>Not Yet Completed</button>
                    </li>
                ))}
            </ul>
            <button onClick={()=>{router.push("/")}}>Check The Pending Tasks</button>
        </div>
    );
}
