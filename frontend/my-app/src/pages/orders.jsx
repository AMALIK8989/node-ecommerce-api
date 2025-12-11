// src/pages/Orders.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [sortBy, setSortBy] = useState('created_at');
  const [order, setOrder] = useState('desc');

  const fetchOrders = async (sortField = sortBy, sortOrder = order) => {
    try {
      const res = await axios.get(`/api/orders?sort_by=${sortField}&order=${sortOrder}`);
      setOrders(res.data.data);
      setSortBy(sortField);
      setOrder(sortOrder);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleSort = (key) => {
    let newOrder = 'asc';
    if (sortBy === key && order === 'asc') newOrder = 'desc';
    fetchOrders(key, newOrder);
  };

  return (
    <div className="container mt-4">
      <h2 className="mb-3">Orders</h2>
      <div className="table-responsive">
        <table className="table table-striped table-bordered table-hover">
          <thead className="table-dark">
            <tr>
              <th onClick={() => handleSort('o_id')} style={{ cursor: 'pointer' }}>
                Order ID {sortBy === 'o_id' ? (order === 'asc' ? '▲' : '▼') : ''}
              </th>
              <th onClick={() => handleSort('user_name')} style={{ cursor: 'pointer' }}>
                User {sortBy === 'user_name' ? (order === 'asc' ? '▲' : '▼') : ''}
              </th>
              <th onClick={() => handleSort('product_name')} style={{ cursor: 'pointer' }}>
                Product {sortBy === 'product_name' ? (order === 'asc' ? '▲' : '▼') : ''}
              </th>
              <th onClick={() => handleSort('qty')} style={{ cursor: 'pointer' }}>
                Quantity {sortBy === 'qty' ? (order === 'asc' ? '▲' : '▼') : ''}
              </th>
              <th onClick={() => handleSort('price')} style={{ cursor: 'pointer' }}>
                Price {sortBy === 'price' ? (order === 'asc' ? '▲' : '▼') : ''}
              </th>
              <th onClick={() => handleSort('city')} style={{ cursor: 'pointer' }}>
                City {sortBy === 'city' ? (order === 'asc' ? '▲' : '▼') : ''}
              </th>
              <th onClick={() => handleSort('created_at')} style={{ cursor: 'pointer' }}>
                Created At {sortBy === 'created_at' ? (order === 'asc' ? '▲' : '▼') : ''}
              </th>
            </tr>
          </thead>
          <tbody>
            {orders.length ? (
              orders.map((order) => (
                <tr key={order.o_id}>
                  <td>{order.o_id}</td>
                  <td>{order.user_name}</td>
                  <td>{order.product_name}</td>
                  <td>{order.qty}</td>
                  <td>{order.price}</td>
                  <td>{order.city || '-'}</td>
                  <td>{new Date(order.created_at).toLocaleString()}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="text-center">No orders found</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Orders;
