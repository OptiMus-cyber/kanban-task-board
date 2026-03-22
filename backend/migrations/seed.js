require('dotenv').config();
const pool = require('../src/config/database');
const bcrypt = require('bcryptjs');

const seed = async () => {
  try {
    console.log('Seeding database with test data...\n');

    // Create test user
    const hashedPassword = await bcrypt.hash('password123', 10);
    let userId;

    try {
      const userResult = await pool.query(
        'INSERT INTO users (email, password) VALUES ($1, $2) RETURNING id',
        ['test@example.com', hashedPassword]
      );
      userId = userResult.rows[0].id;
      console.log('✓ Test user created (ID:', userId + ')');
    } catch (error) {
      if (error.code === '23505') {
        // Unique constraint violation - user already exists
        const existingUser = await pool.query(
          'SELECT id FROM users WHERE email = $1',
          ['test@example.com']
        );
        userId = existingUser.rows[0].id;
        console.log('✓ Test user already exists (ID:', userId + ')');
      } else {
        throw error;
      }
    }

    // Create test board
    const boardResult = await pool.query(
      'INSERT INTO boards (user_id, name) VALUES ($1, $2) RETURNING id',
      [userId, 'Sample Board']
    );
    const boardId = boardResult.rows[0].id;
    console.log('✓ Board created (ID:', boardId + ')');

    // Create default columns
    const columnIds = [];
    const columnNames = ['To Do', 'In Progress', 'Done'];
    for (let i = 0; i < columnNames.length; i++) {
      const colResult = await pool.query(
        'INSERT INTO columns (board_id, name, position) VALUES ($1, $2, $3) RETURNING id',
        [boardId, columnNames[i], i]
      );
      columnIds.push(colResult.rows[0].id);
    }
    console.log('✓ Columns created:', columnNames.join(', '));

    // Create sample tasks
    const sampleTasks = [
      { columnId: columnIds[0], title: 'Design homepage', description: 'Create mockups and design system' },
      { columnId: columnIds[0], title: 'Setup database', description: 'Configure PostgreSQL and migrations' },
      {
        columnId: columnIds[1],
        title: 'Implement authentication',
        description: 'Build JWT-based auth system'
      },
      { columnId: columnIds[2], title: 'Deploy to staging', description: 'Push code to staging server' }
    ];

    for (let i = 0; i < sampleTasks.length; i++) {
      const task = sampleTasks[i];
      await pool.query(
        'INSERT INTO tasks (column_id, title, description, position) VALUES ($1, $2, $3, $4)',
        [task.columnId, task.title, task.description, i]
      );
    }
    console.log('✓ Sample tasks created:', sampleTasks.length);

    console.log('\n✓ Database seeded successfully!');
    console.log('\nTest Credentials:');
    console.log('  Email: test@example.com');
    console.log('  Password: password123\n');
    
    await pool.end();
    process.exit(0);
  } catch (error) {
    console.error('✗ Error seeding database:', error.message);
    process.exit(1);
  }
};

seed();
