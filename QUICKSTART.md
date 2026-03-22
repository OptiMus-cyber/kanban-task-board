## Quick Start Guide

This guide will help you get the Kanban Task Management Board up and running locally.

### Prerequisites
- Node.js (v14 or higher)
- PostgreSQL (v12 or higher)
- Git

### Step 1: Database Setup

First, create the PostgreSQL database:

```bash
# Connect to PostgreSQL
psql -U postgres

# Create the database
CREATE DATABASE kanban_board;

# Exit psql
\q
```

### Step 2: Backend Setup

```bash
cd backend

# Copy environment file
cp .env.example .env

# Edit .env with your database credentials
# nano .env  (or use your preferred editor)

# Install dependencies
npm install

# Run migrations to create tables
npm run migrate

# Seed the database with test data
npm run seed

# Start the development server
npm run dev
```

Backend will be running at: `http://localhost:5000`

**Test Credentials:**
- Email: `test@example.com`
- Password: `password123`

### Step 3: Frontend Setup

In a new terminal:

```bash
cd frontend

# Copy environment file
cp .env.example .env

# Install dependencies
npm install

# Start the development server
npm start
```

Frontend will open at: `http://localhost:3000`

### Step 4: Use the Application

1. **Login/Register**: Use the test credentials or create a new account
2. **Create a Board**: Start organizing your tasks
3. **Manage Columns**: Edit column names or add new ones
4. **Add Tasks**: Create tasks with titles and descriptions
5. **Move Tasks**: Drag and drop tasks between columns

### Troubleshooting

#### PostgreSQL Connection Error
```
Error: connect ECONNREFUSED 127.0.0.1:5432
```
**Solution**: Ensure PostgreSQL is installed and running

#### Port Already in Use
**Backend**: Modify `PORT` in `backend/.env`
**Frontend**: Stop other services or change port:
```bash
PORT=3001 npm start
```

#### Database Creation Failed
Check your PostgreSQL user permissions:
```bash
psql -U postgres -d kanban_board -c "SELECT version();"
```

### Development Commands

**Backend**:
```bash
npm run dev       # Run with nodemon (auto-restart)
npm test          # Run tests
npm run migrate   # Create/update database schema
npm run seed      # Add test data
```

**Frontend**:
```bash
npm start         # Development server with hot reload
npm run build     # Create production build
npm test          # Run tests
```

### Project Structure

```
├── backend/
│   ├── src/
│   │   ├── config/       # Database and JWT setup
│   │   ├── controllers/  # Route handlers
│   │   ├── middleware/   # Auth, validation
│   │   ├── models/       # Database operations
│   │   ├── routes/       # API endpoints
│   │   └── index.js      # Main server file
│   ├── migrations/       # DB initialization & seed
│   └── tests/            # Test files
│
├── frontend/
│   └── src/
│       ├── components/   # React components
│       ├── pages/        # Page components
│       ├── hooks/        # Custom hooks
│       ├── services/     # API calls
│       ├── context/      # State management
│       └── styles/       # CSS files
│
└── README.md             # Full documentation
```

### API Reference

See `README.md` for complete API endpoint documentation.

### Next Steps

- Read full documentation in `README.md`
- Check backend tests: `backend/tests/auth.test.js`
- Explore code structure to understand architecture
- Deploy to production when ready

### Support

For issues:
1. Check the troubleshooting section
2. Review error messages in console/terminal
3. Check `.env` file configuration
4. Verify PostgreSQL is running and accessible
