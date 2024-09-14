const express = require('express');
const customerController = require('../controllers/customer.controller');
const router = express.Router();
router.get('/customer/list',customerController.listAllCustomers);
router.get('/customer/list/:id',customerController.listCustomerById);
router.get('/customer/listByCity',customerController.listCustomerByCity);
router.post('/customer/addCustomer',customerController.addCustomer);
router.put('/customer/editCustomer/:id',customerController.editCustomer);

module.exports = router;