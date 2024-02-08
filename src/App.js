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
import { FaListAlt } from 'react-icons/fa';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { Link } from 'react-router-dom';

function App() {
   const [user, setUser] = useState(null);

   const fetchTodos = async () => {
      try {
         const userResponse = await fetch('http://localhost:3000/api/current_user', {
            credentials: 'include'
         });
         if (!userResponse.ok) {
            throw new Error('HTTP error ' + userResponse.status);
         }
         const user = await userResponse.json();
         setUser(user);

         if (user) {
            const tasksResponse = await fetch('http://localhost:3000/api/tasks?userId=' + user.googleId, {
               credentials: 'include'
            });
            if (!tasksResponse.ok) {
               throw new Error('HTTP error ' + tasksResponse.status);
            }
            const tasks = await tasksResponse.json();
            setTodos(tasks);
         } else {
            const savedTodos = localStorage.getItem('todos');
            setTodos(savedTodos ? JSON.parse(savedTodos) : []);
         }
      } catch (error) {
         console.error('Failed to fetch data:', error);
      }
   };

   // Initialize todos to an empty array
   const [todos, setTodos] = useState([]);

   // Initialize hideCompleted from local storage or default to false
   const [hideCompleted, setHideCompleted] = useState(() => {
      const savedHideCompleted = localStorage.getItem('hideCompleted');
      return savedHideCompleted ? JSON.parse(savedHideCompleted) : false;
   });

   const handleLogout = async () => {
      console.log('Logging out user:', user);
      
      // Make a request to the logout endpoint
      const response = await fetch('http://localhost:3000/api/logout', {
         method: 'POST',
         credentials: 'include', // Include credentials in the request
      });

      if (response.ok) {
         // Clear user data from the state
         setUser(null);
         setTodos([]);

         // Optionally, redirect the user to the login page
         // history.push('/login');
      } else {
         console.error('Failed to log out');
      }
   };

   // Fetch todos when the component mounts
   useEffect(() => {
      fetchTodos();
   }, []);

   useEffect(() => {
      fetch('http://localhost:3000/api/current_user', {
         credentials: 'include' // Include credentials
      })
      .then(response => {
         if (!response.ok) {
            throw new Error(response.status);
         }
         return response.json();
      })
      .then(data => {
         setUser(data);
         console.log('User data:', data); // Log the user data to the console
      })
      .catch((error) => console.error('Error:', error));
   }, []);

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

   const sortOptions = ['Due Date', 'Category'];

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

   function linkify(inputText) {
      let replacedText, replacePattern1, replacePattern2;

      // URLs starting with http://, https://, or ftp://
      replacePattern1 = /(\b(https?|ftp):\/\/[-A-Z0-9+&@#/%?=~_|!:,.;]*[-A-Z0-9+&@#/%=~_|])/gim;
      replacedText = inputText.replace(replacePattern1, (match, url) => {
         return '<a href="' + url + '" target="_blank" style="text-decoration: underline;">' + url + '</a>';
      });

      // URLs starting with "www." (without // before it).
      replacePattern2 = /(^|[^/])(www.[\S]+(\b|$))/gim;
      replacedText = replacedText.replace(replacePattern2, (match, p1, p2) => {
         const displayText = p2.replace(/^www\./, ''); // Remove "www." from the start of the URL
         return p1 + '<a href="http://' + p2 + '" target="_blank" style="text-decoration: underline;">' + displayText + '</a>';
      });

      return replacedText;
   }

   const handleUpdateTodo = async (id, newText, newCategory, newDueDate) => {
      const todoToUpdate = todos.find(todo => todo._id === id);
      if (!todoToUpdate) return;

      const updatedTodo = { 
         ...todoToUpdate, 
         text: newText, 
         category: newCategory, 
         dueDate: newDueDate ? new Date(newDueDate + 'T00:00') : null 
      };

      const response = await fetch(`http://localhost:3000/api/tasks/${id}`, {
         method: 'PUT',
         headers: {
            'Content-Type': 'application/json',
         },
         body: JSON.stringify(updatedTodo),
         credentials: 'include', // Include credentials in the request
      });

      if (response.ok) {
         setTodos(todos.map(todo => 
            todo._id === id 
               ? updatedTodo
               : todo
         ));
         setEditingTodo(null);
         setEditText('');
         setEditCategory('');
         setEditDueDate('');
      } else {
         console.error('Failed to update todo');
      }
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

   const addTodo = async (e) => {
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

         console.log('User:', user);
         console.log('New Todo:', newTodo);

         if (user) {
            try {
               const response = await fetch('http://localhost:3000/api/tasks', {
                  method: 'POST',
                  headers: {
                     'Content-Type': 'application/json'
                  },
                  body: JSON.stringify({ userId: user.id, ...newTodo }),
                  credentials: 'include'
               });
               if (!response.ok) {
                  throw new Error('HTTP error ' + response.status);
               }
               const data = await response.json();
               setTodos(prevTodos => [...prevTodos, data]);
            } catch (error) {
               console.error('Failed to add task:', error);
            }
         } else {
            const localTodos = JSON.parse(localStorage.getItem('todos')) || [];
            localTodos.push(newTodo);
            localStorage.setItem('todos', JSON.stringify(localTodos));
            setTodos(localTodos);
         }
      }
      setTask("");
      setCategory('');
      setDueDate('');
      setLabels([]);
   };

   const deleteTodo = (id) => {
      setTodos(todos.filter(todo => todo.id !== id));
   };

   const toggleCompletion = async (id) => {
      const todoToUpdate = todos.find(todo => todo._id === id);
      if (!todoToUpdate) return;

      const updatedTodo = { ...todoToUpdate, completed: !todoToUpdate.completed };
      console.log('Updated Todo:', updatedTodo);
      console.log('User:', user);
      console.log('ID:', id);

      const response = await fetch(`http://localhost:3000/api/tasks/${id}`, {
         method: 'PUT',
         headers: {
            'Content-Type': 'application/json',
         },
         body: JSON.stringify(updatedTodo),
         credentials: 'include', // Include credentials in the request
      });

      if (response.ok) {
         setTodos(prevTodos => {
            return prevTodos.map(todo => {
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
      <Router>
      <Routes>
      <Route path="*" element={
         <div className="font-sans bg-brand-gray min-h-screen">
            <div className="px-4 py-8 mx-auto md:w-10/12">
               <div className="flex flex-col md:flex-row justify-center">
                  <div className="w-full md:w-2/12 md:mr-4 mb-6 md:mb-2">
                     <Card backgroundColor={cardColor} heading={<span style={{ fontSize: '2em' }}>USER</span>} paragraph={
                        user ? 
                           <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                              <div style={{ display: 'flex', alignItems: 'center' }}>
                                 <img src={user.picture} alt="User" style={{ borderRadius: '50%', marginRight: '1em' }} />
                                 <div>
                                    <p style={{ fontSize: '1.3em' }}>{user.firstName}</p>
                                    <p style={{ fontSize: '1.3em' }}>{user.lastName}</p>
                                 </div>
                              </div>
                              <button onClick={handleLogout} style={{ marginTop: '1em' }}>Logout</button>
                           </div>
                        : 
                           <Link to="http://localhost:3000/auth/google">Login</Link>
                     }/>
                  </div>

                  <div className="w-full md:w-8/12 md:mr-4 mb-6 md:mb-2">
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
                                 badgeText={
                                    <div style={{ display: 'flex', alignItems: 'center' }}>
                                       <FaRegCalendarAlt style={{ marginRight: '5px' }} /> Today
                                    </div>
                                 }
                                 isSelected={selectedBadge === "Today"}
                                 onClick={() => handleBadgeClick("Today")}
                              />
                              <Badge 
                                 key="Tomorrow" 
                                 badgeText={
                                    <div style={{ display: 'flex', alignItems: 'center' }}>
                                       <FaRegCalendarAlt style={{ marginRight: '5px' }} /> Tomorrow
                                    </div>
                                 }
                                 isSelected={selectedBadge === "Tomorrow"}
                                 onClick={() => handleBadgeClick("Tomorrow")}
                              />
                              <Badge 
                                 key="Overdue" 
                                 badgeText={
                                    <div style={{ display: 'flex', alignItems: 'center' }}>
                                       <FaRegCalendarAlt style={{ marginRight: '5px' }} /> Overdue
                                    </div>
                                 }
                                 isSelected={selectedBadge === "Overdue"}
                                 onClick={() => handleBadgeClick("Overdue")}
                              />                
                              <span style={{ margin: '0 10px' }}></span>
                              {categories.map((category, index) => (
                                 <Badge 
                                    key={index} 
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
                                             item={<div dangerouslySetInnerHTML={{__html: linkify(todo.text)}} />} 
                                             checked={todo.completed} 
                                             onChange={toggleCompletion}
                                             style={{ fontSize: '5.2em' }}
                                          />
                                       )}
                                       <div style={{ fontSize: '0.8em', display: 'flex', alignItems: 'center' }}>
                                          <FaRegCalendarAlt style={{ marginRight: '5px' }}/>
                                          <span style={{ color: new Date(todo.dueDate).setHours(0,0,0,0) < new Date().setHours(0,0,0,0) ? 'red' : 'inherit' }}>
                                             {todo.dueDate ? new Date(todo.dueDate).toLocaleDateString('en-US') : "No Date"}
                                          </span>
                                          <span style={{ margin: '0 5px' }}>|</span>
                                          <span style={{ display: 'flex', alignItems: 'center' }}>
                                             <FaListAlt style={{ marginRight: '5px' }} />
                                             {todo.category}
                                          </span>
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
                                             onChange={() => toggleCompletion(todo._id)}
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
                                       <Button onClick={() => deleteTodo(todo.id)} color={cardColor}>
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
               <div className="w-full md:w-2/12 md:mr-4 mb-6 md:mb-2">
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

        } />
        </Routes>
      </Router>
   );
}

export default App;