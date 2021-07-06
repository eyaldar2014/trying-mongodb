const jwt = require('jsonwebtoken')
const User = require('../models/model.user')

// USING ENVIROMENT VERIBAL for tokenSignature(type of string) : JWT_SECRET=stringSignature
const authenticateToken = async (req, res, next) => {
  console.log('middleware authenticate Token')

  try {
    // removing "Bearer " from 'Authorization' value (string)
    const token = req.header('Authorization').replace("Bearer ", "")
    const decoded = jwt.verify(token, process.env.JWT_SECRET)

    const user = await User.findOne({ 
      _id : decoded["_id"],
      'tokens.token' : token 
    })
    
    if (!user) throw new Error()

    // saving current user & token to the request
    req.user = user
    req.token = token
    next()

  } catch (error) {
    return res.sendStatus(401)
  }
}


module.exports = authenticateToken