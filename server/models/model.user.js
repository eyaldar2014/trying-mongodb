// remember to export the model to use in main/index down below
const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const Task = require('../models/model.task') // for removing the tasks on 'pre' MIDDLEWARE


const userSchemaOptions = {
  // for the virtual field to be displayed on client side
  'toObject': {
    virtuals: true,
    getters: true
  },
  // for the virtual field to be displayed on client side
  'toJSON': {
    virtuals: true,
    getters: true
  },
  // add CreatedAt and UpdatedAT
    timestamps : true
}

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    // 'trim' built in validator trims empty spaces included before or after entered string.
    trim: true
  },
  email: {
    type: String,
    // unique create indexes, with no similar fields. 
    // Note - must reset db to work (erase db) and refresh
    unique: true,
    required: true,
    trim: true,
    validate(val) {
      if (!validator.isEmail(val)) {
        throw new Error('Email is invalid')
      }
    }
  },
  age: {
    type: Number,
    min: 18
    // here is custom maid min validation :
    // validate (val) {
    //   if (val < 18) {
    //     throw new Error ('Age must be 18 at least. you entered ' + val)
    //   }
    // }
  },
  password: {
    type: String,
    required: true,
    trim: true,
    // build in String minimum length validator:
    minlength: 6,
    validate(val) {
      // printing for making sure trim works before validator: (true indeed)
      // console.log(val)

      // here adding "toLowerCase" function(or a method?) to make sure that no one is a smart ass
      if (val.toLowerCase().includes('password') === true) {
        throw new Error('password must not contain "password" expression')
      }
    }
  },
  tokens: [{
    token: {
      type: String,
      required: true
    }
  }]
}, userSchemaOptions)


// MiddleWare Section : notice that "statics" are available on the Model, when "methods" are available on instances
//
// Virtuals are document properties that you can get and set but do not get stored to MongoDB : here it is used to add tasks from the Task MODEL
userSchema.virtual('tasks', {
  ref: 'Task',
  localField: '_id',
  foreignField: 'owner'
})
//    filter user's data to send only safe data to the user
//    this method invokes automatically every time BEFORE 'send' :
//       - before send 'JSON.stringify()' is being called
//       - 'JSON.stringify()' calls toJSON
userSchema.methods.toJSON = function () {
  console.log('middleware public data filter')

  // Documents have a toObject method which converts the 'mongoose document' into a plain 'JavaScript object'
  const { tasks, name, email, age, completed } = this.toObject()
  return { tasks, name, email, age, completed }
}
//    get token (after login or creating user) :
// USING ENVIROMENT VERIBAL for tokenSignature(type of string) : JWT_SECRET=stringSignature
userSchema.methods.generateAuthToken = async function () {
  console.log('middleware generate authentication token')

  const user = this
  // therefore not an arrow function (otherwise this equals undefined)

  // "jwt.sign()" gets obj as 1st parameter, and a String is expected
  const token = jwt.sign({ _id: user["_id"].toString() }, process.env.JWT_SECRET)
  // concat merges 2 arrays or more
  user.tokens = user.tokens.concat({ token })
  await user.save()

  return token
}
//    for login purpuses verify email & password : 
userSchema.statics.findByCredentials = async (email, password) => {
  console.log('middleware verify email & password ')

  if (!email || !password) throw new Error('missing fields')

  const user = await User.findOne({ email })

  if (!user) throw new Error('invalid login')

  const verifyPassword = await bcrypt.compare(password, user.password)
  
  if (!verifyPassword) throw new Error('invalid login')

  return user
}
//    hash the plain password before storing (in case db info gets stolen) :
userSchema.pre('save', async function (next) {
  console.log('middleware hash password check')

  let user = this
  // therefore not an arrow function (otherwise this equals undefined)

  if (user.isModified('password')) {
    // hashing password with bcrypt :
    user.password = await bcrypt.hash(user.password, 8)
  }

  next()
})
// delete all tasks created by the user, when deleting the user
// delete users tasks when user is removed
userSchema.pre('remove', async function (next) {
  console.log('middleware delete users tasks when user is removed')

  let user = this
  // therefore not an arrow function (otherwise this equals undefined)

  await Task.deleteMany({ "owner": user._id })
  next()
})


const User = mongoose.model('User', userSchema)

module.exports = User
