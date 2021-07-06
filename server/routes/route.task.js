const express = require('express')
const TasksController = require('../controllers/controller.task')
const authenticateToken = require('../middlewares/middleware.authentication')


const tasksController = new TasksController()
const router = new express.Router()


// authentication middleware : required
router.post('/', authenticateToken, tasksController.createTask)

// authentication middleware : required
router.get('/', authenticateToken, tasksController.getAllTasks)

// authentication middleware : required
router.get('/:id', authenticateToken, tasksController.getSingleTask)

// authentication middleware : required
router.patch('/:id', authenticateToken, tasksController.updateTask)

// authentication middleware : required
router.delete('/:id', authenticateToken, tasksController.deleteTask)


module.exports = router