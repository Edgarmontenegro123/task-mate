"use client"

import React, {useEffect, useState} from "react";

interface Task {
    id: number;
    text: string;
    completed: boolean;
}

const ToDoList = () => {
    const [tasks, setTasks] = useState<Task[]>([]);
    const [taskText, setTaskText] = useState('')
    const [editingTaskId, setEditingTaskId] = useState<number | null>(null)
    const [editingTaskText, setEditingTaskText] = useState("")

    useEffect(() => {
        const storedTasks = localStorage.getItem("tasks")
        if(storedTasks) {
            setTasks(JSON.parse(storedTasks))
        }
    }, [])

    const saveTaskToLocalStorage = (tasks: Task[]) => {
        localStorage.setItem('tasks', JSON.stringify(tasks))
    }

    const addTask = () => {
        if(taskText.trim() === '') return;
        const newTask = {
            id: Date.now(),
            text: taskText,
            completed: false,
        }
        const updatedTasks = [...tasks, newTask]
        setTasks(updatedTasks)
        saveTaskToLocalStorage(updatedTasks)
        setTaskText('')
    }

    const startEditingTask = (id: number, text: string) => {
        setEditingTaskId(id)
        setEditingTaskText(text)
    }

    const saveEditedTask = (taskId: number) => {
        if(editingTaskText.trim() === "") {
            return
        }
        const updatedTasks = tasks.map(task =>
            task.id === taskId ? {...task, text: editingTaskText} : task
        )
        setTasks(updatedTasks)
        saveTaskToLocalStorage(updatedTasks)
        setEditingTaskId(null)
    }
    const toggleTaskCompletion = (id: number) => {
        setTasks(tasks.map(task =>
            task.id === id ? { ...task, completed: !task.completed } : task
        ))
    }

    const deleteTask = (id: number) => {
        setTasks(tasks.filter(task => task.id !== id))
    }

    const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        setEditingTaskText(e.target.value)
    }

    const handleKeyDown = (e: React.KeyboardEvent<HTMLSpanElement>, taskId: number) => {
        if(e.key === "Enter") {
            e.preventDefault()
            saveEditedTask(taskId)
        }
    }

    const handleBlur = () => {
        if(editingTaskId !== null) {
            saveEditedTask(editingTaskId)
        }
    }

    return(
        <div className="p-4">
            <input
                type="text"
                value={taskText}
                onChange={(e) => setTaskText(e.target.value)}
                placeholder="Add a new task!"
                onKeyDown={e => {
                    if(e.key === "Enter") {
                        addTask()
                    }
                }}
                className="w-1/2 p-2 border border-gray-300 rounded text-slate-900"
            />
            <button onClick={addTask} className="ml-2 p-2 bg-blue-500 text-white rounded">
                Add Task
            </button>
            <ul className="mt-4">
                {tasks.map(task => (
                    <li key={task.id} className="flex flex-col items-start p-2 border-b border-slate-400">
                        <span className="text-xs text-slate-400 mb-1">{new Date(task.id).toLocaleDateString()}</span>
                        {editingTaskId === task.id ? (
                            <input
                                type="text"
                                value={editingTaskText}
                                onChange={handleInput}
                                onBlur={handleBlur}
                                onKeyDown={ (e) => handleKeyDown(e, task.id)}
                                className="text-slate-900 w-1/2 p-1 border-b border-gray-400 focus:outline-none"
                            />
                        ) : (
                            <span onClick={() => toggleTaskCompletion(task.id)}
                                  className={`text-slate-300 cursor-pointer ${task.completed ? 'line-through decoration-red-400' : ''}`}>
                                {task.text}
                            </span>
                            )}
                        <div className="flex ml-auto">
                            <button
                                onClick={() => startEditingTask(task.id, task.text)}
                                className="text-slate-400 ml-auto mr-4">
                                <i className="fas fa-edit fa-fade text-2xl"
                                   style={{ '--fa-animation-duration': '2s' } as React.CSSProperties}></i>
                            </button>
                            <button
                                onClick={() => deleteTask(task.id)}
                                className="text-slate-400 ml-auto mr-4">
                                <i className="fas fa-trash fa-fade text-2xl"
                                   style={{ '--fa-animation-duration': '2s' } as React.CSSProperties}></i>
                            </button>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    )
}

export default ToDoList