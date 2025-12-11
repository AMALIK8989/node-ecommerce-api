// backend/Controller/userController.js
const pool = require('../db/db');

const getAllUsers = async (req, res) => {
  const { includeDeleted } = req.query;
  try {
    let query = 'SELECT id, name, email, phone, created_at, updated_at FROM users';
    if (!includeDeleted || includeDeleted === 'false') {
      query += ' WHERE is_deleted = 0';
    }

    const [rows] = await pool.execute(query);

    res.json({
      success: true,
      message: rows.length ? 'Users fetched successfully' : 'No users found',
      data: rows
    });
  } catch (error) {
    console.error('DB Error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      data: []
    });
  }
};


const getUserById = async (req, res) => {
  const { id } = req.params;
  try {
    const [rows] = await pool.execute(
      'SELECT id, name, email, phone, created_at, updated_at FROM users WHERE id = ? AND is_deleted = 0',
      [id]
    );

    if (rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
        data: null
      });
    }

    res.json({
      success: true,
      message: 'User fetched successfully',
      data: rows[0]
    });
  } catch (error) {
    console.error('DB Error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      data: null
    });
  }
};


const updateUserById = async (req, res) => {
  const { id } = req.params;
  const { name, email, phone } = req.body;

  try {
    const [result] = await pool.execute(
      'UPDATE users SET name = ?, email = ?, phone = ?, updated_at = NOW() WHERE id = ? AND is_deleted = 0',
      [name, email, phone, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: 'User not found or deleted',
        data: null
      });
    }

    res.json({
      success: true,
      message: 'User updated successfully',
      data: { id, name, email, phone }
    });
  } catch (error) {
    console.error('DB Error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      data: null
    });
  }
};


const softDeleteUser = async (req, res) => {
  const { id } = req.params;

  try {
    const [result] = await pool.execute(
      'UPDATE users SET is_deleted = 1, updated_at = NOW() WHERE id = ? AND is_deleted = 0',
      [id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: 'User not found or already deleted',
        data: null
      });
    }

    res.json({
      success: true,
      message: 'User soft deleted successfully',
      data: { id }
    });
  } catch (error) {
    console.error('DB Error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      data: null
    });
  }
};

module.exports = {
  getAllUsers,
  getUserById,
  updateUserById,
  softDeleteUser
};
