import { useState } from "react";
import { v4 as uuidv4 } from 'uuid';

export default function App(){
  const [taskList, setTaskList] = useState([
    { id: uuidv4(), text: "Learn React", completed: false},
    { id: uuidv4(), text: "Build a To-Do list", completed: false},
    { id: uuidv4(), text: "Practice more", completed: false}
  ])
  const [newTask, setNewtask] = useState("");
  const [filter, setFilter] = useState('all'); // 'all', 'completed', 'uncompleted'
  const [editTextId, setEditTextId] = useState(null);
  const [editText, setEditText] = useState("");

  const filterTasks = taskList.filter(task => {
    if (filter === 'completed'){
      return task.completed;
    }else if (filter === 'uncompleted'){
      return !task.completed;
    }else{
      return true;
    }
  })

  function handleNewTask(e){
    setNewtask(e.target.value);
  }

  const handleAddNewTask = () =>{
    if (newTask.trim()){
      const newTaskObject = {
        id: uuidv4(),
        text: newTask,
        completed: false
      }
      const newTaskList = [...taskList, newTaskObject];
      setTaskList(newTaskList);
      setNewtask("");
    }
  }

  function handleTaskCompletion(id){
    const updatedtask = taskList.map(task => task.id === id ? {...task, completed: !task.completed} : task);
    setTaskList(updatedtask);
  }

  function handleRemoveTask(id){
    const updatedtask = taskList.filter(task => task.id !== id);
    setTaskList(updatedtask);
  }

  function handleEditingTask(id, text){
    setEditTextId(id);
    setEditText(text);
  }

  function handleSettingEditedTask(e){
    setEditText(e.target.value);
  }

  function handleSaveEditedTask(){
    const updatedTaskList = taskList.map(task => task.id === editTextId ? (
      {...task, text: editText}
    ) : task);
    setTaskList(updatedTaskList);
    handleCancelEditedTask();
  }

  function handleCancelEditedTask(){
    setEditTextId(null);
    setEditText('');
  }

  return (
    <div className="App">
      <h1 className="Heading">To-Do List</h1>
      
      <input className="InputTask" type="text" placeholder="Add To-Do item" value={newTask} onChange={handleNewTask}/>
      <button className="SubmitButton" onClick={handleAddNewTask}>Submit</button>
      <div className="filterButtonSection">
        <button className={filter === 'all' ? "ActiveFilter" : ""} onClick = {() => setFilter('all')}>All</button>
        <button className={filter === 'completed' ? "ActiveFilter" : ""} onClick = {() => setFilter('completed')}>Completed</button>
        <button className={filter === 'uncompleted' ? "ActiveFilter" : ""} onClick = {() => setFilter('uncompleted')}>Uncompleted</button>
      </div>
      <ul>
        {filterTasks.map(task => task.id === editTextId ? (
              <li key = {task.id}>
                <input className="edit-task" type="text" value={editText} onChange={handleSettingEditedTask}/>
                <div className="list-buttons">
                  <button className="edit-button" onClick={handleSaveEditedTask}>Save</button>
                  <button className="remove-button" onClick={handleCancelEditedTask}>Cancel</button>
                </div>
              </li>
            ):(
              <li key = {task.id}>
                <div>
                  <input type="checkbox" checked={task.completed} onChange={() => handleTaskCompletion(task.id)} readOnly/>
                  <span style={{ textDecoration: task.completed ? "line-through" : "none" }}>
                    {task.text}
                  </span>
                </div>
                <div className="list-buttons">
                  <button className="edit-button" onClick={() => handleEditingTask(task.id, task.text)}>Edit</button>
                  <button className="remove-button" onClick={() => handleRemoveTask(task.id)}>Remove</button>
                </div>
              </li>
            )
        )}
      </ul>
    </div>
  );
}