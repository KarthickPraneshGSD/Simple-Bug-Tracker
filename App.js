import React, { useEffect, useState } from 'react';
import axios from 'axios';

function App() {
  const [bugs, setBugs] = useState([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  useEffect(() => {
  axios.get('/api/bugs')
    .then(res => setBugs(res.data))
    .catch(err => console.error(err));
}, []);

const handleAddBug = () => {
  axios.post('/api/bugs', {
    title,
    description,
    status: 'open'
  }).then(() => {
    setTitle('');
    setDescription('');
    return axios.get('/api/bugs');
  }).then(res => setBugs(res.data));
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

      <ul>
        {bugs.map(bug => (
          <li key={bug.id}>
            <strong>{bug.title}</strong>: {bug.description} ({bug.status})
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
