const mongoose = require('mongoose')


// including data-base name in the url adress (different than mongodb without mongoose)
// proccess.env.MONGODB_URL was 'mongodb://127.0.0.1:27017/mongoose-api'
mongoose.connect(process.env.MONGODB_URL , {
  useNewUrlParser: true,
  useCreateIndex : true,
  useUnifiedTopology: true,
  useFindAndModify: false
})
