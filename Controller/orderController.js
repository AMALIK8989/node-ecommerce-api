// backend/Controller/orderController.js
const pool = require('../db/db');

// Get all orders
const getAllOrders = async (req, res) => {
  try {
    const [rows] = await pool.execute(`
     SELECT 
  o.o_id, o.qty, o.price, o.created_at, o.updated_at,
  u.id AS user_id, u.name AS user_name, u.email AS user_email,
  a.address, a.city,
  p.id AS product_id, p.name AS product_name, p.price AS product_price
FROM orders o
JOIN users u ON o.user_id = u.id
JOIN products p ON o.product_id = p.id
LEFT JOIN addresses a ON a.user_id = u.id
WHERE o.is_deleted = 0
ORDER BY o.created_at DESC

    `);

    res.json({
      success: true,
      message: rows.length ? 'Orders fetched successfully' : 'No orders found',
      data: rows
    });
  } catch (error) {
    console.error('DB Error:', error);
    res.status(500).json({ success: false, message: 'Server error', data: [] });
  }
};

// Get order by ID
const getOrderById = async (req, res) => {
  const { o_id } = req.params;
  try {
    const [rows] = await pool.execute(`
      SELECT 
        o.o_id, o.qty, o.price, o.created_at, o.updated_at,
        u.id AS user_id, u.name AS user_name, u.email AS user_email,
        a.address, a.city,
        p.product_id, p.name AS product_name, p.price AS product_price
      FROM orders o
      JOIN users u ON o.user_id = u.id
      JOIN products p ON o.product_id = p.product_id
      LEFT JOIN addresses a ON a.user_id = u.id
      WHERE o.o_id = ? AND o.is_deleted = 0
    `, [o_id]);

    if (rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Order not found', data: null });
    }

    res.json({ success: true, message: 'Order fetched successfully', data: rows[0] });
  } catch (error) {
    console.error('DB Error:', error);
    res.status(500).json({ success: false, message: 'Server error', data: null });
  }
};

// Get orders by user ID
const getOrdersByUser = async (req, res) => {
  const { user_id } = req.params;
  try {
    // Fetch all orders for the user with product & address info
    const [orders] = await pool.execute(`
      SELECT 
        o.o_id, o.qty, o.price, o.created_at, o.updated_at,
        u.id AS user_id, u.name AS user_name, u.email AS user_email,
        a.address, a.city,
        p.id AS product_id, p.name AS product_name, p.price AS product_price
      FROM orders o
      JOIN users u ON o.user_id = u.id
      JOIN products p ON o.product_id = p.id
      LEFT JOIN addresses a ON a.user_id = u.id
      WHERE o.user_id = ? AND o.is_deleted = 0
      ORDER BY o.created_at DESC
    `, [user_id]);

    // Calculate total orders and total price
    const [summary] = await pool.execute(`
      SELECT 
        COUNT(*) AS total_orders, 
        SUM(price) AS total_price
      FROM orders
      WHERE user_id = ? AND is_deleted = 0
    `, [user_id]);

    res.json({
      success: true,
      message: orders.length ? 'Orders fetched successfully' : 'No orders found for this user',
      data: {
        orders,
        total_orders: summary[0].total_orders || 0,
        total_price: summary[0].total_price || 0
      }
    });
  } catch (error) {
    console.error('DB Error:', error);
    res.status(500).json({ success: false, message: 'Server error', data: [] });
  }
};


// Update order by ID
const updateOrderById = async (req, res) => {
  const { o_id } = req.params;
  const { qty, price } = req.body;
  try {
    const [result] = await pool.execute(`
      UPDATE orders
      SET qty = ?, price = ?, updated_at = NOW()
      WHERE o_id = ? AND is_deleted = 0
    `, [qty, price, o_id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, message: 'Order not found or deleted', data: null });
    }

    res.json({ success: true, message: 'Order updated successfully', data: { o_id, qty, price } });
  } catch (error) {
    console.error('DB Error:', error);
    res.status(500).json({ success: false, message: 'Server error', data: null });
  }
};

