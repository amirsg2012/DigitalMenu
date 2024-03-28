// server/routes/menuItemRoutes.js

const express = require('express');
const router = express.Router();
const menuItemController = require('../controllers/menuItemController');

router.get('/', menuItemController.getMenuItems);

// POST a new menu item
router.post('/add', menuItemController.createMenuItem);

// PUT update a menu item
router.put('/:id', menuItemController.updateMenuItem);

// DELETE a menu item
router.delete('/:id', menuItemController.deleteMenuItem);

// POST upload an image
router.post('/upload', menuItemController.upload, menuItemController.uploadImage);


module.exports = router;
