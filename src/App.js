import React, { useState, useEffect } from 'react';
import Checkbox from './components/Checkbox';
import Button from './components/Button';
import Input from './components/Input';
import Card from './components/Card';
import Badge from './components/Badge';
import Select from './components/Select';
import { FaTrash, FaRegCalendarAlt, FaPencilAlt, FaPlus } from 'react-icons/fa';
import { FiSave } from 'react-icons/fi';
import SettingsCard from './components/SettingsCard';
import StatsCard from './components/StatsCard';
import GoalsCard from './components/GoalsCard';

function App() {
   // State variables for todos
   const [todos, setTodos] = useState(() => {
      const savedTodos = localStorage.getItem('todos');
      return savedTodos ? JSON.parse(savedTodos) : [];
   });

   const [hideCompleted, setHideCompleted] = useState(() => {
      const savedHideCompleted = localStorage.getItem('hideCompleted');
      return savedHideCompleted ? JSON.parse(savedHideCompleted) : false;
   });

   const [labels, setLabels] = useState([]);

   const handleSetLabels = (value) => {
      const newLabels = value.split(',').map(label => label.trim());
      setLabels(newLabels);
    };

   useEffect(() => {
      localStorage.setItem('hideCompleted', JSON.stringify(hideCompleted));
    }, [hideCompleted]);


   const [cardColor, setCardColor] = useState(() => {
      const savedColor = localStorage.getItem('cardColor');
      return savedColor ? savedColor : '#bc95d4';
   });

   useEffect(() => {
      localStorage.setItem('cardColor', cardColor);
   }, [cardColor]);

   const colorOptions = ['#bc95d4', '#6CD3BF', 'white', 'lightgray', 'lightblue', 'lightgreen', 'lightyellow'];

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
   const [editCategory, setEditCategory] = useState("");
   const [editDueDate, setEditDueDate] = useState("");

   // Function to handle badge click
   const handleBadgeClick = (badgeText) => {
      setSelectedBadge(badgeText);
      setFilter(badgeText);
   };

   // Function to handle category change
   const handleSetCategory = (value) => {
      const noSpaces = value.replace(/\s/g, '').toLowerCase();
      setCategory(noSpaces);
   };

   const sortOptions = ['Due Date', 'Category', 'Completed', 'Uncompleted'];

   // Function to handle sort option change
   const handleSortOptionChange = (option) => {
      setSortOption(option);
   };

   // Get unique categories for badges
   const categories = [...new Set(todos.map(todo => todo.category || "Blank"))];

   const handleEditClick = (todo) => {
      setEditingTodo(todo);
      setEditText(todo.text);
      setEditCategory(todo.category);
      if (todo.dueDate) {
         const dueDate = new Date(todo.dueDate);
         const year = dueDate.getFullYear();
         const month = String(dueDate.getMonth() + 1).padStart(2, '0'); // Months are 0-indexed in JavaScript
         const day = String(dueDate.getDate()).padStart(2, '0');
         setEditDueDate(`${year}-${month}-${day}`);
      } else {
         setEditDueDate('');
      }
   };

   const handleUpdateTodo = (id, newText, newCategory, newDueDate) => {
      setTodos(todos.map(todo => 
         todo.id === id 
            ? { 
                  ...todo, 
                  text: newText, 
                  category: newCategory, 
                  dueDate: newDueDate ? new Date(newDueDate + 'T00:00') : null 
               } 
            : todo
      ));
      setEditingTodo(null);
      setEditText('');
      setEditCategory('');
      setEditDueDate('');
   };

   const uniqueCategories = todos.map(todo => todo.category)
                              .filter((category, index, self) => self.indexOf(category) === index);


   const sortedTodos = [...todos].sort((a, b) => {
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

   const completedTodos = sortedTodos.filter(todo => todo.completed);
                           
   useEffect(() => {
      localStorage.setItem('todos', JSON.stringify(todos));
   }, [todos]);

   const addTodo = (e) => {
      e.preventDefault();
      let localDueDate = '';
      if (dueDate) {
         // Create a new Date object in the local timezone
         localDueDate = new Date(dueDate + 'T00:00');
      }
      if (editingTodo) {
         // Update the todo being edited
         setTodos(todos.map(todo => 
            todo.id === editingTodo.id ? { ...todo, text: task, dueDate: localDueDate, category, labels } : todo
         ));
         setEditingTodo(null);
      } else {
         // Add a new todo
         const newTodo = {
            id: Date.now(),
            text: task,
            completed: false,
            dueDate: localDueDate,
            category,
            labels // Add the labels here
         };
         setTodos([...todos, newTodo]);
      }
      setTask("");
      setCategory('');
      setDueDate('');
      setLabels([]);
   };

   const deleteTodo = (id) => {
      setTodos(todos.filter(todo => todo.id !== id));
   };

   const toggleCompletion = (id) => {
      setTodos(todos.map(todo => {
         if (todo.id === id) {
            const isCompleted = !todo.completed;
            return {
               ...todo,
               completed: isCompleted,
               completedAt: isCompleted ? new Date().toISOString() : null,
            };
         }
         return todo;
      }));
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
        <div className="container mx-auto px-3 py-8">
          <div className="flex flex-col md:flex-row">
            <div className="md:w-3/4 md:mr-4 mb-2 md:mb-0">
               <Card backgroundColor={cardColor} heading={<span style={{ fontSize: '2em' }}>TASKS</span>} paragraph={
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
                              setValue={handleSetCategory} 
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
                        <Input 
                           type="text" 
                           placeholder="Enter labels" 
                           value={labels.join(', ')} 
                           setValue={handleSetLabels}
                           size="300px"
                        />
                        <div className="m-2">
                           <Button type="submit" color={cardColor}>
                              <FaPlus />
                           </Button>
                        </div>
                     </form>
                     <div className="mb-4 flex flex-wrap space-x-2">
                        <Badge 
                           key="All" 
                           badgeText="All"
                           isSelected={selectedBadge === "All"}
                           onClick={() => handleBadgeClick("All")}
                        />
                        <Badge 
                           key="Today" 
                           badgeText="Today"
                           isSelected={selectedBadge === "Today"}
                           onClick={() => handleBadgeClick("Today")}
                        />
                        <Badge 
                           key="Tomorrow" 
                           badgeText="Tomorrow"
                           isSelected={selectedBadge === "Tomorrow"}
                           onClick={() => handleBadgeClick("Tomorrow")}
                        />
                        <Badge 
                           key="Overdue" 
                           badgeText="Overdue"
                           isSelected={selectedBadge === "Overdue"}
                           onClick={() => handleBadgeClick("Overdue")}
                        />                  <span style={{ margin: '0 10px' }}></span>
                        {categories.map((category, index) => (
                           <Badge 
                              key={index} 
                              badgeText={category}
                              onClick={() => handleBadgeClick(category === "Blank" ? "" : category)}
                              isSelected={category === selectedBadge}
                              className="my-10"
                           />
                        ))}
                  </div>
                  <div>
                     <div style={{ marginTop: '20px' }}>
                        <div className="flex justify-between items-center mb-4">
                           <h2 className="text-2xl">Todo Items</h2>
                           <Select items={sortOptions} onItemSelected={handleSortOptionChange} color={cardColor} />               
                        </div>                 
                           {sortedTodos.filter(todo => !todo.completed && isTodoVisible(todo)).map((todo) => (
                           <div 
                              key={todo.id}
                              className={`flex items-start justify-between ${todo.completed ? 'line-through' : ''}`}
                           >
                              <div>
                                 {editingTodo === todo ? (
                                    <form onSubmit={(e) => {
                                       e.preventDefault();
                                       handleUpdateTodo(todo.id, editText, editCategory, editDueDate);
                                    }}>
                                       <div style={{ display: 'flex', flexDirection: 'column' }}>
                                          <Input 
                                             value={editText} 
                                             setValue={setEditText}
                                             size="320px"
                                             autoFocus
                                             style={{ marginBottom: '10px' }}
                                          />
                                          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '10px' }}>
                                             <Input 
                                                type="date"
                                                size="150px"
                                                value={editDueDate} 
                                                setValue={setEditDueDate}
                                                style={{ marginBottom: '10px', marginRight: '10px' }}
                                             />
                                             <Input 
                                                value={editCategory} 
                                                size="150px"
                                                setValue={setEditCategory}
                                                style={{ marginBottom: '10px' }}
                                             />
                                          </div>
                                       </div>
                                       <Button color={cardColor} type="submit" style={{ marginTop: '10px', marginBottom: '10px' }}>
                                          <FiSave />
                                          Save
                                       </Button>
                                    </form>
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
                                    <span style={{ color: new Date(todo.dueDate) < new Date() ? 'red' : 'inherit' }}>
                                       {todo.dueDate ? new Date(todo.dueDate).toLocaleDateString('en-US') : "No Date"}
                                    </span>
                                    <span style={{ margin: '0 5px' }}>|</span>
                                    <span>{todo.category}</span>
                                 </div>
                              </div>
                              <div style={{ display: 'flex', justifyContent: 'space-between', width: '80px' }}>
                                 <Button onClick={() => handleEditClick(todo)} style={{ marginRight: '10px' }} color={cardColor}>
                                    <FaPencilAlt />
                                 </Button>
                                 <Button onClick={() => deleteTodo(todo.id)} color={cardColor}>
                                    <FaTrash />
                                 </Button>
                              </div>
                           </div>
                        ))}
                     </div>
                     </div>

                     <div>
                     {!hideCompleted && (
                     <div style={{ marginTop: '50px' }}>
                        {!(selectedBadge === 'Today' || selectedBadge === 'Overdue' || selectedBadge === 'Tomorrow') && (
                           <h2 className="text-2xl font-bold mb-4">Completed Tasks</h2>
                        )}
                        {completedTodos.filter(isTodoVisible).map((todo) => 
                           (todo.completed && (selectedBadge === 'Today' || selectedBadge === 'Overdue' || selectedBadge === 'Tomorrow')) 
                              ? null 
                              : (
                                 <div 
                                    key={todo.id}
                                    className={`flex items-start justify-between ${todo.completed ? 'line-through' : ''}`}
                                 >
                                 <div className="md:w-1/2">
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
                     )}
                     </div>
                  </div>
               }/>
               </div>
               <div className="">
                  <div className="side-cards flex flex-col">
                     <div className="stats-card">
                        <StatsCard 
                           todos={todos}
                           cardColor={cardColor}
                        />
                     </div>
                     <div className="settings-card mt-4">
                        <SettingsCard 
                           cardColor={cardColor}
                           hideCompleted={hideCompleted}
                           setHideCompleted={setHideCompleted}
                           colorOptions={colorOptions}
                           setCardColor={setCardColor}
                        />
                     </div>
                     <div className="settings-card mt-4">
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
}

export default App;