# Tracker App — Run Instructions

## Prerequisites

| Tool | Version | Install |
|------|---------|---------|
| Node.js | 18+ LTS | [nodejs.org](https://nodejs.org/) |
| npm | 9+ | Included with Node.js |
| PostgreSQL | 14+ | [postgresql.org](https://www.postgresql.org/download/) |

---

## Project Structure

```
execution_work/
├── backend/          # Node.js + Express + Sequelize API
├── frontend/         # React + Vite SPA
├── handoff.md        # API documentation
└── RUN.md            # This file
```

---

## Backend Setup

### 1. Create PostgreSQL Database

```bash
# Windows (adjust path if needed)
"C:\Program Files\PostgreSQL\18\bin\psql.exe" -U postgres -c "CREATE DATABASE daily_execution_tasks;"

# macOS / Linux
psql -U postgres -c "CREATE DATABASE daily_execution_tasks;"
```

### 2. Configure Environment

File: `backend/.env` (already exists)

```env
DB_HOST=localhost
DB_PORT=5432
DB_NAME=daily_execution_tasks
DB_USER=postgres
DB_PASSWORD=shriVastav@123
PORT=5000
```

> **Note**: Update `DB_PASSWORD` if your PostgreSQL password differs.

### 3. Install Dependencies

```bash
cd backend
npm install
```

### 4. Create Tables & Import Data

```bash
# Creates tables and imports 157 tasks from CSV
npm run import
```

Output:
```
◇ injected env (6) from .env
Inserted 157 rows (CSV had 157 rows)
```

### 5. Start Backend Server

| Mode | Command | URL |
|------|---------|-----|
| Development (auto-reload) | `npm run dev` | http://localhost:5000 |
| Production | `npm start` | http://localhost:5000 |

**Expected logs:**
```
◇ injected env (6) from .env
Database connection established successfully.
Server running on port 5000
```

### 6. Verify Backend Endpoints

```bash
# List all days
curl http://localhost:5000/api/days

# Get tasks for day 1
curl http://localhost:5000/api/days/1/tasks

# Scorecard
curl http://localhost:5000/api/scorecard

# Analytics (week granularity)
curl "http://localhost:5000/api/analytics?granularity=week"
```

---

## Frontend Setup

### 1. Install Dependencies

```bash
cd frontend
npm install
```

### 2. Start Development Server

```bash
npm run dev
```

**Output:**
```
VITE v5.x.x  ready in xxx ms

➜  Local:   http://localhost:5173 (or 5174/5175 if busy)
➜  Network: use --host to expose
```

### 3. Open in Browser

Navigate to the printed Local URL (e.g., `http://localhost:5175`)

---

## Quick Start (Both Together)

### Terminal 1 — Backend
```bash
cd execution_work/backend
npm run dev
```

### Terminal 2 — Frontend
```bash
cd execution_work/frontend
npm run dev
```

---

## Available npm Scripts

### Backend (`backend/package.json`)

| Script | Description |
|--------|-------------|
| `npm run dev` | Start with nodemon (auto-reload on changes) |
| `npm start` | Start production server |
| `npm run import` | Import CSV data into PostgreSQL (run once) |

### Frontend (`frontend/package.json`)

| Script | Description |
|--------|-------------|
| `npm run dev` | Start Vite dev server with HMR |
| `npm run build` | Build for production (`dist/` folder) |
| `npm run preview` | Preview production build locally |

---

## API Base URLs

| Environment | Backend | Frontend |
|-------------|---------|----------|
| Development | `http://localhost:5000/api` | `http://localhost:5173` (or 5174/5175) |
| Production | Configure `BASE_URL` in `frontend/src/api/taskApi.js` | Deploy `dist/` to static host |

---

## Troubleshooting

### Backend Issues

| Error | Cause | Fix |
|-------|-------|-----|
| `password authentication failed` | Wrong DB password | Update `DB_PASSWORD` in `backend/.env` |
| `relation "tasks" does not exist` | Tables not created | Run `npm run import` |
| `ECONNREFUSED 127.0.0.1:5432` | PostgreSQL not running | Start PostgreSQL service |
| `Port 5000 in use` | Another process | `taskkill /F /IM node.exe` (Windows) or `pkill node` (macOS/Linux) |

### Frontend Issues

| Error | Cause | Fix |
|-------|-------|-----|
| `Port 5173 in use` | Another Vite instance | Vite auto-picks next port (5174, 5175...) |
| `Failed to fetch` | Backend not running | Start backend first, check `BASE_URL` in `taskApi.js` |
| CORS errors | Backend CORS misconfig | Backend has `app.use(cors())` — ensure backend running |

### Database Reset (Full Clean)

```bash
# Drop and recreate database
"C:\Program Files\PostgreSQL\18\bin\psql.exe" -U postgres -c "DROP DATABASE IF EXISTS daily_execution_tasks;"
"C:\Program Files\PostgreSQL\18\bin\psql.exe" -U postgres -c "CREATE DATABASE daily_execution_tasks;"

# Re-import
cd backend
npm run import
```

---

## Key Endpoints Reference

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/days` | All days (for dropdown) |
| `GET` | `/api/days/:dayNo` | Single day with notes |
| `POST` | `/api/days` | Create new day |
| `PATCH` | `/api/days/:dayNo/notes` | Update day notes |
| `GET` | `/api/days/:dayNo/tasks` | Tasks for a day |
| `GET` | `/api/tasks/:id` | Single task |
| `POST` | `/api/tasks` | Create task (auto-creates day) |
| `PATCH` | `/api/tasks/:id` | Update task fields |
| `PATCH` | `/api/tasks/:id/status` | Update status only |
| `DELETE` | `/api/tasks/:id` | Delete task |
| `GET` | `/api/scorecard` | Overall + weekly scores |
| `GET` | `/api/analytics?granularity=day\|week\|month` | Chart data |

---

## Features Summary

### Backend
- ✅ PostgreSQL + Sequelize ORM
- ✅ RESTful API with validation
- ✅ CSV import (157 pre-loaded tasks)
- ✅ Day-level notes (`days.day_notes`)
- ✅ Task CRUD + status workflow
- ✅ Scorecard & analytics endpoints

### Frontend
- ✅ React 18 + Vite
- ✅ Day View: select day → view tasks
- ✅ Task cards: status buttons, Edit modal, Delete (trash icon)
- ✅ Add Task modal (from day panel)
- ✅ Add Day modal (from top header)
- ✅ Day Notes textarea + Save
- ✅ Dashboard: Scorecard + Analytics charts (recharts)
- ✅ Responsive CSS variables theming

---

## Support

For issues, check:
1. Backend logs (terminal running `npm run dev`)
2. Browser DevTools Console (frontend errors)
3. Network tab (failed API calls)
4. PostgreSQL logs (connection issues)