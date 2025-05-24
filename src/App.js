import React, { useEffect, useState } from 'react';
import './App.css';

function App() {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState('');

  useEffect(() => {
    fetch('http://localhost:8000/api/tasks/')
      .then(res => res.json())
      .then(data => setTasks(data));
  }, []);

  const addTask = (e) => {
    e.preventDefault();
    if (!newTask.trim()) return;
    fetch('http://localhost:8000/api/tasks/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title: newTask, completed: false })
    })
      .then(res => res.json())
      .then(task => setTasks([task, ...tasks]));
    setNewTask('');
  };

  const toggleComplete = (task) => {
    fetch(`http://localhost:8000/api/tasks/${task.id}/`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...task, completed: !task.completed })
    })
      .then(res => res.json())
      .then(updated => setTasks(tasks.map(t => t.id === updated.id ? updated : t)));
  };

  const deleteTask = (id) => {
    fetch(`http://localhost:8000/api/tasks/${id}/`, { method: 'DELETE' })
      .then(() => setTasks(tasks.filter(t => t.id !== id)));
  };

  return (
    <div className="App">
      <h1>Todo List</h1>
      <form onSubmit={addTask} className="add-task-form">
        <input
          value={newTask}
          onChange={e => setNewTask(e.target.value)}
          placeholder="Add a new task"
        />
        <button type="submit">Add</button>
      </form>
      <ul className="task-list">
        {tasks.map(task => (
          <li key={task.id} className={task.completed ? 'completed' : ''}>
            <span onClick={() => toggleComplete(task)}>{task.title}</span>
            <button onClick={() => deleteTask(task.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
