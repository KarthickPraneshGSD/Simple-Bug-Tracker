import React, { useEffect, useState } from 'react';
import axios from 'axios';

function App() {
  const [bugs, setBugs] = useState([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  useEffect(() => {
    fetchBugs();
  }, []);

  const fetchBugs = () => {
    axios.get('/api/bugs')
      .then(res => setBugs(res.data))
      .catch(err => console.error(err));
  };

  const handleAddBug = () => {
    axios.post('/api/bugs', {
      title,
      description,
      status: 'open'
    }).then(() => {
      setTitle('');
      setDescription('');
      fetchBugs();
    });
  };

  const handleToggleStatus = (id, currentStatus) => {
    const newStatus = currentStatus === 'open' ? 'closed' : 'open';
    axios.put(`/api/bugs/${id}`, { status: newStatus })
      .then(() => fetchBugs());
  };

  const handleDeleteBug = (id) => {
    axios.delete(`/api/bugs/${id}`)
      .then(() => fetchBugs());
  };

  return (
    <div style={{ padding: '2rem' }}>
      <h1>🐞 Bug Tracker</h1>

      <input
        type="text"
        placeholder="Bug title"
        value={title}
        onChange={e => setTitle(e.target.value)}
        style={{ marginRight: '10px' }}
      />
      <input
        type="text"
        placeholder="Bug description"
        value={description}
        onChange={e => setDescription(e.target.value)}
        style={{ marginRight: '10px' }}
      />
      <button onClick={handleAddBug}>Add Bug</button>

      <ul style={{ marginTop: '2rem' }}>
        {bugs.map(bug => (
          <li key={bug.id}>
            <strong>{bug.title}</strong>: {bug.description} ({bug.status})
            <button
              onClick={() => handleToggleStatus(bug.id, bug.status)}
              style={{ marginLeft: '10px' }}
            >
              Mark as {bug.status === 'open' ? 'Closed' : 'Open'}
            </button>
            <button
              onClick={() => handleDeleteBug(bug.id)}
              style={{ marginLeft: '10px', color: 'red' }}
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
