import { useEffect, useState, useRef } from "react";
import { v4 as uuidv4 } from 'uuid';

export default function App(){
  const [taskList, setTaskList] = useState(() => {
    const savedTaskList = localStorage.getItem('taskList');
    return savedTaskList ? JSON.parse(savedTaskList) : [];
  });

  useEffect(()=>{
    localStorage.setItem('taskList', JSON.stringify(taskList))
  }, [taskList])
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
    setTimeout(() => {
      if (editInputRef.current) {
        editInputRef.current.focus();
        editInputRef.current.select();
      }
    }, 0);
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

  const editInputRef = useRef(null);

  return (
    <div className="App">
      <h1 className="Heading">To-Do List</h1>
      
      <input className="InputTask" type="text" placeholder="Add To-Do item" value={newTask} onChange={handleNewTask} onKeyDown={(e) => e.key === 'Enter' && handleAddNewTask(e)}/>
      <button className="SubmitButton" onClick={handleAddNewTask}>Submit</button>
      <div className="filterButtonSection">
        <button className={filter === 'all' ? "ActiveFilter" : ""} onClick = {() => setFilter('all')}>All</button>
        <button className={filter === 'completed' ? "ActiveFilter" : ""} onClick = {() => setFilter('completed')}>Completed</button>
        <button className={filter === 'uncompleted' ? "ActiveFilter" : ""} onClick = {() => setFilter('uncompleted')}>Uncompleted</button>
      </div>
      <ul>
        {filterTasks.map(task => task.id === editTextId ? (
              <li key = {task.id}>
                <input ref={editInputRef} className="edit-task" type="text" value={editText} onChange={handleSettingEditedTask} onKeyDown={(e) => e.key === 'Enter' && handleSaveEditedTask()}/>
                <div className="list-buttons">
                  <button className="edit-button" onClick={handleSaveEditedTask}>Save</button>
                  <button className="remove-button" onClick={handleCancelEditedTask}>Cancel</button>
                </div>
              </li>
            ):(
              <li key = {task.id}>
                <div>
                  <input type="checkbox" checked={task.completed} onChange={() => handleTaskCompletion(task.id)} onKeyDown={(e) => e.key === 'Enter' && handleTaskCompletion(task.id)} readOnly/>
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