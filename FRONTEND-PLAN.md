# FRONTEND PLAN — Tracker App UI
**For:** whoever/whatever implements this (dev or coding agent). Assumes the backend in BACKEND-PLAN.md is already built and running on `http://localhost:5000`.
**Stack:** React (Vite recommended for setup speed) + Recharts (charts) + plain `fetch`

---

## 1. Install
```
npm create vite@latest frontend -- --template react
cd frontend
npm install recharts
```
No Redux/Zustand/React Query — app is small enough that `useState` + `useEffect` + direct `fetch` calls are sufficient. (Flagging this as the assumed approach; say if you want React Query instead.)

## 2. Folder Structure
```
frontend/
├── src/
│   ├── api/
│   │   └── taskApi.js
│   ├── components/
│   │   ├── DayDropdown.jsx
│   │   ├── TaskCard.jsx
│   │   ├── TaskDetailModal.jsx
│   │   ├── StatusSelector.jsx
│   │   ├── AddTaskForm.jsx
│   │   ├── ScorecardSummary.jsx
│   │   └── AnalyticsChart.jsx
│   ├── pages/
│   │   ├── DayView.jsx
│   │   └── Dashboard.jsx
│   ├── styles/
│   │   ├── theme.css
│   │   └── global.css
│   ├── App.jsx
│   └── main.jsx
```

## 3. `api/taskApi.js` — single source of all backend calls
Export one function per backend endpoint, matching BACKEND-PLAN.md's contract exactly:
```js
export const getDays = () => fetch(`${BASE_URL}/api/days`).then(r => r.json());
export const getTasksByDay = (dayNo) => fetch(`${BASE_URL}/api/days/${dayNo}/tasks`).then(r => r.json());
export const getTaskById = (id) => fetch(`${BASE_URL}/api/tasks/${id}`).then(r => r.json());
export const updateTaskStatus = (id, status) => fetch(`${BASE_URL}/api/tasks/${id}/status`, {
  method: 'PATCH', headers: {'Content-Type':'application/json'}, body: JSON.stringify({status})
}).then(r => r.json());
export const createTask = (task) => fetch(`${BASE_URL}/api/tasks`, {
  method: 'POST', headers: {'Content-Type':'application/json'}, body: JSON.stringify(task)
}).then(r => r.json());
export const getScorecard = () => fetch(`${BASE_URL}/api/scorecard`).then(r => r.json());
export const getAnalytics = (granularity) => fetch(`${BASE_URL}/api/analytics?granularity=${granularity}`).then(r => r.json());
```
No component ever calls `fetch` directly — always through this file. `BASE_URL = 'http://localhost:5000'` as a constant at the top.

## 4. Routing
Two pages, simplest possible router (React Router, 2 routes):
- `/` → `DayView`
- `/dashboard` → `Dashboard`
A persistent nav bar (2 links) sits above both.

## 5. Component Specs

### `DayDropdown`
- Props: `onSelect(dayNo)`
- On mount: calls `getDays()`, populates a `<select>`
- Label each option using `phase`/`day_type` from the response, not just the bare number, so it's readable
- `onChange` fires `onSelect`

### `TaskCard`
- Props: `task` (object), `onClick`, `onStatusChange`
- Displays: `category`, `deliverable` (truncated if long), `estimated_hours`
- Contains a `StatusSelector` inline
- Clicking the card body (not the status selector) triggers `onClick` → opens `TaskDetailModal`

### `TaskDetailModal`
- Props: `task`, `onClose`
- Shows every field from the row: full `deliverable`, `notes`, all point values, `day_total_hours`, `completed_at`
- Simple overlay + close button — no need for a modal library, a fixed-position `div` with a backdrop is enough

### `StatusSelector`
- Props: `currentStatus`, `taskId`, `onChange`
- 4 options rendered as buttons or a small segmented control: Not Started / On Time / Late / Missed
- On click: immediately calls `updateTaskStatus(taskId, newStatus)`, then calls parent's `onChange` with the server's returned row (**not** just the clicked value — reconcile with what the server actually saved, this is the persistence guarantee in practice)

