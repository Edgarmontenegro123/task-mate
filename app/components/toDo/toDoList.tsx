"use client"

import React, {useEffect, useState} from "react";
import Swal from 'sweetalert2';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import {colors} from "@/public/constants/constants"

interface Task {
    id: number;
    text: string;
    completed: boolean;
    color: string;
}


const ToDoList = () => {
    const [tasks, setTasks] = useState<Task[]>([]);
    const [taskText, setTaskText] = useState('')
    const [editingTaskId, setEditingTaskId] = useState<number | null>(null)
    const [editingTaskText, setEditingTaskText] = useState("")
    const [selectedColor, setSelectedColor] = useState<string>(colors[0])

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
            color: selectedColor,
        }
        const updatedTasks = [...tasks, newTask]
        setTasks(updatedTasks)
        saveTaskToLocalStorage(updatedTasks)
        setTaskText('')
        setSelectedColor(colors[0])
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
        const updatedTasks = tasks.map(task =>
            task.id === id ? { ...task, completed: !task.completed } : task
        )
        setTasks(updatedTasks)
        saveTaskToLocalStorage(updatedTasks)
    }

    const deleteTask = (id: number) => {
        Swal.fire({
            title: "¿Estás seguro de querer eliminar esta nota?",
            text: "¡Esta acción no podrá revertirse!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Sí, eliminar",
            cancelButtonText: "Cancelar",
            width: "80%"
        }).then((result) => {
            if(result.isConfirmed) {
                const updatedTasks = tasks.filter(task => task.id !== id)
                localStorage.setItem("tasks", JSON.stringify(updatedTasks))
                setTasks(updatedTasks)

                Swal.fire(
                    "Eliminado",
                    "La nota ha sido eliminada!",
                    "success"
                )
            }
        })
    }

    const handleOnDragEnd = (result: any) => {
        if(!result.destination) return
        if(result.destination.droppableId !== "droppable-tasks") {
            console.error("Destino no válido: ", result.destination.droppableId)
            return
        }

        const newTasks = Array.from(tasks)
        const [reorderedTask] = newTasks.splice(result.source.index, 1)
        newTasks.splice(result.destination.index, 0, reorderedTask)
        setTasks(newTasks)
        saveTaskToLocalStorage(newTasks)
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
        <div className="p-4 mt-4 mb-16">
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
                className="w-1/2 p-2 border border-gray-300 rounded text-slate-900 mb-4"
            />
            <div className="mt-2">
                {colors.map(color => (
                    <button key={color}
                            onClick={() => setSelectedColor(color)}
                            style={{backgroundColor: color, width: 24, height: 24, margin: 6, borderRadius: "10%"}}
                            className={`border ${selectedColor === color? 'border-black' : 'border-transparent'}`}
                    />
                ))}
            </div>
            <button onClick={addTask} className="ml-2 my-4 p-2 bg-blue-500 text-white rounded">
                Add Task
            </button>
            <DragDropContext onDragEnd={handleOnDragEnd}>
                <Droppable droppableId="droppable-tasks">
                    {(provided) => (
                        <ul {...provided.droppableProps} ref={provided.innerRef} className="mt-4 mb-16">
                            {tasks.map((task, index) => (
                                <Draggable key={task.id} draggableId={task.id.toString()} index={index}>
                                    {(provided) => (
                                        <li ref={provided.innerRef}
                                            {...provided.draggableProps}
                                            {...provided.dragHandleProps}
                                            key={task.id}
                                            style={{ ...provided.draggableProps.style, color: task.color}}
                                            className="flex flex-col items-start p-2 border-b border-slate-400">
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
                                                      className={`task-text text-slate-300 cursor-pointer ${task.completed ? 'line-through decoration-red-400' : ''}`}
                                                      style={{color: task.color}}
                                                >
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
                                    )}
                                </Draggable>
                            ))}
                            {provided.placeholder}
                        </ul>
                    )}
                </Droppable>
            </DragDropContext>
        </div>
    )
}

export default ToDoList

