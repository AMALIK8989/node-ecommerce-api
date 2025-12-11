// src/pages/Users.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Users = () => {
  const [users, setUsers] = useState([]);
  const [sortBy, setSortBy] = useState('created_at');
  const [order, setOrder] = useState('desc');

  const fetchUsers = async (sortField = sortBy, sortOrder = order) => {
    try {
      const res = await axios.get(`/api/users?sort_by=${sortField}&order=${sortOrder}`);
      setUsers(res.data.data);
      setSortBy(sortField);
      setOrder(sortOrder);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleSort = (key) => {
    let newOrder = 'asc';
    if (sortBy === key && order === 'asc') newOrder = 'desc';
    fetchUsers(key, newOrder);
  };

  return (
    <div className="container mt-4">
      <h2 className="mb-3">Users</h2>
      <div className="table-responsive">
        <table className="table table-striped table-bordered table-hover">
          <thead className="table-dark">
            <tr>
              <th onClick={() => handleSort('id')} style={{ cursor: 'pointer' }}>
                ID {sortBy === 'id' ? (order === 'asc' ? '▲' : '▼') : ''}
              </th>
              <th onClick={() => handleSort('name')} style={{ cursor: 'pointer' }}>
                Name {sortBy === 'name' ? (order === 'asc' ? '▲' : '▼') : ''}
              </th>
              <th onClick={() => handleSort('email')} style={{ cursor: 'pointer' }}>
                Email {sortBy === 'email' ? (order === 'asc' ? '▲' : '▼') : ''}
              </th>
              <th onClick={() => handleSort('phone')} style={{ cursor: 'pointer' }}>
                Phone {sortBy === 'phone' ? (order === 'asc' ? '▲' : '▼') : ''}
              </th>
              <th onClick={() => handleSort('created_at')} style={{ cursor: 'pointer' }}>
                Created At {sortBy === 'created_at' ? (order === 'asc' ? '▲' : '▼') : ''}
              </th>
              <th onClick={() => handleSort('updated_at')} style={{ cursor: 'pointer' }}>
                Updated At {sortBy === 'updated_at' ? (order === 'asc' ? '▲' : '▼') : ''}
              </th>
            </tr>
          </thead>
          <tbody>
            {users.length ? (
              users.map((user) => (
                <tr key={user.id}>
                  <td>{user.id}</td>
                  <td>{user.name}</td>
                  <td>{user.email}</td>
                  <td>{user.phone}</td>
                  <td>{new Date(user.created_at).toLocaleString()}</td>
                  <td>{new Date(user.updated_at).toLocaleString()}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="text-center">No users found</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Users;
