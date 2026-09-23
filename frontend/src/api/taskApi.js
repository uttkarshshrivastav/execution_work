const BASE_URL = 'http://localhost:5000';

async function handleResponse(response) {
  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Request failed' }));
    throw new Error(error.error || `HTTP ${response.status}`);
  }
  return response.json();
}

export const getDays = () =>
  fetch(`${BASE_URL}/api/days`).then(handleResponse);

export const getTasksByDay = (dayNo) =>
  fetch(`${BASE_URL}/api/days/${dayNo}/tasks`).then(handleResponse);

export const getTaskById = (id) =>
  fetch(`${BASE_URL}/api/tasks/${id}`).then(handleResponse);

export const updateTaskStatus = (id, status) =>
  fetch(`${BASE_URL}/api/tasks/${id}/status`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ status })
  }).then(handleResponse);

export const createTask = (task) =>
  fetch(`${BASE_URL}/api/tasks`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(task)
  }).then(handleResponse);

export const getScorecard = () =>
  fetch(`${BASE_URL}/api/scorecard`).then(handleResponse);

export const getAnalytics = (granularity) =>
  fetch(`${BASE_URL}/api/analytics?granularity=${granularity}`).then(handleResponse);

export const updateTask = (id, task) =>
  fetch(`${BASE_URL}/api/tasks/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(task)
  }).then(handleResponse);

export const getDay = (dayNo) =>
  fetch(`${BASE_URL}/api/days/${dayNo}`).then(handleResponse);

export const updateDayNotes = (dayNo, day_notes) =>
  fetch(`${BASE_URL}/api/days/${dayNo}/notes`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ day_notes })
  }).then(handleResponse);

export const createDay = (day) =>
  fetch(`${BASE_URL}/api/days`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(day)
  }).then(handleResponse);

export const deleteTask = (id) =>
  fetch(`${BASE_URL}/api/tasks/${id}`, {
    method: 'DELETE'
  }).then(handleResponse);

export const deleteDay = (dayNo) =>
  fetch(`${BASE_URL}/api/days/${dayNo}`, {
    method: 'DELETE'
  }).then(handleResponse);