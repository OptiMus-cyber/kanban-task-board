# Kanban Task Management Board

A full-stack Kanban-style task management board built with React, Node.js/Express, and PostgreSQL.

## Features

- ✅ User authentication with JWT tokens
- ✅ Personal Kanban boards with customizable columns
- ✅ Create, edit, and delete tasks
- ✅ Drag-and-drop task management
- ✅ Inline column name editing
- ✅ Add new columns to boards
- ✅ Task persistence across page refreshes
- ✅ Responsive error handling

## Tech Stack

### Backend
- Node.js with Express
- PostgreSQL database
- JWT authentication with bcrypt password hashing
- Input validation with express-validator

### Frontend
- React with Hooks
- Axios for API calls
- Context API for state management
- CSS for styling

## Project Structure

```
kanban-board/
├── backend/
│   ├── src/
│   │   ├── config/         # Database and JWT configuration
│   │   ├── controllers/    # Route controllers
│   │   ├── middleware/     # Auth and validation middleware
│   │   ├── models/         # Database models
│   │   ├── routes/         # API routes
│   │   └── index.js        # Express app entry point
│   ├── migrations/         # Database migrations and seed scripts
│   ├── tests/              # Unit and integration tests
│   ├── package.json
│   └── .env.example
├── frontend/
│   ├── src/
│   │   ├── components/     # Reusable components
│   │   ├── pages/          # Page components
│   │   ├── hooks/          # Custom React hooks
│   │   ├── services/       # API services
│   │   ├── context/        # React context
│   │   ├── styles/         # Global styles
│   │   ├── App.js
│   │   └── index.js
│   ├── public/
│   ├── package.json
│   └── .env.example
├── .gitignore
└── README.md
```

## Prerequisites

- Node.js (v14+)
- PostgreSQL (v12+)
- npm or yarn

## Installation & Setup

### 1. Clone the repository
```bash
git clone <repository-url>
cd kanban-board
```

### 2. Backend Setup

```bash
cd backend

# Create .env file
cp .env.example .env

# Update .env with your PostgreSQL credentials
# Example:
# DB_USER=postgres
# DB_PASSWORD=your_password
# DB_HOST=localhost
# DB_PORT=5432
# DB_NAME=kanban_board
# JWT_SECRET=your-secret-key

# Install dependencies
npm install

# Run database migrations
npm run migrate

# Seed database with test data
npm run seed

# Start development server
npm run dev
```

The backend will run on `http://localhost:5000`

### 3. Frontend Setup

```bash
cd ../frontend

# Create .env file
cp .env.example .env

# Install dependencies
npm install

# Start development server
npm start
```

The frontend will run on `http://localhost:3000`

## Database Setup

The database schema includes:
- **users**: User accounts with hashed passwords
- **boards**: Kanban boards belonging to users
- **columns**: Columns within boards (To Do, In Progress, Done, etc.)
- **tasks**: Individual task cards with title, description, and position

### Initialize Database
```bash
cd backend
npm run migrate  # Creates tables
npm run seed     # Adds test data
```

### Test Account
- Email: `test@example.com`
- Password: `password123`

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user

### Boards
- `GET /api/boards` - Get all boards for user
- `POST /api/boards` - Create new board
- `GET /api/boards/:boardId` - Get board with columns
- `PUT /api/boards/:boardId` - Update board name
- `DELETE /api/boards/:boardId` - Delete board

### Columns
- `POST /api/boards/:boardId/columns` - Create column
- `PUT /api/boards/columns/:columnId` - Update column name
- `DELETE /api/boards/columns/:columnId` - Delete column

### Tasks
- `POST /api/tasks/columns/:columnId/tasks` - Create task
- `PUT /api/tasks/:taskId` - Update task
- `DELETE /api/tasks/:taskId` - Delete task
- `PATCH /api/tasks/:taskId/move` - Move task to different column

## Testing

### Backend Tests
```bash
cd backend
npm test
```

Tests cover:
- User registration and login
- JWT token generation and verification
- Password hashing with bcrypt

