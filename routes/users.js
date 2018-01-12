const express = require('express');
const usersController = require('../controllers/usersController');
const router = express.Router();


router.post('/register/', usersController.registerUser);
router.get('/validate', usersController.validateUser);
router.get('/', usersController.getAllUsers);
router.get('/:id', usersController.getUserById);
router.post('/', usersController.createUser);
router.put('/',usersController.updateUser);
router.delete('/:id', usersController.deleteUserById);

module.exports = router;