// Soft delete order
const softDeleteOrder = async (req, res) => {
  const { o_id } = req.params;
  try {
    const [result] = await pool.execute(`
      UPDATE orders
      SET is_deleted = 1, updated_at = NOW()
      WHERE o_id = ? AND is_deleted = 0
    `, [o_id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, message: 'Order not found or already deleted', data: null });
    }

    res.json({ success: true, message: 'Order soft deleted successfully', data: { o_id } });
  } catch (error) {
    console.error('DB Error:', error);
    res.status(500).json({ success: false, message: 'Server error', data: null });
  }
};


const getOrderStats = async (req, res) => {
  const { user_id } = req.query; // optional query param
  try {
    let userTotalsQuery = `
      SELECT u.id AS user_id, u.name AS user_name, SUM(o.price) AS total_spent
      FROM orders o
      JOIN users u ON o.user_id = u.id
      WHERE o.is_deleted = 0
    `;
    const userTotalsParams = [];

    if (user_id) {
      userTotalsQuery += ' AND u.id = ?';
      userTotalsParams.push(user_id);
    }

    userTotalsQuery += ' GROUP BY u.id ORDER BY total_spent DESC';

    const [userTotals] = await pool.execute(userTotalsQuery, userTotalsParams);

    let cityStatsQuery = `
      SELECT a.city, COUNT(*) AS total_orders
      FROM orders o
      JOIN addresses a ON o.user_id = a.user_id
      WHERE o.is_deleted = 0
    `;
    const cityStatsParams = [];

    if (user_id) {
      cityStatsQuery += ' AND o.user_id = ?';
      cityStatsParams.push(user_id);
    }

    cityStatsQuery += ' GROUP BY a.city ORDER BY total_orders DESC LIMIT 1';

    const [cityStats] = await pool.execute(cityStatsQuery, cityStatsParams);

    res.json({
      success: true,
      message: 'Order statistics fetched successfully',
      data: {
        userTotals,
        topCity: cityStats[0] || null
      }
    });
  } catch (error) {
    console.error('DB Error:', error);
    res.status(500).json({ success: false, message: 'Server error', data: null });
  }
};

const getOrdersByDateFilter = async (req, res) => {
  const { day, month, year, week, date } = req.query;

  try {
    let whereClauses = ["o.is_deleted = 0"];
    let params = [];

    if (date) {
      whereClauses.push("DATE(o.created_at) = ?");
      params.push(date);
    }


    if (year) {
      whereClauses.push("YEAR(o.created_at) = ?");
      params.push(year);
    }

 
    if (month) {
      whereClauses.push("MONTH(o.created_at) = ?");
      params.push(month);
    }


    if (day) {
      whereClauses.push("DAY(o.created_at) = ?");
      params.push(day);
    }

  
    if (week) {
      whereClauses.push("WEEK(o.created_at) = ?");
      params.push(week);
    }

    const whereSQL = whereClauses.length ? "WHERE " + whereClauses.join(" AND ") : "";

    const [rows] = await pool.execute(`
      SELECT 
        o.o_id, o.qty, o.price, o.created_at, o.updated_at,
        u.id AS user_id, u.name AS user_name, u.email AS user_email,
        a.address, a.city,
        p.id AS product_id, p.name AS product_name, p.price AS product_price
      FROM orders o
      JOIN users u ON o.user_id = u.id
      JOIN products p ON o.product_id = p.id
      LEFT JOIN addresses a ON a.user_id = u.id
      ${whereSQL}
      ORDER BY o.created_at DESC
    `, params);

    res.json({
      success: true,
      message: rows.length ? "Orders fetched successfully" : "No orders found",
      filters_used: { day, month, year, week, date },
      data: rows
    });

  } catch (error) {
    console.error("DB Error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
      data: []
    });
  }
};

module.exports = {
  getAllOrders,
  getOrderById,
  getOrdersByUser,
  updateOrderById,
  softDeleteOrder,
  getOrderStats,
  getOrdersByDateFilter
};
