const express = require('express');
const usersController = require('../controllers/usersController');
const router = express.Router();

router.get('/', usersController.getAllUsers);
router.get('/:email', usersController.getUser);
router.post('/', usersController.createUser);
router.put('/',usersController.updateUser);

module.exports = router;