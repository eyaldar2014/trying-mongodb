const User = require('../models/model.user')


const UsersController = function () {

  this.createUser = async (req, res) => {
    console.log('post request on "/users" route')

    try {
      const newUser = new User(req.body)

      const user = await newUser.save()
      const token = await user.generateAuthToken()

      return res.status(201).send({ user: user, token })
    }
    catch (err) {
      return res.status(400).send({ "Error!": err.message })
    }
  }

  this.loginUser = async (req, res) => {
    console.log('login request on "/users/login" route')

    try{
      const user = await User.findByCredentials(req.body.email, req.body.password)
      const token = await user.generateAuthToken()

      return res.send( {user, token})
    } catch (err){
      return res.status(400).send({ "Error!": err.message })
    }
  }

  this.logoutAll  = async (req, res) => {
    console.log('logoutAll request on "/users/logoutAll" route')

    try{
      req.user.tokens = []
      await req.user.save()
      res.send('logoutAll successfully')
    } catch (error) {
      res.sendStatus(500)
    }
  }

  this.logoutUser = async (req, res) => {
    console.log('logout request on "/users/logout" route')

    try{
      req.user.tokens = req.user.tokens.filter((token) => token.token !== req.token)

      await req.user.save()
      res.send('logout successfully')
    } catch (error) {
      res.sendStatus(500)
    }
  }

  this.getProfile = async (req, res) => {

    await req.user.populate('tasks').execPopulate()
    // console.log(req.user) // 'toJSON' middleware cleans up the virtuals before completing 'send'. 
    return res.send(req.user)
    // return res.send({ ...req.user.toObject(), tasks : req.user.tasks }) // un-neccessary - replaced with schemaOptions
  }

  this.updateUser = async (req, res) => {
    console.log('update request on "/users/:id" route for single user')

    // validate update fields
    const updates = Object.keys(req.body)
    const allowedUpdates = ['completed', 'age', 'password', 'name', 'email']
    const isValideOperation = updates.reduce((sum, val) => {
      return sum && allowedUpdates.includes(val)
    }, true)
    
    if (!isValideOperation) return res.sendStatus(400)

    try {
      // const _id = req.params.id
      // const user = await User.findById(_id)
      // if (!user) return res.sendStatus(404)

      // validation will happen before "await user.save()". default operation. not like "User.findByIdAndUpdate()", that requires opts
      updates.forEach(update => req.user[update] = req.body[update])
      await req.user.save()

      return res.send( req.user )


      // next lines have CHANGED by using hash password MIDDLEWARE operation :
      // adding 'opts' to: 
      // 1. get the user after the modification
      // 2. run Schema validators
      // const opts = { runValidators: true, new: true };
      // const user = await User.findByIdAndUpdate(_id, req.body, opts)
    }
    catch (err) {
      return res.status(500).send({ "Error!": err.message })
    }
  }

  this.deleteUser = async (req, res) => {
    console.log('delete request on "/users/me" route for single user')

    try {
      // const user = await User.findByIdAndDelete(req.user._id)
      // if (!user) return res.sendStatus(404)

      await req.user.remove()
      return res.send({ "deleted": req.user })
    }
    catch (err) {
      return res.status(500).send({ "Error!": err.message })
    }
  }

}


module.exports = UsersController


  // NOT USED :
  //
  // 'GET ALL USERS' should never be available for any user (admin can get this info from mongodb) :