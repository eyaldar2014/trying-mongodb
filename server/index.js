require('./db/mongoose')
const express = require('express')
const usersRouter = require('./routes/route.user')
const tasksRouter = require('./routes/route.task')
// const maintenanceMiddleware = require('./server/middlewares/middleware.maintenance')


const app = express()
// const port = process.env.PORT || 5000
// MODIFIED to 'enviroment veribal' :
const port = process.env.PORT


// makes the request property into json :
app.use(express.json())

// MIDDLEWARES : authentication middleware is used in route.user.js

// "CORS", my words : browser middleware ability of intercepting HTTP requests, that are basically made from another origins (domain, scheme, or port) than its own
const cors = require('cors')
app.use(cors())

// maintenance middleware : required
// app.use(maintenanceMiddleware)


// reactRouter for users & tasks : required
app.use('/users', usersRouter)
app.use('/tasks', tasksRouter)


// used to bind the connections on the specified port and activate it :
app.listen(process.env.PORT || 5000, () => {
  console.log('listnening on port', port)
})