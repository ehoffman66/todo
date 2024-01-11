import React, { useState, useEffect } from 'react';
import Checkbox from './Checkbox';
import Button from './Button';
import Input from './Input';
import Card from './Card';
import { FaTrash, FaRegCalendarAlt } from 'react-icons/fa';

function App() {
   const [todos, setTodos] = useState(() => {
      const savedTodos = localStorage.getItem('todos');
      if (savedTodos) {
         return JSON.parse(savedTodos);
      } else {
         return [];
      }
   });
   const [task, setTask] = useState('');
   const [dueDate, setDueDate] = useState('');

   useEffect(() => {
      localStorage.setItem('todos', JSON.stringify(todos));
   }, [todos]);

   const addTodo = (e) => {
      e.preventDefault();
      if (!task.trim()) return;
      setTodos([...todos, { text: task, completed: false, dueDate }]);
      setTask('');
      setDueDate('');
   };

   const deleteTodo = (index) => {
      const newTodos = [...todos];
      newTodos.splice(index, 1);
      setTodos(newTodos);
   };

   const toggleCompletion = (index) => {
      const newTodos = [...todos];
      newTodos[index].completed = !newTodos[index].completed;
      setTodos(newTodos);
   };

   return (
      <div className="font-sans bg-brand-gray min-h-screen">
         <div className="container mx-auto px-4 py-8">
            <Card heading={<span style={{ fontSize: '2em' }}>TASKS</span>} paragraph={
               <div>
                  <form onSubmit={addTodo} className="flex items-center mb-4">
                     <Input 
                        value={task} 
                        setValue={setTask} 
                        placeholder="Add a new task" 
                     />
                     <Input 
                        type="date"
                        value={dueDate} 
                        setValue={setDueDate}
                        size="150px"
                        placeholder="Due date" 
                     />
                     <Button className="p-10" onClick={addTodo}>+</Button>
                  </form>
                  <div>
                     {todos.sort((a, b) => a.completed - b.completed).map((todo, index) => (
                        <div 
                           key={index} 
                           className={`flex items-start justify-between ${todo.completed ? 'line-through' : ''}`}
                        >
                           <div>
                              <Checkbox 
                                 item={todo.text} 
                                 checked={todo.completed} 
                                 onChange={() => toggleCompletion(index)}
                                 style={{ fontSize: '5.2em' }}
                              />
                              <div style={{ fontSize: '0.8em', display: 'flex', alignItems: 'center' }}>
                                 <FaRegCalendarAlt style={{ marginRight: '5px' }}/>
                                 <span>
                                    {todo.dueDate ? new Date(todo.dueDate).toLocaleDateString('en-US') : "No Date"}
                                 </span>                              </div>
                           </div>
                           <Button className="p-1 ml-2" onClick={() => deleteTodo(index)}>
                              <FaTrash />
                           </Button>
                        </div>
                     ))}
                  </div>
               </div>
            }/>
         </div>
      </div>
   );
}

export default App;