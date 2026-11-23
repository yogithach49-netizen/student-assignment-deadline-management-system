# Student Assignment & Deadline Management System

A Node.js/Express implementation based on the system design in Assignment #3. It includes course and assignment management, a dashboard summary, reminder records, and a Smart Study Planner.

## Requirements
- Node.js 18 or newer
- npm

## Install and run (Windows PowerShell)
1. Extract the ZIP file.
2. Open the extracted folder in VS Code.
3. Open Terminal → New Terminal.
4. Run:

```powershell
npm install
npm start
```

5. Open `http://localhost:3000/health`. You should see `{"status":"ok"}`.

## Run automated tests

```powershell
npm test
```

Run only unit or component tests:

```powershell
npm run test:unit
npm run test:component
```

The test suite contains 12 unit tests and 6 component tests (18 total).

## API overview

All routes except `/health`, `/api/auth/register`, and `/api/auth/login` require the `x-student-id` request header. For this coursework implementation, the header represents the authenticated student identity.

| Method | Endpoint | Purpose |
|---|---|---|
| POST | `/api/auth/register` | Create a student account |
| POST | `/api/auth/login` | Demo login |
| GET / POST | `/api/courses` | List or create courses |
| GET / POST | `/api/assignments` | List or create assignments |
| PATCH / DELETE | `/api/assignments/:id` | Update or delete an assignment |
| GET | `/api/dashboard` | Dashboard counts and upcoming work |
| PUT | `/api/plan/availability` | Set available study hours by date |
| GET | `/api/plan/today` | Generate the 14-day study plan |
| PATCH | `/api/plan/items/:id` | Mark a planned session complete |

Example assignment JSON:

```json
{
  "title": "Cloud Computing Lab",
  "courseId": "1",
  "dueDate": "2030-12-01T23:59:00.000Z",
  "priority": "High",
  "status": "Pending",
  "estimatedHours": 3
}
```

## Important implementation notes and limitations
- This is a coursework/testing implementation. Data is held in memory and resets when the server restarts.
- The reminder feature creates reminder records; an actual timed background scheduler and email delivery are not implemented.
- Authentication is simplified for local component testing. The `x-student-id` header is not production authentication.
- The registration password hash is a demonstration placeholder, not production password hashing. Do not use real passwords.
- The system uses an in-memory store instead of the relational database shown in Assignment #3.

## Project structure

```text
src/
  app.js
  server.js
  data/store.js
  middleware/auth.js
  routes/index.js
  services/
  utils/errors.js
  validators/assignmentValidator.js
tests/
  helpers.js
  unit/
  component/
```
