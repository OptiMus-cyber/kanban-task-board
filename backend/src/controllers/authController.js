const User = require('../models/User');
const Board = require('../models/Board');
const Column = require('../models/Column');
const { generateToken } = require('../config/jwt');

const register = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if user already exists
    const existingUser = await User.findByEmail(email);
    if (existingUser) {
      return res.status(400).json({ error: 'Email already in use' });
    }

    const user = await User.create(email, password);
    const token = generateToken(user.id);

    // Create default board with columns
    const board = await Board.create(user.id);
    await Column.create(board.id, 'To Do', 0);
    await Column.create(board.id, 'In Progress', 1);
    await Column.create(board.id, 'Done', 2);

    res.status(201).json({ user, token });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Registration failed' });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.verifyPassword(email, password);
    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const token = generateToken(user.id);
    res.json({ user, token });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Login failed' });
  }
};

module.exports = {
  register,
  login
};
