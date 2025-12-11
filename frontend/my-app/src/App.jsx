import { useState } from 'react'
import { Routes , Route } from "react-router"
import './App.css'
import Users from './pages/users'
import Products from './pages/products'
import Orders from './pages/orders'

function App() {
 
  return (
    <>
      <Routes>
        <Route path="/" element={<Users />} />
        <Route path="/products" element={<Products />} />
        <Route path="/orders" element={<Orders />} />
      </Routes>
    </>
  )
}

export default App
