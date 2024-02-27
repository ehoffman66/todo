import React from 'react';
import { Badge, Button, Checkbox, Input, Select } from '../common';
import { FaListAlt, FaPencilAlt, FaRegCalendarAlt, FaTag, FaTrash } from 'react-icons/fa';
import { FiSave } from 'react-icons/fi';
import { linkify } from '../../utils';

const DueTodos = ({
    selectedBadge,
    handleBadgeClick,
    categories,
    sortOptions,
    handleSortOptionChange,
    cardColor,
    setEditText,
    setEditDueDate,
    setEditCategory,
    toggleCompletion,
    sortedTodos,
    isTodoVisible,
    editingTodo,
    handleUpdateTodo,
    editText,
    editCategory,
    editDueDate,
    handleEditClick,
    deleteTodo,
}) => {
    return (
        <>
            <div key='todos-filters' className='mb-4 flex flex-wrap space-x-2'>
                {['All', 'Today', 'Tomorrow', 'Overdue'].map((badge, index) => (
                    <Badge
                        key={index}
                        badgeColor='transparent'
                        badgeText={badge === 'All' ? badge : (
                            <div style={{ display: 'flex', alignItems: 'center' }}>
                                <FaRegCalendarAlt style={{ marginRight: '5px' }} /> {badge}
                            </div>
                        
                        )}
                        isSelected={selectedBadge === badge}
                        onClick={() => handleBadgeClick(badge)}
                    />
                ))}
                <span style={{ margin: '0 10px' }}></span>
                {categories.map((category, index) => (
                    <Badge
                        key={index}
                        badgeColor='transparent'
                        badgeText={
                            <div style={{ display: 'flex', alignItems: 'center' }}>
                                <FaListAlt style={{ marginRight: '5px' }} /> {category}
                            </div>
                        }
                        isSelected={selectedBadge === category}
                        onClick={() => handleBadgeClick(category)}
                    />
                ))}
            </div>
            <div key='todoItems'>
                <div style={{ marginTop: '20px' }}>
                    <div className='flex justify-between items-center mb-4'>
                        <h2 className='text-2xl'>Todo Items</h2>
                        <Select items={sortOptions} onItemSelected={handleSortOptionChange} color={cardColor} />
                    </div>
                    {sortedTodos
                        .filter((todo) => !todo.completed && isTodoVisible(todo))
                        .map((todo, idx) => (
                            <div key={'todo-'+idx+'-'+todo.id} className={`flex items-start justify-between ${todo.completed ? 'line-through' : ''}`}>
                                <div>
                                    {editingTodo === todo ? (
                                        <form
                                            onSubmit={(e) => {
                                                e.preventDefault();
                                                handleUpdateTodo(todo.id, editText, editCategory, editDueDate);
                                            }}
                                        >
                                            <div style={{ display: 'flex', flexDirection: 'column' }}>
                                                <Input
                                                    id='editText'
                                                    label='Task'
                                                    value={editText}
                                                    setValue={setEditText}
                                                    size='320px'
                                                    // autoFocus
                                                    style={{ marginBottom: '10px' }}
                                                />
                                                <div
                                                    style={{
                                                        display: 'flex',
                                                        // justifyContent: 'space-between',
                                                        marginTop: '10px',
                                                        gap: '1rem'
                                                    }}
                                                >
                                                    <Input
                                                        id='editDueDate'
                                                        label='Due Date'
                                                        type='date'
                                                        size='150px'
                                                        value={editDueDate}
                                                        setValue={setEditDueDate}
                                                        style={{ marginBottom: '10px', marginRight: '10px' }}
                                                    />
                                                    <Input
                                                        id='editCategory'
                                                        label='Category'
                                                        value={editCategory}
                                                        size='150px'
                                                        setValue={setEditCategory}
                                                        style={{ marginBottom: '10px' }}
                                                    />
                                                </div>
                                            </div>
                                            <Button
                                                color={cardColor}
                                                style={{ marginTop: '10px', marginBottom: '10px' }}
                                                onClick={() => handleUpdateTodo(editingTodo._id, editText, editCategory, editDueDate)}
                                            >
                                                <FiSave />
                                                Save
                                            </Button>
                                        </form>
                                    ) : (
                                        <Checkbox
                                            id={todo._id}
                                            item={<div dangerouslySetInnerHTML={{ __html: linkify(todo.text) }} />}
                                            checked={todo.completed}
                                            onChange={toggleCompletion}
                                            style={{ fontSize: '5.2em' }}
                                        />
                                    )}
                                    <div style={{ fontSize: '0.8em', display: 'flex', alignItems: 'center' }}>
                                        <FaRegCalendarAlt style={{ marginRight: '5px' }} />
                                        <span
                                            style={{
                                                color:
                                                    todo.dueDate && new Date(todo.dueDate).setHours(0, 0, 0, 0) < new Date().setHours(0, 0, 0, 0)
                                                        ? 'red'
                                                        : 'inherit',
                                            }}
                                        >
                                            {todo.dueDate ? new Date(todo.dueDate).toLocaleDateString('en-US') : 'No Date'}
                                        </span>
                                        <span style={{ margin: '0 5px' }}>|</span>
                                        <span style={{ display: 'flex', alignItems: 'center' }}>
                                            <FaListAlt style={{ marginRight: '5px' }} />
                                            {todo.category}
                                        </span>
                                        {todo.labels &&
                                            todo.labels.map((label, index) => (
                                                <span
                                                    key={index}
                                                    style={{
                                                        marginLeft: '10px',
                                                        backgroundColor: 'lightgray',
                                                        borderRadius: '5px',
                                                        padding: '2px 5px',
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                    }}
                                                >
                                                    <FaTag style={{ marginRight: '5px' }} />
                                                    {label}
                                                </span>
                                            ))}
                                    </div>
                                </div>
                                <div
                                    style={{
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        width: '80px',
                                    }}
                                >
                                    <Button onClick={() => handleEditClick(todo)} style={{ marginRight: '10px' }} color={cardColor}>
                                        <FaPencilAlt />
                                    </Button>
                                    <Button onClick={() => deleteTodo(todo._id)} color={cardColor}>
                                        <FaTrash />
                                    </Button>
                                </div>
                            </div>
                        ))}
                </div>
            </div>
        </>
    );
};

export default DueTodos;
