import React, { useState } from 'react';
import { Button, Input } from '../common';
import { FaPlus } from 'react-icons/fa';

const AddTodoForm = ({
    user,
    todos,
    setTodos,
    editingTodo,
    setEditingTodo,
    task,
    setTask,
    dueDate,
    setDueDate,
    labels,
    setLabels,
    handleSetLabels,
    cardColor,
}) => {
    const [category, setCategory] = useState('');

    // Function to handle category change
    const handleSetCategory = (value) => {
        const noSpaces = value.replace(/\s/g, '').toLowerCase();
        setCategory(noSpaces);
    };

    const addTodo = async (e) => {
        e.preventDefault();
        let localDueDate = '';
        if (dueDate) {
            // Create a new Date object in the local timezone
            localDueDate = new Date(dueDate + 'T00:00');
        }
        if (editingTodo) {
            // Update the todo being edited
            setTodos(todos.map((todo) => (todo.id === editingTodo.id ? { ...todo, text: task, dueDate: localDueDate, category, labels } : todo)));
            setEditingTodo(null);
        } else {
            const newTodo = {
                id: Date.now(),
                text: task,
                completed: false,
                dueDate: localDueDate,
                category,
                labels,
            };

            console.log('New Todo:', newTodo);

            if (user) {
                try {
                    const response = await fetch(`${process.env.REACT_APP_SERVER_URL}/api/tasks`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({ userId: user.id, ...newTodo }),
                        credentials: 'include',
                    });
                    if (!response.ok) {
                        throw new Error('HTTP error ' + response.status);
                    }
                    const data = await response.json();
                    setTodos((prevTodos) => [...prevTodos, data]);
                } catch (error) {
                    console.error('Failed to add task:', error);
                }
            } else {
                const localTodos = JSON.parse(localStorage.getItem('todos') || '[]') || [];
                localTodos.push(newTodo);
                localStorage.setItem('todos', JSON.stringify(localTodos));
                setTodos(localTodos);
            }
        }
        setTask('');
        setCategory('');
        setDueDate('');
        setLabels([]);
    };

    return (
        <form onSubmit={addTodo} className='flex flex-wrap justify-start items-center mb-4'>
            <div className='min-w-300px m-2'>
                <label htmlFor='task' className='visually-hidden'>
                    Task
                </label>
                <Input id='task' value={task} label='Task' setValue={setTask} size='300px' placeholder='Add a new task' />
            </div>
            <div className='min-w-130px m-2'>
                <label htmlFor='category' className='visually-hidden'>
                    Category
                </label>
                <Input id='category' value={category} label='Category' setValue={handleSetCategory} size='130px' placeholder='Category' />
            </div>
            <div className='min-w-150px m-2'>
                <label htmlFor='dueDate' className='visually-hidden'>
                    Due Date
                </label>
                <Input id='dueDate' type='date' label='Due Date' value={dueDate} setValue={setDueDate} size='150px' placeholder='Due date' />
            </div>
            <div className='m-2'>
                <label htmlFor='labels' className='visually-hidden'>
                    Labels
                </label>
                <Input
                    id='labels'
                    type='text'
                    label='Labels'
                    placeholder='Enter labels'
                    value={labels.join(', ')}
                    setValue={handleSetLabels}
                    size='300px'
                />
            </div>
            <div className='m-2'>
                <Button color={cardColor}>
                    <FaPlus />
                </Button>
            </div>
        </form>
    );
};

export default AddTodoForm;
