import React, { useState, useEffect } from 'react';
import Checkbox from './components/Checkbox';
import Button from './components/Button';
import Input from './components/Input';
import Card from './components/Card';
import Badge from './components/Badge';
import Select from './components/Select'; 
import { compareAsc, parseISO } from 'date-fns';
import { FaTrash, FaRegCalendarAlt, FaPencilAlt } from 'react-icons/fa';

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
   const [category, setCategory] = useState('');
   const [filter, setFilter] = useState('All'); 
   const sortOptions = ['Date', 'Category'];

   const [selectedBadge, setSelectedBadge] = useState('All');

   const handleBadgeClick = (badgeText) => {
   setSelectedBadge(badgeText);
   setFilter(badgeText);
   };

   const [editingTodo, setEditingTodo] = useState(null);

   const [editText, setEditText] = useState('');

   const [sortOption, setSortOption] = useState('Due Date');

   // Use this function as the onItemSelected prop for the Select component
   const handleSortOptionChange = (option) => {
   setSortOption(option);
   }

   // Update handleEditClick to set the editText state
   const handleEditClick = (todo) => {
      setEditingTodo(todo);
      setEditText(todo.text);
   };

   // Update handleUpdateTodo to clear the editText state
   const handleUpdateTodo = (id, newText) => {
      setTodos(todos.map(todo => todo.id === id ? { ...todo, text: newText } : todo));
      setEditingTodo(null);
      setEditText('');
   };

   const uniqueCategories = todos.map(todo => todo.category)
                              .filter((category, index, self) => self.indexOf(category) === index);


   const sortedTodos = [...todos].sort((a, b) => {
     // First sort by completed status
     if (a.completed !== b.completed) {
        return a.completed ? 1 : -1;
     }
     // If both tasks have the same completed status, sort based on the selected option
     switch (sortOption) {
        case 'Due Date':
           const dateA = new Date(a.dueDate);
           const dateB = new Date(b.dueDate);
           return dateA - dateB || a.id - b.id;
        case 'Category':
           const categoryComparison = a.category.localeCompare(b.category);
           return categoryComparison !== 0 ? categoryComparison : a.id - b.id;
        // Add more cases if you have more sort options
        default:
           return 0; // No sorting
     }
   });

   const completedTodos = sortedTodos.filter(todo => todo.completed);
                           
   useEffect(() => {
      localStorage.setItem('todos', JSON.stringify(todos));
   }, [todos]);

   const addTodo = (e) => {
      e.preventDefault();
      if (!task.trim()) return;
      let localDueDate = '';
      if (dueDate) {
         const [year, month, day] = dueDate.split('-');
         localDueDate = new Date(year, month - 1, day);
      }
      const newTodo = {
         id: Date.now(), // Add a unique id
         text: task,
         completed: false,
         dueDate: localDueDate,
         category
      };
      setTodos([...todos, newTodo]);
      setTask('');
      setDueDate('');
      setCategory('');
   };

   const deleteTodo = (id) => {
      setTodos(todos.filter(todo => todo.id !== id));
   };

   const toggleCompletion = (id) => {
      setTodos(todos.map(todo => todo.id === id ? { ...todo, completed: !todo.completed } : todo));
   };

   const isTodoVisible = (todo) => {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);
      const dueDate = new Date(todo.dueDate);
      dueDate.setHours(0, 0, 0, 0); // Set the time of the due date to midnight

      if (uniqueCategories.includes(filter)) {
         return todo.category === filter;
      }

      switch (filter) {
         case 'Today':
            return dueDate.getFullYear() === today.getFullYear() &&
               dueDate.getMonth() === today.getMonth() &&
               dueDate.getDate() === today.getDate();
         case 'Overdue':
            return dueDate < today && !todo.completed;
         case 'Tomorrow':
            return dueDate.getFullYear() === tomorrow.getFullYear() &&
               dueDate.getMonth() === tomorrow.getMonth() &&
               dueDate.getDate() === tomorrow.getDate();
         default:
            return true;
      }
   };

   return (
      <div className="font-sans bg-brand-gray min-h-screen">
        <div className="container mx-auto px-4 py-8">
          <Card heading={<span style={{ fontSize: '2em' }}>TASKS</span>} paragraph={
            <div>
              <form onSubmit={addTodo} className="flex flex-wrap items-center mb-4">
                <div className="flex-1 min-w-300px m-2">
                  <Input 
                    value={task} 
                    setValue={setTask} 
                    size="300px"
                    placeholder="Add a new task" 
                  />
                </div>
                <div className="flex-1 min-w-130px m-2">
                  <Input 
                    value={category} 
                    setValue={setCategory} 
                    size="130px"
                    placeholder="Category" 
                  />
                </div>
                <div className="flex-1 min-w-150px m-2">
                  <Input 
                    type="date"
                    value={dueDate} 
                    setValue={setDueDate}
                    size="150px"
                    placeholder="Due date" 
                  />
                </div>
                <div className="m-2">
                  <Button className="p-10" onClick={addTodo}>+</Button>
                </div>
              </form>
            <div className="mb-4 flex flex-wrap space-x-2">
               <Badge badgeText="All" onClick={handleBadgeClick} isSelected={'All' === selectedBadge} className="my-10" />
               <Badge badgeText="Today" onClick={handleBadgeClick} isSelected={'Today' === selectedBadge} className="my-10" />
               <Badge badgeText="Overdue" onClick={handleBadgeClick} isSelected={'Overdue' === selectedBadge} className="my-10" />
               <Badge badgeText="Tomorrow" onClick={handleBadgeClick} isSelected={'Tomorrow' === selectedBadge} className="my-10" />
               <span style={{ margin: '0 10px' }}></span>
               {uniqueCategories.map(category => (
                  <Badge key={category} badgeText={category} onClick={handleBadgeClick} isSelected={category === selectedBadge} className="my-10" />
               ))}
            </div>
                  <div>
                  <div style={{ marginTop: '20px' }}>
                  <div className="flex justify-between items-center mb-4">
                     <h2 className="text-2xl">Todo Items</h2>
                     <Select items={sortOptions} onItemSelected={handleSortOptionChange} />                
                     </div>                 
                  {sortedTodos.filter(todo => !todo.completed && isTodoVisible(todo)).map((todo) => (
                        <div 
                           key={todo.id} // Use the unique id as a key
                           className={`flex items-start justify-between ${todo.completed ? 'line-through' : ''}`}
                        >
                           <div>
                              {editingTodo === todo ? (
                                 <input 
                                    value={editText} 
                                    onChange={(e) => setEditText(e.target.value)}
                                    onBlur={(e) => handleUpdateTodo(todo.id, e.target.value)} 
                                    autoFocus
                                 />
                              ) : (
                                 <Checkbox 
                                    item={todo.text} 
                                    checked={todo.completed} 
                                    onChange={() => toggleCompletion(todo.id)}
                                    style={{ fontSize: '5.2em' }}
                                 />
                              )}
                              <div style={{ fontSize: '0.8em', display: 'flex', alignItems: 'center' }}>
                                 <FaRegCalendarAlt style={{ marginRight: '5px' }}/>
                                 <span>
                                    {todo.dueDate ? new Date(todo.dueDate).toLocaleDateString('en-US') : "No Date"}
                                 </span>
                                 <span style={{ margin: '0 5px' }}>|</span>
                                 <span>{todo.category}</span>
                              </div>
                           </div>
                           <div style={{ display: 'flex', justifyContent: 'space-between', width: '80px' }}>
                              <Button onClick={() => handleEditClick(todo)} style={{ marginRight: '10px' }}>
                                 <FaPencilAlt />
                              </Button>
                              <Button onClick={() => deleteTodo(todo.id)}>
                                 <FaTrash />
                              </Button>
                           </div>
                        </div>
                     ))}
                  </div>
                  </div>

                  <div>
                  <div style={{ marginTop: '50px' }}>
                     {!(selectedBadge === 'Today' || selectedBadge === 'Overdue' || selectedBadge === 'Tomorrow') && (
                        <h2 className="text-2xl font-bold mb-4">Completed Tasks</h2>
                     )}
                     {completedTodos.filter(isTodoVisible).map((todo) => 
                        (todo.completed && (selectedBadge === 'Today' || selectedBadge === 'Overdue' || selectedBadge === 'Tomorrow')) 
                           ? null 
                           : (
                              <div 
                                 key={todo.id} // Use the unique id as a key
                                 className={`flex items-start justify-between ${todo.completed ? 'line-through' : ''}`}
                              >
                                 <div>
                                    <Checkbox 
                                       item={todo.text} 
                                       checked={todo.completed} 
                                       onChange={() => toggleCompletion(todo.id)}
                                       style={{ fontSize: '5.2em' }}
                                    />
                                    <div style={{ fontSize: '0.8em', display: 'flex', alignItems: 'center' }}>
                                       <FaRegCalendarAlt style={{ marginRight: '5px' }}/>
                                       <span>
                                          {todo.dueDate ? new Date(todo.dueDate).toLocaleDateString('en-US') : "No Date"}
                                       </span>
                                       <span style={{ margin: '0 5px' }}>|</span>
                                       <span>{todo.category}</span>
                                    </div>
                                 </div>
                                 <Button onClick={() => deleteTodo(todo.id)}>
                                    <FaTrash />
                                 </Button>
                              </div>
                           )
                     )}
                  </div>
                  </div>
               </div>
            }/>
         </div>
      </div>
   );
}

export default App;