"use client"

import React, { useState } from "react";

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
                className="w-1/2 p-2 border border-gray-300 rounded text-slate-900"
            />
            <button onClick={addTask} className="ml-2 p-2 bg-blue-500 text-white rounded">
                Add Task
            </button>
            <ul className="mt-4">
                {tasks.map(task => (
                    <li key={task.id} className="flex flex-col items-start p-2 border-b border-slate-400">
                        <span className="text-xs text-slate-400 mb-1">{new Date(task.id).toLocaleDateString()}</span>
                        <span onClick={() => toggleTaskCompletion(task.id)}
                              className={`text-slate-300 cursor-pointer ${task.completed ? 'line-through decoration-red-400' : ''}`}>
                            {task.text}
                        </span>
                        <button
                            onClick={() => deleteTask(task.id)}
                            className="text-slate-400 ml-auto">
                            <i className="fas fa-trash fa-fade text-2xl"
                               style={{ '--fa-animation-duration': '2s' } as React.CSSProperties}></i>
                        </button>
                    </li>
                ))}
            </ul>
        </div>
    )
}

export default ToDoList