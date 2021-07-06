const express = require('express')
const UsersController = require('../controllers/controller.user')
const authenticateToken = require('../middlewares/middleware.authentication')


const usersController = new UsersController()
const router = new express.Router()


router.post('/', usersController.createUser)

router.post('/login', usersController.loginUser)

// authentication middleware : required
router.post('/logout', authenticateToken, usersController.logoutUser)

// authentication middleware : required
router.post('/logoutAll', authenticateToken, usersController.logoutAll)

// authentication middleware : required
router.get('/me', authenticateToken, usersController.getProfile)

// authentication middleware : required
router.patch('/me', authenticateToken, usersController.updateUser)

// authentication middleware : required
router.delete('/me', authenticateToken, usersController.deleteUser)


module.exports = router


// Not Used :
//
// router.get('/', usersController.getAllUsers) // should never be available to the user
// router.get('/:id', authenticateToken, usersController.getSingleUser) // replaced with '/me'