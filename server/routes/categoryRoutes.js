// Define routes for categories
const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/categoryController');

router.get('/', categoryController.getCategories);
router.post('/', categoryController.createCategory);
router.put('/:id', categoryController.updateCategory);
router.delete('/:id', categoryController.deleteCategory);
router.put('/:id/reorder', categoryController.reorderCategory);
router.post('/upload-icon', categoryController.upload, categoryController.uploadIcon);


module.exports = router;
