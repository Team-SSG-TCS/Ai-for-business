const db = require('../config/db');

// @desc    Get all hackathon items (Raw SQL: SELECT)
// @route   GET /api/items
const getItems = async (req, res, next) => {
  try {
    if (db.isPlaceholder) {
      // Friendly fallback sample data when password is not yet entered
      return res.json({
        success: true,
        data: [
          { id: 1, title: 'Sample Item 1 (Mock)', description: 'Provide real Supabase password in backend/.env to query live DB' },
          { id: 2, title: 'Sample Item 2 (Mock)', description: 'Raw SQL SELECT * FROM hackathon_items' },
        ],
        notice: 'Displaying mock items because DATABASE_URL has [YOUR-PASSWORD]',
      });
    }

    const { rows } = await db.query(
      'SELECT id, title, description, created_at FROM hackathon_items ORDER BY created_at DESC LIMIT 50'
    );

    res.json({
      success: true,
      count: rows.length,
      data: rows,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new item (Raw SQL: INSERT)
// @route   POST /api/items
const createItem = async (req, res, next) => {
  try {
    const { title, description } = req.body;

    if (!title) {
      return res.status(400).json({ success: false, message: 'Title is required' });
    }

    if (db.isPlaceholder) {
      return res.status(201).json({
        success: true,
        message: 'Mock item created (update backend/.env with your Supabase password for persistent DB)',
        data: {
          id: Math.floor(Math.random() * 1000),
          title,
          description: description || '',
          created_at: new Date().toISOString(),
        },
      });
    }

    const insertSql = `
      INSERT INTO hackathon_items (title, description)
      VALUES ($1, $2)
      RETURNING id, title, description, created_at;
    `;
    const { rows } = await db.query(insertSql, [title, description || '']);

    res.status(201).json({
      success: true,
      message: 'Item created successfully in Supabase',
      data: rows[0],
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete item (Raw SQL: DELETE)
// @route   DELETE /api/items/:id
const deleteItem = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (db.isPlaceholder) {
      return res.json({ success: true, message: `Mock item ${id} deleted` });
    }

    const { rowCount } = await db.query('DELETE FROM hackathon_items WHERE id = $1', [id]);

    if (rowCount === 0) {
      return res.status(404).json({ success: false, message: 'Item not found' });
    }

    res.json({
      success: true,
      message: `Item ${id} deleted successfully`,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getItems,
  createItem,
  deleteItem,
};
