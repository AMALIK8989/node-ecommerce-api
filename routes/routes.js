// backend/routes/routes.js
const express = require('express');
const router = express.Router();
const userController = require('../Controller/auth-controller');
const orderController = require('../Controller/orderController');
const productController = require('../Controller/productController')

router.get('/users', userController.getAllUsers);       // fetch all users
router.get('/users/list/:id', userController.getUserById);   // fetch single user by id
router.put('/users/update/:id', userController.updateUserById);// update user by id
router.delete('/users/delete/:id', userController.softDeleteUser); // soft delete

// Orders
router.get('/orders', orderController.getAllOrders);             // all orders
router.get('/orders/:o_id', orderController.getOrderById);       // order by ID
router.get('/user-orders/:user_id', orderController.getOrdersByUser); // orders by user
router.put('/orders/:o_id', orderController.updateOrderById);    // update order
router.delete('/orders/:o_id', orderController.softDeleteOrder); // soft delete
router.get('/orders-stats', orderController.getOrderStats);      // aggregated stats
router.get('/orders/filter/orders-by', orderController.getOrdersByDateFilter)

router.get('/products', productController.getAllProducts);        // fetch all
router.get('/products/:id', productController.getProductById);    // fetch by id
router.post('/products', productController.createProduct);        // create
router.put('/products/:id', productController.updateProductById); // update
router.delete('/products/:id', productController.softDeleteProduct); // soft delete
router.get('/most-selling-product', productController.getMostSellingProduct);

module.exports = router;