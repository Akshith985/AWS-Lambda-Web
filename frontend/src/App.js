import React, { useState, useEffect } from 'react';
import axios from 'axios';

// Bypass GitHub Proxy by using the internal loopback address
const API_URL = "http://127.0.0.1:4566/2015-03-31/functions/TaskHandler/invocations";

function App() {
  const [tasks, setTasks] = useState([]);
  const [input, setInput] = useState('');

  const fetchTasks = async () => {
    try {
      const response = await axios.get(API_URL);
      setTasks(Array.isArray(response.data) ? response.data : []);
    } catch (err) {
      console.error("Fetch Error:", err);
    }
  };

  const addTask = async () => {
    if (!input) return;
    try {
      await axios.post(API_URL, { task: input });
      setInput('');
      fetchTasks();
    } catch (err) {
      console.error("Add Error:", err);
    }
  };

  useEffect(() => { fetchTasks(); }, []);

  return (
    <div style={{ padding: '20px' }}>
      <h1>Task Manager</h1>
      <input value={input} onChange={(e) => setInput(e.target.value)} placeholder="New task..." />
      <button onClick={addTask}>Add Task</button>
      <ul>
        {tasks.map(t => <li key={t.id}>{t.task}</li>)}
      </ul>
    </div>
  );
}

export default App;