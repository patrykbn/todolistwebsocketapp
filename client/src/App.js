import React, { useEffect, useState } from 'react';
import io from 'socket.io-client';
import './App.css';

const socket = io('http://localhost:8000');

const App = () => {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState(''); 

  const renderTasks = () => {
    return tasks.map((task) => (
      <li key={task.id} className="task">
        {task.name}
        <button
          className="btn btn--red"
          onClick={() => removeTask(task.id)}
        >
          Remove
        </button>
      </li>
    ));
  };

  useEffect(() => {
    socket.on('updateData', (serverTasks) => {
      setTasks(serverTasks);
    });

    socket.on('addTask', (task) => {
      setTasks((prevTasks) => [...prevTasks, task]);
    });

    socket.on('removeTask', (taskId) => {
      setTasks((prevTasks) => prevTasks.filter((task) => task.id !== taskId));
    });

    return () => {
      socket.off('updateData');
      socket.off('addTask');
      socket.off('removeTask');
    };
  }, []);

  const addTask = (event) => {
    event.preventDefault();
    if (newTask.trim() === '') {
      alert('Task cannot be empty...');
      return;
    }

    const task = { id: Date.now(), name: newTask };
    socket.emit('addTask', task);
    setNewTask('');
  };

  const removeTask = (taskId) => {
    socket.emit('removeTask', taskId);
  };

  return (
    <div className="App">
      <header>
        <h1>ToDoList.app</h1>
      </header>

      <section className="tasks-section">
        <h2>Tasks</h2>

        <ul className="tasks-section__list">
          {renderTasks()}
        </ul>

        <form id="add-task-form" onSubmit={addTask}>
          <input
            className="text-input"
            autoComplete="off"
            type="text"
            placeholder="Type your description"
            value={newTask}
            onChange={(e) => setNewTask(e.target.value)}
          />
          <button className="btn" type="submit">
            Add
          </button>
        </form>
      </section>
    </div>
  );
};

export default App;