### `AddTaskForm`
- Lives on the Dashboard page
- Fields: `day_no`, `week_no`, `phase`, `day_type`, `tier`, `category`, `task_type`, `deliverable`, `estimated_hours`, `points_ontime`, `points_late`, `points_missed`, `notes`
- `day_no`/`week_no` marked required in the UI (matches backend validation)
- On submit: `createTask(formData)`, clear the form, show a brief success message
- No redirect needed — this stays on the Dashboard

### `ScorecardSummary`
- Props: none (fetches its own data via `getScorecard()` on mount)
- Displays: total earned / total possible, percentage as a progress bar, and the per-week breakdown as a small table beneath it

### `AnalyticsChart`
- Internal state: `granularity` (default `'day'`)
- Three toggle buttons: Day / Week / Month — clicking sets `granularity` and re-fetches via `getAnalytics(granularity)`
- Renders a Recharts `<LineChart>` with `earned` as the line, `label` on the X axis
- Recharts animates line/axis changes by default when the `data` prop changes — no extra transition library needed; just don't disable `isAnimationActive`

## 6. Page Specs

### `DayView`
Layout top to bottom: `DayDropdown` → grid of `TaskCard`s for the selected day → `TaskDetailModal` (conditionally rendered when a card is clicked)
State: `selectedDay`, `tasks` (array), `selectedTask` (for modal, or `null`)

### `Dashboard`
Layout top to bottom: `ScorecardSummary` → `AnalyticsChart` → `AddTaskForm`
This is the one screen holding all three "monitor progress" features together, per your requirement.

## 7. Persistence Behavior (must hold true, verify explicitly)
- No page holds status data that didn't come from a fetch this session
- On every mount, always re-fetch from the API — never seed from `localStorage` or hardcoded arrays
- After a `StatusSelector` change, trust the server's response, not the optimistic local guess, when updating the card
- Refreshing the browser at any point must show the exact same state as before the refresh, because it's all re-read from Postgres

## 8. Styling — `theme.css`
Font decision: **Cormorant Upright** (Google Font, user-specified). Add to `index.html`:
```html
<link href="https://fonts.googleapis.com/css2?family=Cormorant+Upright&family=Inter:wght@400;500;600&display=swap" rel="stylesheet">
```
```css
:root {
  --bg-primary: #0d0d0d;
  --bg-card: #1a1a1a;
  --border: #2c2c2c;
  --text-primary: #e8e8e8;
  --text-secondary: #9a9a9a;
  --accent: #ffffff;
  --font-display: 'Cormorant Upright', serif;   /* headings / app title only */
  --font-body: 'Inter', 'Helvetica Neue', sans-serif;  /* cards, data, forms */
}
body { background: var(--bg-primary); color: var(--text-primary); font-family: var(--font-body); }
h1, h2, .app-title { font-family: var(--font-display); }
```
Script font (`--font-display`) is scoped to headings/title only — full-app script text would hurt readability on a data-heavy tracker. `Inter` picked as a neutral, clean sans-serif pairing; swap if you have a preference.
Rules to actually enforce while building:
- One accent color visible at a time (active states, the chart line) — never multiple competing highlight colors
- Cards use a 1px `--border` outline, no drop shadows
- All interactive elements: `transition: all 0.2s ease`
- Favor padding/whitespace over dense grids — this is a personal tracker, not a data-dense admin panel

## 9. Build Order
1. `api/taskApi.js` first, test each function in the browser console against the running backend
2. `DayDropdown` + `DayView` skeleton (no styling yet) — confirm data flows end to end
3. `TaskCard` + `StatusSelector` — confirm a PATCH actually persists (refresh the page, check it stuck)
4. `TaskDetailModal`
5. `ScorecardSummary`
6. `AnalyticsChart` — confirm all 3 granularities return sensible chart shapes
7. `AddTaskForm` — confirm a newly added day appears in `DayDropdown` afterward
8. Styling pass (`theme.css`) last, once every piece above works unstyled

## 10. Acceptance Checklist
- [ ] Selecting a day from the dropdown shows only that day's cards
- [ ] Clicking a card opens the modal with full row detail
- [ ] Changing a task's status updates instantly and survives a page refresh
- [ ] Dashboard shows a live score that changes when you check off tasks
- [ ] Switching Day/Week/Month on the chart updates the line smoothly, no flash of blank chart
- [ ] Adding a task via the form makes it appear when you select that day (including day_no > 84)
