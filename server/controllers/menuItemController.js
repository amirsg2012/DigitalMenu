// server/controllers/menuItemController.js
const multer = require('multer');
const MenuItem = require('../models/MenuItem');
const path = require('path');

// Set up multer middleware to handle file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname,'..','client','public', 'menu_pic')); // Set the destination folder for uploaded images
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname); // Set the filename for the uploaded image
  }
});

const upload = multer({ storage: storage });

exports.getMenuItems = async (req, res) => {
  try {
    const menuItems = await MenuItem.find();
    res.json(menuItems);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

exports.createMenuItem = async (req, res) => {
  try {
    const menuItem = new MenuItem(req.body);
    await menuItem.save();
    res.status(201).json(menuItem);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

exports.updateMenuItem = async (req, res) => {
  try {
    const { id } = req.params;
    const menuItem = await MenuItem.findByIdAndUpdate(id, req.body, { new: true });
    if (!menuItem) {
      return res.status(404).json({ message: 'Menu Item not found' });
    }
    res.json(menuItem);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

exports.deleteMenuItem = async (req, res) => {
  try {
    const { id } = req.params;
    const menuItem = await MenuItem.findByIdAndDelete(id);
    if (!menuItem) {
      return res.status(404).json({ message: 'Menu Item not found' });
    }
    res.json({ message: 'Menu Item deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// Handle image upload
exports.uploadImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No image uploaded' });
    }

    // Construct the image URL
    const fileName = req.file.originalname;
    const imageUrl = '/menu_pic/' + fileName;
    
    // Send back the image URL
    res.status(201).json({ imageUrl });
  } catch (error) {
    console.error('Error uploading image:', error);
    res.status(500).json({ message: 'Server Error' });
  }
};
exports.reorderItem = async (req, res) => {
  try {
    const { id } = req.params;
    const { newIndex } = req.body;
    // Ensure all items have unique order starting from 1
    const allItems = await MenuItem.find().sort({ category: 1, order: 1 });
    let currentOrder = 1;
    let currentCategory = '';

    for (const item of allItems) {
      if (item.category !== currentCategory) {
        currentCategory = item.category;
        currentOrder = 1;
      }

      item.order = currentOrder++;
      await item.save();
    }

    // Find the item to be reordered
    const itemToMove = await MenuItem.findById(id);
    if (!itemToMove) {
      return res.status(404).json({ error: "Menu item not found" });
    }

    // Find the item to swap positions with
    const itemToSwap = await MenuItem.findOne({ category: itemToMove.category ,order: newIndex });
    if (!itemToSwap) {
      return res.status(404).json({ error: "Menu item to swap not found" });
    }

    

    // Swap the order of the two items
    const tempOrder = itemToMove.order;
    itemToMove.order = itemToSwap.order;
    itemToSwap.order = tempOrder;

    // Save the changes to the database
    await itemToMove.save();
    await itemToSwap.save();

    res.status(200).json({ message: "Menu items reordered successfully" });
  } catch (err) {
    console.error("Error reordering menu items:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};
// Set up multer middleware to handle file uploads
exports.upload = multer({ storage: storage }).single('image');
