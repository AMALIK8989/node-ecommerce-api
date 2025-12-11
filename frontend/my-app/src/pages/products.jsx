// src/pages/Products.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Products = () => {
  const [products, setProducts] = useState([]);
  const [sortBy, setSortBy] = useState('created_at');
  const [order, setOrder] = useState('desc');

  const fetchProducts = async (sortField = sortBy, sortOrder = order) => {
    try {
      const res = await axios.get(`/api/products?sort_by=${sortField}&order=${sortOrder}`);
      setProducts(res.data.data);
      setSortBy(sortField);
      setOrder(sortOrder);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleSort = (key) => {
    let newOrder = 'asc';
    if (sortBy === key && order === 'asc') newOrder = 'desc';
    fetchProducts(key, newOrder);
  };

  return (
    <div className="container mt-4">
      <h2 className="mb-3">Products</h2>
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
              <th onClick={() => handleSort('price')} style={{ cursor: 'pointer' }}>
                Price {sortBy === 'price' ? (order === 'asc' ? '▲' : '▼') : ''}
              </th>
              <th onClick={() => handleSort('qty')} style={{ cursor: 'pointer' }}>
                Quantity {sortBy === 'qty' ? (order === 'asc' ? '▲' : '▼') : ''}
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
            {products.length ? (
              products.map((product) => (
                <tr key={product.id}>
                  <td>{product.id}</td>
                  <td>{product.name}</td>
                  <td>{product.price}</td>
                  <td>{product.qty}</td>
                  <td>{new Date(product.created_at).toLocaleString()}</td>
                  <td>{new Date(product.updated_at).toLocaleString()}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="text-center">No products found</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Products;