## Building for Production

### Backend Production Build
```bash
cd backend
# Update .env with production database credentials
npm start
```

### Frontend Production Build
```bash
cd frontend
npm run build
```

Build output will be in `frontend/build/`

## Usage

1. **Register/Login**: Create an account or use test credentials
2. **Create Board**: Start with a default board or create a new one
3. **Manage Columns**: Edit column names or add new columns
4. **Create Tasks**: Add tasks to columns with title and description
5. **Organize Tasks**: Drag and drop tasks between columns to reorder
6. **Edit/Delete**: Click task × button to delete, or hover for options

## Architecture Decisions

### Task Ordering
Tasks are ordered using a numeric `position` field stored in the database, allowing efficient reordering without array manipulation.

### Authentication
JWT tokens are stored in localStorage on the client and sent with each API request in the Authorization header.

### API Design
RESTful API design with proper HTTP status codes:
- 200: Success
- 201: Created
- 400: Bad Request
- 401: Unauthorized
- 403: Forbidden
- 404: Not Found
- 500: Server Error

### State Management
Frontend uses React Context API for authentication state and custom hooks for board/task logic to keep components clean and separated.

## Best Practices Followed
- Backend controllers are thin and delegate logic to models with clear separation of concerns.
- Validation via `express-validator` is applied on all mutate endpoints, returning `400` with precise field-level errors.
- JWT middleware enforces auth on protected routes and avoids user context leaks.
- All DB queries use parameterized SQL to prevent injection (e.g., `$1` placeholders).
- Async/await is paired with centralized error handling (middleware and API wrappers).
- Frontend services abstract all API calls and retry consistent error parsing to preserve user intent.
- Component logic is split into `useBoard` / `useTasks` hooks, avoiding prop-drilling and keeping UI declarative.
- Drag-and-drop updates are handled fully in-database with position reorders and UX update callbacks.

## Trade-offs and Why
- Chose relational normalized schema (`boards`, `columns`, `tasks`) for clarity and archive-ability; this increases JOIN complexity but keeps state canonical.
- Implemented integer `position` ordering (and per-column re-sync) for simplicity and predictable behavior; this may need optimization with millions of tasks.
- Used localStorage for JWT to reduce infra complexity; this has XSS risk— mitigated by frontend security hygiene, but cookie HttpOnly is 2nd-future improvement.
- No real-time sockets: chosen based on scope/time; state is refreshed after drop events by board refetch to preserve correctness.
- Common daytime user experience uses soft loading states, avoiding full-page refresh; tradeoff is additional complexity in state and error propagation.

## Error Handling

- Backend validates all input with express-validator
- Passwords are hashed with bcrypt (never stored in plain text)
- JWT middleware protects all board/task endpoints
- Frontend displays user-friendly error messages
- Proper HTTP status codes distinguish between client and server errors

## Performance Considerations

- Database queries use JOINs to fetch related data efficiently
- Task position stored as numeric values for fast sorting
- Lazy loading of boards and tasks
- CSS modules prevent style conflicts

## Known Limitations & Future Improvements

- No real-time collaboration (one user at a time)
- No email verification or password reset
- No mobile responsiveness optimization
- Simple linear task ordering (no conflict resolution for concurrent moves)
- No undo/redo functionality

## Security Notes

- All passwords are hashed with bcrypt before storage
- JWT tokens expire after 7 days
- Environment variables protect sensitive data
- Input validation prevents SQL injection
- CORS configured for development

## Troubleshooting

### Database Connection Error
- Ensure PostgreSQL is running
- Check .env database credentials
- Verify database exists: `createdb kanban_board`

### Port Already in Use
- Backend: Change PORT in .env
- Frontend: Change port via `PORT=3001 npm start`

### CORS Issues
- Check backend CORS configuration
- Verify REACT_APP_API_URL in frontend .env

## Contributing

1. Create a feature branch
2. Make your changes
3. Add tests for new features
4. Submit a pull request

## License

MIT

## Support

For issues or questions, please create an issue in the repository.
