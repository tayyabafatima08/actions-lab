const express = require('express');

function createApp() {
  const app = express();
  app.use(express.json());

  // In-memory data: it is reset every time the app starts.
  const tasks = [
    { id: 1, title: 'Write a workflow', done: true },
    { id: 2, title: 'Run the tests', done: false },
  ];
  let nextId = 3;

  app.get('/health', (req, res) => {
    res.json({ status: 'down' });
  });

  app.get('/tasks', (req, res) => {
    res.json(tasks);
  });

  app.post('/tasks', (req, res) => {
    const title = typeof req.body.title === 'string' ? req.body.title.trim() : '';
    if (!title) {
      return res.status(400).json({ error: 'Title is required.' });
    }
    const task = { id: nextId++, title, done: false };
    tasks.push(task);
    res.status(201).json(task);
  });

  return app;
}

module.exports = { createApp };
