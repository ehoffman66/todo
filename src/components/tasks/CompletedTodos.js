import React from 'react';
import { Button, Checkbox } from '../common';
import { linkify } from '../../utils';
import { FaRegCalendarAlt, FaTrash } from 'react-icons/fa';

const CompletedTodos = ({
    selectedBadge,
    completedTodos,
    isTodoVisible,
    toggleCompletion,
    deleteTodo,
    cardColor,
}) => {
    return (
        <div style={{ marginTop: '50px' }}>
            {!(selectedBadge === 'Today' || selectedBadge === 'Overdue' || selectedBadge === 'Tomorrow') && (
                <h2 className='text-2xl font-bold mb-4'>Completed Tasks</h2>
            )}
            {completedTodos.filter(isTodoVisible).map((todo, idx) =>
                todo.completed && (selectedBadge === 'Today' || selectedBadge === 'Overdue' || selectedBadge === 'Tomorrow') ? null : (
                    <div key={'completed-todo-'+idx+'-'+todo.id} className={`flex items-start justify-between ${todo.completed ? 'line-through' : ''}`}>
                        <div className='md:w-1/2'>
                            <Checkbox
                                id={'chechbox_todo_' + todo._id}
                                item={<div dangerouslySetInnerHTML={{ __html: linkify(todo.text) }} />}
                                checked={todo.completed}
                                onChange={() => toggleCompletion(todo._id)}
                                style={{ fontSize: '5.2em' }}
                            />
                            <div
                                style={{
                                    fontSize: '0.8em',
                                    display: 'flex',
                                    alignItems: 'center',
                                }}
                            >
                                <FaRegCalendarAlt style={{ marginRight: '5px' }} />
                                <span>{todo.dueDate ? new Date(todo.dueDate).toLocaleDateString('en-US') : 'No Date'}</span>
                                <span style={{ margin: '0 5px' }}>|</span>
                                <span>{todo.category}</span>
                            </div>
                        </div>
                        <Button onClick={() => deleteTodo(todo._id)} color={cardColor}>
                            <FaTrash />
                        </Button>
                    </div>
                )
            )}
        </div>
    );
};

export default CompletedTodos;
