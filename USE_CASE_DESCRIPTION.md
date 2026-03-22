# TAKE-HOME TECHNICAL ASSESSMENT  
**Full Stack Engineer — 3+ Years Experience**  
**Project: Kanban Task Management Board**

---

## Tech Stack
Node.js · React · PostgreSQL  

## Time Allotment  
1 day (approximately 4–5 hours of focused work)

## Submission  
GitHub repository link — shared before the on-prem review

## Review Format  
On-premises code walkthrough and deep-dive discussion

---

## 1. Project Overview
You are tasked with building a Kanban-style task management board — a simplified, self-contained web application that allows a user to organize tasks visually across columns representing different workflow stages.

This is a full-stack project. You are expected to design and implement the entire system: database schema, backend API, and frontend UI. We are looking for production-quality thinking, not just working code.

The goal is to see how you make architectural decisions, handle real-world edge cases, and write code that a team could maintain and extend.

---

## 2. Required Tech Stack
You must use the following technologies. You are free to choose libraries and tooling within each layer, but the core stack is fixed.

| Layer      | Requirement |
|------------|------------|
| Frontend   | React (hooks-based, functional components) |
| Backend    | Node.js with Express (or Fastify) |
| Database   | PostgreSQL with raw SQL or a lightweight ORM (e.g., Knex, Prisma) |
| Styling    | Your choice — CSS modules, Tailwind, styled-components, etc. |
| Auth       | JWT-based authentication (no third-party OAuth required) |
| API Style  | RESTful JSON API |

**Note:** Do not use Firebase, Supabase, or any BaaS platforms. The backend must be custom-built.

---

## 3. Functional Requirements

### 3.1 Authentication
- User registration with email and password  
- User login returning a JWT token  
- Protected routes — unauthenticated users cannot access the board  
- Logout functionality (client-side token removal)

### 3.2 Board & Columns
- A user should see their personal Kanban board upon login  
- Default columns: The board must have at least three default columns:
  - To Do  
  - In Progress  
  - Done  
- Column names should be editable inline  
- Users should be able to add new columns to the board  

### 3.3 Task Cards
- Users can create a task card with a title and optional description  
- Tasks belong to a column and are ordered within it  
- Users can edit the title and description of any task  
- Users can delete a task (with a confirmation prompt)  
- Tasks can be moved between columns via drag-and-drop  
- Task order within a column must persist across page refreshes — order is stored in the database  

### 3.4 UX Details
- The board should load without requiring a full page refresh when tasks are moved  
- Appropriate loading and error states should be visible to the user  
- Empty column states should be handled gracefully (e.g., a prompt to add a card)

---

## 4. Technical & Code Quality Requirements

### 4.1 Backend
- RESTful API design with clear and consistent endpoint naming  
- Input validation on all API endpoints (never trust client input)  
- Proper HTTP status codes used throughout (200, 201, 400, 401, 404, 500)  
- JWT verification middleware applied to all protected routes  
- Passwords must be hashed using bcrypt — never stored in plain text  
- No sensitive values hardcoded — use environment variables (.env)

### 4.2 Database
- A clean, normalized PostgreSQL schema with appropriate primary and foreign keys  
- Migrations provided (SQL files or a migration tool such as Knex or Flyway)  
- Seed script to pre-populate at least one user account and one board for testing  
- Task ordering stored as a numeric position field — not as array indices in application memory  
- Efficient queries — avoid N+1 patterns; prefer joins over multiple round trips  

### 4.3 Frontend
- Component structure should be logical, reusable, and not monolithic  
- Global state management handled cleanly (Context API, Zustand, or similar)  
- API calls abstracted into a service/hooks layer — not scattered in component bodies  
- Errors from the API should surface meaningfully to the user, not silently fail  
- No console errors or warnings in the browser when using the app normally  

### 4.4 Developer Experience
- A README.md with clear setup and run instructions  
- The app should run locally with a single command after env setup  
- At least one unit or integration test for a non-trivial piece of backend logic  

---

## 5. Deliverables
Submit a single GitHub repository containing the complete project. The repository must include:

- Full source code for both frontend and backend  
- Database migration files and a seed script  
- `.env.example` file listing all required environment variables (with placeholder values)  
- `README.md` with local setup steps, how to run migrations, and how to run the app  
- At least one test file  

The application must be runnable locally. If we cannot get it running by following your README, it will affect your score significantly.

---

## 6. Out of Scope
The following are explicitly not required. Do not spend time on them.

- Deployment to any cloud platform (AWS, Heroku, Vercel, etc.)  
- Real-time collaboration or multi-user live syncing (e.g., WebSockets)  
- Email verification or password reset flows  
- Mobile responsiveness (a desktop-first layout is sufficient)  
- Comprehensive test coverage — one meaningful test is enough  
- CI/CD pipeline or Docker setup  

---

## 7. Evaluation Rubric
Your submission will be reviewed across the following dimensions during the on-prem deep-dive session. Come prepared to explain every decision.

| Area | What We Will Evaluate |
|------|----------------------|
| Database Design | Schema normalization, use of constraints, ordering strategy for tasks, migration quality |
| API Design | RESTful conventions, error handling, status codes, middleware structure |
| Security | Password hashing, JWT implementation, input validation, .env usage |
| Frontend Architecture | Component breakdown, state management, API abstraction, UX quality |
| Code Readability | Naming conventions, function length, separation of concerns, consistency |
| Problem Solving | How edge cases are handled: task reordering conflicts, empty states, auth failures |
| README & Setup | Can the app be set up and run without asking you for help? |
| Deep-Dive Q&A | Can you explain your decisions, trade-offs, and what you would do differently at scale? |

---

## 8. Tips from the Review Team
These are not requirements, but they reflect the kind of thinking we value in senior engineers:

- Think about what happens when two users try to reorder the same column simultaneously. You don’t need to solve it — but be ready to discuss it.  
- The task ordering problem is deceptively simple. A float-based ordering system (e.g., LexoRank-style) shows depth. Even a basic integer position with gap-based rebalancing shows awareness.  
- Your folder structure signals how you think about architecture. Flat files in a single directory and deeply nested folders both raise questions.  
- Error handling that says “Something went wrong” everywhere is not error handling — distinguish between 4xx and 5xx behavior in the UI.  
- If you make a trade-off (e.g., denormalizing data for simplicity), note it in a comment or the README. We want to know you know.  

---

## 9. Submission Instructions

| Step | Instruction |
|------|------------|
| Step 1 | Push your code to a public (or private, shared) GitHub repository |
| Step 2 | Share the repository link with your hiring contact at least 2 hours before the on-prem session |
| Step 3 | Be ready to run the project locally and walk through the code during the on-prem session |

---

**Good luck. We look forward to the conversation.**