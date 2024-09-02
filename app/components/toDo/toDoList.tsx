"use client"

import { useState } from "react";

interface Task {
    id: number;
    text: string;
    completed: boolean;
}

const ToDoList = () => {
    const [tasks, setTasks] = useState<Task[]>([]);
    const [taskText, setTaskText] = useState('')

    const addTask = () => {
        if(taskText.trim() === '') return;
        const newTask = {
            id: Date.now(),
            text: taskText,
            completed: false,
        }
        setTasks([...tasks, newTask])
        setTaskText('')
    }
    const toggleTaskCompletion = (id: number) => {
        setTasks(tasks.map(task =>
            task.id === id ? { ...task, completed: !task.completed } : task
        ))
    }

    const deleteTask = (id: number) => {
        setTasks(tasks.filter(task => task.id !== id))
    }

    return(
        <div className="p-4">
            <input
                type="text"
                value={taskText}
                onChange={(e) => setTaskText(e.target.value)}
                placeholder="Add a new task!"
                className="w-1/2 p-2 border border-gray-300 rounded text-pink-500"
            />
            <button onClick={addTask} className="ml-2 p-2 bg-blue-500 text-white rounded">
                Add Task
            </button>
            <ul className="mt-4">
                {tasks.map(task => (
                    <li key={task.id} className="flex items-center justify-between p-2">
                        <span onClick={() => toggleTaskCompletion(task.id)}
                              className={`cursor-pointer ${task.completed ? 'line-through' : ''}`}>
                            {task.text}
                        </span>
                        <button
                            onClick={() => deleteTask(task.id)}
                            className="text-rose-600 ml-2">
                            <i className="fas fa-trash text-2xl"></i>
                        </button>
                    </li>
                ))}
            </ul>
        </div>
    )
}

export default ToDoList