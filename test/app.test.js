const { test, before, after } = require('node:test');
const assert = require('node:assert');
const { createApp } = require('../src/app');

let server;
let base;

before(async () => {
  server = createApp().listen(0);
  await new Promise((resolve) => server.once('listening', resolve));
  base = `http://127.0.0.1:${server.address().port}`;
});

after(() => {
  if (server.closeAllConnections) server.closeAllConnections();
  server.close();
});

test('GET /health returns status ok', async () => {
  const res = await fetch(`${base}/health`);
  assert.strictEqual(res.status, 200);
  const body = await res.json();
  assert.strictEqual(body.status, 'ok');
});

test('GET /tasks returns the two sample tasks', async () => {
  const res = await fetch(`${base}/tasks`);
  assert.strictEqual(res.status, 200);
  const body = await res.json();
  assert.ok(body.length >= 2);
  assert.strictEqual(body[0].title, 'Write a workflow');
});

test('POST /tasks creates a task', async () => {
  const res = await fetch(`${base}/tasks`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ title: 'Ship it' }),
  });
  assert.strictEqual(res.status, 201);
  const task = await res.json();
  assert.strictEqual(task.title, 'Ship it');
  assert.strictEqual(task.done, false);
});

test('POST /tasks without a title returns 400', async () => {
  const res = await fetch(`${base}/tasks`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({}),
  });
  assert.strictEqual(res.status, 400);
});
