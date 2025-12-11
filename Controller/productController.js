const pool = require('../db/db');
const { buildSortQuery } = require("../utils/sort");

// Get all products with optional sorting
const getAllProducts = async (req, res) => {
  const { sort_by, order } = req.query;
  try {
    let query = `
      SELECT id, name, price, qty, created_at, updated_at
      FROM products
      WHERE is_deleted = 0
    `;

    // Allowed fields for sorting
    const allowed = ["name", "price", "qty", "created_at", "updated_at"];
    query += buildSortQuery(sort_by, order, allowed);

    const [rows] = await pool.execute(query);

    res.json({
      success: true,
      message: rows.length ? "Products fetched successfully" : "No products found",
      data: rows
    });
  } catch (error) {
    console.error("DB Error:", error);
    res.status(500).json({ success: false, message: "Server error", data: [] });
  }
};

// Get product by ID
const getProductById = async (req, res) => {
  const { id } = req.params;
  try {
    const [rows] = await pool.execute(`
      SELECT id, name, price, qty, created_at, updated_at
      FROM products
      WHERE id = ? AND is_deleted = 0
    `, [id]);

    if (!rows.length) {
      return res.status(404).json({ success: false, message: 'Product not found', data: null });
    }

    res.json({ success: true, message: 'Product fetched successfully', data: rows[0] });
  } catch (error) {
    console.error('DB Error:', error);
    res.status(500).json({ success: false, message: 'Server error', data: null });
  }
};

// Create new product
const createProduct = async (req, res) => {
  const { name, price, qty } = req.body;
  try {
    const [result] = await pool.execute(`
      INSERT INTO products (name, price, qty)
      VALUES (?, ?, ?)
    `, [name, price, qty]);

    res.json({
      success: true,
      message: 'Product created successfully',
      data: { id: result.insertId, name, price, qty }
    });
  } catch (error) {
    console.error('DB Error:', error);
    res.status(500).json({ success: false, message: 'Server error', data: null });
  }
};

// Update product by ID
const updateProductById = async (req, res) => {
  const { id } = req.params;
  const { name, price, qty } = req.body;
  try {
    const [result] = await pool.execute(`
      UPDATE products
      SET name = ?, price = ?, qty = ?, updated_at = NOW()
      WHERE id = ? AND is_deleted = 0
    `, [name, price, qty, id]);

    if (!result.affectedRows) {
      return res.status(404).json({ success: false, message: 'Product not found or deleted', data: null });
    }

    res.json({
      success: true,
      message: 'Product updated successfully',
      data: { id, name, price, qty }
    });
  } catch (error) {
    console.error('DB Error:', error);
    res.status(500).json({ success: false, message: 'Server error', data: null });
  }
};

// Soft delete product by ID
const softDeleteProduct = async (req, res) => {
  const { id } = req.params;
  try {
    const [result] = await pool.execute(`
      UPDATE products
      SET is_deleted = 1, updated_at = NOW()
      WHERE id = ? AND is_deleted = 0
    `, [id]);

    if (!result.affectedRows) {
      return res.status(404).json({ success: false, message: 'Product not found or already deleted', data: null });
    }

    res.json({ success: true, message: 'Product soft deleted successfully', data: { id } });
  } catch (error) {
    console.error('DB Error:', error);
    res.status(500).json({ success: false, message: 'Server error', data: null });
  }
};

// Get most selling product (by total quantity sold)
const getMostSellingProduct = async (req, res) => {
  try {
    const [rows] = await pool.execute(`
      SELECT 
        p.id AS product_id, 
        p.name AS product_name, 
        SUM(o.qty) AS total_qty_sold,
        SUM(o.price * o.qty) AS total_revenue
      FROM orders o
      JOIN products p ON o.product_id = p.id
      WHERE o.is_deleted = 0
      GROUP BY p.id
      ORDER BY total_qty_sold DESC
      LIMIT 1
    `);

    if (!rows.length) {
      return res.status(404).json({ success: false, message: 'No orders found', data: null });
    }

    res.json({
      success: true,
      message: 'Most selling product fetched successfully',
      data: rows[0]
    });
  } catch (error) {
    console.error('DB Error:', error);
    res.status(500).json({ success: false, message: 'Server error', data: null });
  }
};

module.exports = {
  getAllProducts,
  getProductById,
  createProduct,
  updateProductById,
  softDeleteProduct,
  getMostSellingProduct
};
