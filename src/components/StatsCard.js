import React from 'react';
import Card from './Card';

const StatsCard = ({ todos, cardColor }) => {
    return (
        <Card
            backgroundColor={cardColor}
            heading={<span style={{ fontSize: '2em' }}>STATS</span>}
            paragraph={
                <div>
                    <p>Total Todos: {todos.length}</p>
                    <p>Completed Todos: {todos.filter((todo) => todo.completed).length}</p>
                    <p>Uncompleted Todos: {todos.filter((todo) => !todo.completed).length}</p>
                    <p>Unique Categories: {new Set(todos.map((todo) => todo.category)).size}</p>
                </div>
            }
            size='xl:w-full'
        />
    );
};

export default StatsCard;
