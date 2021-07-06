const Task = require('../models/model.task')


const TasksController = function () {

  this.createTask = async (req, res) => {
    const task = new Task({
      ...req.body,
      owner: req.user._id
    })

    try {
      await task.save()
      res.status(201).send(task)
    } catch (e) {
      res.status(400).send(e)
    }
  }

  // GET /tasks?completed=true
  // GET /tasks?limit=10&skip=0 // '&' between queries
  // GET /tsaks?sortBy=createdAt_ascending11111 (or descending) // '_' will be used to split the query string
  this.getAllTasks = async (req, res) => {
    // 2 similar options : (populate uses the virtual 'tasks' at the User model)
    
    const match = {}
    
    // req.query references to the url ending with '?'+ some value
    if (req.query.completed) {
      // first resolves the right equation
      match.completed = req.query.completed === 'true'
    }

    const sort = {}
    if (req.query.sortBy) {
      const sortByArray = req.query.sortBy.split("_")
      sort[sortByArray[0]] = parseInt(sortByArray[1])
    }

    try {
      // 2nd option : const tasks = await Task.find({owner : req.user_id}).limit(n) // more changes needed to work now
      
      // by passing an object its enabling filtering options
      await req.user.populate({
      path: 'tasks',
      match,
      // limit sets how many results to get every time
      // skip sets the first item location on the request
        options: {
          limit: parseInt(req.query.limit),
          skip: parseInt(req.query.skip),
          sort // positive is ascending, and the opposite..
        }
      }).execPopulate()

      res.send(req.user.tasks)
    } catch (e) {
      res.status(500).send()
    }
  }

  this.getSingleTask = async (req, res) => {

    try {
      const _id = req.params.id
      const task = await Task.findOne({ _id, "owner": req.user._id })

      if (!task) return res.status(404).send()

      res.send(task)
    } catch (e) {
      res.status(500).send()
    }
  }

  this.updateTask = async (req, res) => {
    const updates = Object.keys(req.body)
    const allowedUpdates = ['description', 'completed']
    // every is built in function that tests whether all elements in the array pass the test implemented by the provided function. It returns a Boolean value.
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update)) // true or false

    if (!isValidOperation) return res.status(400).send({ error: 'Invalid updates!' })

    try {
      const _id = req.params.id
      const task = await Task.findOne({ _id, "owner": req.user._id })

      if (!task) return res.status(404).send()

      updates.forEach((update) => task[update] = req.body[update])
      await task.save()
      res.send(task)
    } catch (e) {
      res.status(400).send(e)
    }
  }

  this.deleteTask = async (req, res) => {
    try {
      const _id = req.params.id
      // const task = await Task.findOneAndDelete({ _id , "owner" : req.user._id })
      const task = await Task.findOne({ _id, "owner": req.user._id })

      if (!task) return res.status(404).send()

      task.remove()
      res.send(task)
    } catch (e) {
      res.status(500).send()
    }
  }

}


module.exports = TasksController