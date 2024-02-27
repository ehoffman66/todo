import React, { useEffect, useMemo, useState } from 'react';
import { Card, GoalsCard, SettingsCard, StatsCard, UserCard } from '../components/common';
import AddTodoForm from '../components/tasks/AddTodoForm';
import CompletedTodos from '../components/tasks/CompletedTodos';
import DueTodos from '../components/tasks/DueTodos';

const colorOptions = ['#bc95d4', '#6CD3BF', 'white', 'lightgray', 'lightblue', 'lightgreen', 'lightyellow'];

const sortOptions = ['Due Date', 'Category'];

const HomePage = () => {
    const [user, setUser] = useState(null);

    // Initialize todos to an empty array
    const [todos, setTodos] = useState([]);

    // Initialize hideCompleted from local storage or default to false
    const [hideCompleted, setHideCompleted] = useState(() => {
        const savedHideCompleted = localStorage.getItem('hideCompleted');
        return savedHideCompleted ? JSON.parse(savedHideCompleted) : false;
    });

    const [labels, setLabels] = useState([]);

    // State variables for new todo
    const [task, setTask] = useState('');
    const [dueDate, setDueDate] = useState('');
    const [category, setCategory] = useState('');

    // State variables for filters and sorting
    const [filter, setFilter] = useState('All');
    const [sortOption, setSortOption] = useState('Due Date');
    const [selectedBadge, setSelectedBadge] = useState('All');

    // State variables for editing todo
    const [editingTodo, setEditingTodo] = useState(null);
    const [editText, setEditText] = useState('');
    const [editCategory, setEditCategory] = useState('');
    const [editDueDate, setEditDueDate] = useState('');

    const [cardColor, setCardColor] = useState(() => {
        const savedColor = localStorage.getItem('cardColor');
        return savedColor ? savedColor : '#bc95d4';
    });

    // Get unique categories for badges
    const categories = useMemo(() => {
        return [...new Set(todos.map((todo) => todo.category || 'Blank'))];
    }, [todos]);

    const uniqueCategories = useMemo(() => {
        return todos.map((todo) => todo.category).filter((category, index, self) => self.indexOf(category) === index);
    }, [todos]);

    const sortedTodos = useMemo(() => {
        return [...todos].sort((a, b) => {
            if (a.completed !== b.completed) {
                return a.completed ? 1 : -1;
            }
            switch (sortOption) {
                case 'Due Date':
                    const dateA = new Date(a.dueDate);
                    const dateB = new Date(b.dueDate);
                    return dateA - dateB || a.id - b.id;
                case 'Category':
                    const categoryComparison = a.category.localeCompare(b.category);
                    return categoryComparison !== 0 ? categoryComparison : a.id - b.id;
                default:
                    return 0;
            }
        });
    }, [todos, sortOption]);

    const completedTodos = useMemo(() => {
        return sortedTodos.filter((todo) => todo.completed);
    }, [sortedTodos]);

    useEffect(() => {
        fetch(`${process.env.REACT_APP_SERVER_URL}/api/current_user`, {
            credentials: 'include', // Include credentials
        })
            .then((response) => {
                if (!response.ok) {
                    throw new Error(`Error: ${response.status}`);
                }
                return response.json();
            })
            .then((data) => {
                setUser(data);
                if (data) {
                    fetchTodos(data.googleId);
                    setCardColor(data.cardColor);
                }
            })
            .catch((error) => console.error('Error:', error));
    }, []);

    useEffect(() => {
        // Check if user is logged in
        if (user) {
            // Make a request to the server to update the user's record
            fetch(`${process.env.REACT_APP_SERVER_URL}/api/users/${user._id}/hideCompleted`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ hideCompleted }),
                credentials: 'include',
            })
                .then((response) => {
                    if (!response.ok) {
                        throw new Error('Failed to update user');
                    }
                })
                .catch((error) => console.error('Error:', error));
        }
    }, [hideCompleted, user]);

    useEffect(() => {
        localStorage.setItem('hideCompleted', JSON.stringify(hideCompleted));
    }, [hideCompleted]);

    useEffect(() => {
        localStorage.setItem('cardColor', cardColor);

        if (user) {
            // Make a request to the server to update the user's record
            fetch(`${process.env.REACT_APP_SERVER_URL}/api/users/${user._id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ cardColor }),
                credentials: 'include',
            })
                .then((response) => {
                    if (!response.ok) {
                        throw new Error('Failed to update user');
                    }
                })
                .catch((error) => console.error('Error:', error));
        }
    }, [cardColor, user]);

    useEffect(() => {
        localStorage.setItem('todos', JSON.stringify(todos));
    }, [todos]);

    const fetchTodos = async (userId) => {
        try {
            const tasksResponse = await fetch(`${process.env.REACT_APP_SERVER_URL}/api/tasks?userId=${userId}`, {
                credentials: 'include',
            });
            if (!tasksResponse.ok) {
                throw new Error('HTTP error ' + tasksResponse.status);
            }
            const tasks = await tasksResponse.json();
            setTodos(tasks);
        } catch (error) {
            console.error('Failed to fetch data:', error);
        }
    };

    const handleLogout = async () => {
        // Make a request to the logout endpoint
        const response = await fetch(`${process.env.REACT_APP_SERVER_URL}/api/logout`, {
            method: 'POST',
            credentials: 'include',
        });

        if (response.ok) {
            // Clear user data from the state
            setUser(null);
            setTodos([]);
        } else {
            console.error('Failed to log out');
        }
    };

    const handleSetLabels = (value) => {
        const newLabels = value.split(',').map((label) => label.trim());
        setLabels(newLabels);
    };

    // Function to handle badge click
    const handleBadgeClick = (badgeText) => {
        setSelectedBadge(badgeText);
        setFilter(badgeText);
    };

    // Function to handle sort option change
    const handleSortOptionChange = (option) => {
        setSortOption(option);
    };

    const handleEditClick = (todo) => {
        setEditingTodo(todo);
        setEditText(todo.text);
        setEditCategory(todo.category);
        if (todo.dueDate) {
            const dueDate = new Date(todo.dueDate);
            const year = dueDate.getFullYear();
            const month = String(dueDate.getMonth() + 1).padStart(2, '0');
            const day = String(dueDate.getDate()).padStart(2, '0');
            setEditDueDate(`${year}-${month}-${day}`);
        } else {
            setEditDueDate('');
        }
    };

    const handleUpdateTodo = async (id, newText, newCategory, newDueDate) => {
        if (!id) {
            console.error('Todo ID is undefined');
            return;
        }

        const updatedTodo = {
            text: newText,
            category: newCategory,
            dueDate: newDueDate ? new Date(newDueDate + 'T00:00') : undefined,
        };

        const response = await fetch(`${process.env.REACT_APP_SERVER_URL}/api/tasks/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(updatedTodo),
            credentials: 'include',
        });

        if (response.ok) {
            const updatedTodo = await response.json();
            // Update the todo in the state
            setTodos(todos.map((todo) => (todo._id === id ? updatedTodo : todo)));
        } else {
            console.error('Failed to update todo');
        }
    };

    const deleteTodo = async (id) => {
        const response = await fetch(`${process.env.REACT_APP_SERVER_URL}/api/tasks/${id}`, {
            method: 'DELETE',
            credentials: 'include',
        });
        if (response.ok) {
            setTodos(todos.filter((todo) => todo._id !== id));
        } else {
            console.error('Failed to delete todo');
        }
    };

    const toggleCompletion = async (id) => {
        const todoToUpdate = todos.find((todo) => todo._id === id);
        if (!todoToUpdate) return;

        const updatedTodo = { ...todoToUpdate, completed: !todoToUpdate.completed };
        console.log('Updated Todo:', updatedTodo);

        const response = await fetch(`${process.env.REACT_APP_SERVER_URL}/api/tasks/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(updatedTodo),
            credentials: 'include',
        });

        if (response.ok) {
            setTodos((prevTodos) => {
                return prevTodos.map((todo) => {
                    if (todo._id === id) {
                        return updatedTodo;
                    } else {
                        return todo;
                    }
                });
            });
        } else {
            console.error('Failed to update todo');
        }
    };

    const isTodoVisible = (todo) => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);
        const dueDate = new Date(todo.dueDate);
        dueDate.setHours(0, 0, 0, 0);

        if (uniqueCategories.includes(filter)) {
            return todo.category === filter;
        }

        switch (filter) {
            case 'Today':
                return (
                    todo.dueDate &&
                    dueDate.getFullYear() === today.getFullYear() &&
                    dueDate.getMonth() === today.getMonth() &&
                    dueDate.getDate() === today.getDate()
                );
            case 'Overdue':
                return todo.dueDate && dueDate < today && !todo.completed;
            case 'Tomorrow':
                return (
                    todo.dueDate &&
                    dueDate.getFullYear() === tomorrow.getFullYear() &&
                    dueDate.getMonth() === tomorrow.getMonth() &&
                    dueDate.getDate() === tomorrow.getDate()
                );
            default:
                return true;
        }
    };

    return (
        <div className='font-sans bg-brand-gray min-h-screen'>
            <div className='px-4 py-8 mx-auto md:w-10/12'>
                <div className='flex flex-col md:flex-row justify-center'>
                    <div className='w-full md:w-2/12 md:mr-4 mb-6 md:mb-2'>
                        <UserCard user={user} handleLogout={handleLogout} cardColor={cardColor} />
                    </div>
                    <div className='w-full md:w-8/12 md:mr-4 mb-6 md:mb-2'>
                        <Card
                            backgroundColor={cardColor}
                            heading={<span style={{ fontSize: '2em' }}>TASKS</span>}
                            paragraph={
                                <div>
                                    <AddTodoForm 
                                        user={user}
                                        todos={todos}
                                        setTodos={setTodos}
                                        editingTodo={editingTodo}
                                        setEditingTodo={setEditingTodo}
                                        task={task}
                                        setTask={setTask}
                                        dueDate={dueDate}
                                        setDueDate={setDueDate}
                                        labels={labels}
                                        setLabels={setLabels}
                                        handleSetLabels={handleSetLabels}
                                        cardColor={cardColor}
                                    />
                                    <DueTodos
                                        selectedBadge={selectedBadge}
                                        handleBadgeClick={handleBadgeClick}
                                        categories={categories}
                                        sortOptions={sortOptions}
                                        handleSortOptionChange={handleSortOptionChange}
                                        cardColor={cardColor}
                                        setEditText={setEditText}
                                        setEditDueDate={setEditDueDate}
                                        setEditCategory={setEditCategory}
                                        toggleCompletion={toggleCompletion}
                                        sortedTodos={sortedTodos}
                                        isTodoVisible={isTodoVisible}
                                        editingTodo={editingTodo}
                                        handleUpdateTodo={handleUpdateTodo}
                                        editText={editText}
                                        editCategory={editCategory}
                                        editDueDate={editDueDate}
                                        handleEditClick={handleEditClick}
                                        deleteTodo={deleteTodo}
                                    />
                                    <div>
                                        {!hideCompleted && (
                                            <CompletedTodos 
                                                selectedBadge={selectedBadge}
                                                completedTodos={completedTodos}
                                                isTodoVisible={isTodoVisible}
                                                toggleCompletion={toggleCompletion}
                                                deleteTodo={deleteTodo}
                                                cardColor={cardColor}
                                            />
                                        )}
                                    </div>
                                </div>
                            }
                        />
                    </div>
                    <div className='w-full md:w-2/12 md:mr-4 mb-6 md:mb-2'>
                        <div className='side-cards flex flex-col'>
                            <div className='stats-card'>
                                <StatsCard todos={todos} cardColor={cardColor} />
                            </div>
                            <div className='settings-card mt-4'>
                                <SettingsCard
                                    cardColor={cardColor}
                                    hideCompleted={hideCompleted}
                                    setHideCompleted={setHideCompleted}
                                    colorOptions={colorOptions}
                                    setCardColor={setCardColor}
                                />
                            </div>
                            <div className='settings-card mt-4'>
                                <GoalsCard
                                    cardColor={cardColor}
                                    hideCompleted={hideCompleted}
                                    setHideCompleted={setHideCompleted}
                                    colorOptions={colorOptions}
                                    setCardColor={setCardColor}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HomePage;
