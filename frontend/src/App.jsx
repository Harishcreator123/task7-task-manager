
import { useEffect, useState } from 'react';
import './App.css';

const API = 'https://task7-task-manager-api.onrender.com/api/tasks';

function App() {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState('');
  const [priority, setPriority] = useState('Medium');
  const [filter, setFilter] = useState('All');

  const loadTasks = async () => {
    try {
      const response = await fetch(API);
      if (!response.ok) throw new Error();
      setTasks(await response.json());
    } catch {
      alert('Could not load tasks. Check the backend and MongoDB.');
    }
  };

  useEffect(() => {
    loadTasks();
  }, []);

  const addTask = async (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    const response = await fetch(API, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, priority })
    });

    if (response.ok) {
      setTitle('');
      loadTasks();
    } else {
      alert('Could not add task.');
    }
  };

  const updateStatus = async (id, status) => {
    const response = await fetch(`${API}/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status })
    });
    if (response.ok) loadTasks();
  };

  const deleteTask = async (id) => {
    const response = await fetch(`${API}/${id}`, { method: 'DELETE' });
    if (response.ok) loadTasks();
  };

  const filtered = tasks.filter(t =>
    filter === 'All' || t.status === filter
  );

  return (
    <div className="app">
      <aside className="sidebar">
        <h2>Task<span>Flow.</span></h2>
        <p>WORKSPACE</p>
        <a className="active">▦ Dashboard</a>
        <a>✓ My Tasks</a>
        <a>⚙ Settings</a>
        <div className="sidebar-bottom">Task Manager · 2026</div>
      </aside>

      <main className="main">
        <header>
          <div>
            <p className="eyebrow">YOUR WORKSPACE</p>
            <h1>Task Dashboard</h1>
            <p>Organize your work and get things done.</p>
          </div>
          <span className="avatar">HK</span>
        </header>

        <section className="stats">
          {[
            ['Total Tasks', tasks.length],
            ['To Do', tasks.filter(t => t.status === 'To Do').length],
            ['In Progress', tasks.filter(t => t.status === 'In Progress').length],
            ['Completed', tasks.filter(t => t.status === 'Completed').length]
          ].map(([label, count]) => (
            <div className="stat" key={label}>
              <p>{label}</p><h2>{count}</h2>
            </div>
          ))}
        </section>

        <section className="task-section">
          <h2>My Tasks</h2>
          <p>Manage all your activities in one place.</p>

          <form className="task-form" onSubmit={addTask}>
            <input
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder="Enter a new task..."
              required
            />
            <select value={priority} onChange={e => setPriority(e.target.value)}>
              <option>Low</option>
              <option>Medium</option>
              <option>High</option>
            </select>
            <button type="submit">+ Add Task</button>
          </form>

          <div className="filters">
            {['All', 'To Do', 'In Progress', 'Completed'].map(item => (
              <button
                key={item}
                className={filter === item ? 'selected' : ''}
                onClick={() => setFilter(item)}
              >
                {item}
              </button>
            ))}
          </div>

          <div className="task-list">
            {filtered.map(task => (
              <article className="task-card" key={task._id}>
                <div className="task-info">
                  <h3>{task.title}</h3>
                  <span className={`priority ${task.priority.toLowerCase()}`}>
                    {task.priority} Priority
                  </span>
                </div>
                <div className="task-actions">
                  <select
                    value={task.status}
                    onChange={e => updateStatus(task._id, e.target.value)}
                  >
                    <option>To Do</option>
                    <option>In Progress</option>
                    <option>Completed</option>
                  </select>
                  <button className="delete" onClick={() => deleteTask(task._id)}>
                    Delete
                  </button>
                </div>
              </article>
            ))}
            {filtered.length === 0 && <p>No tasks found.</p>}
          </div>
        </section>
      </main>
    </div>
  );
}

export default App;
