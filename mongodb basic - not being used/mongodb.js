// const mongoDB = require("mongodb")
// const MongoClient = mongoDB.MongoClient
// const ObjectID = mongoDB.ObjectID
// the upper content in other and better way:
//
const { MongoClient, ObjectID } = require("mongodb")

const id = new ObjectID()
console.log('id: ' + id)
console.log('created at: ' + id.getTimestamp())

const connectionURL = 'mongodb://127.0.0.1:27017'
const dbName = 'experiment'


MongoClient.connect(connectionURL, { useNewUrlParser: true }, (error, client) => {
  if (error) console.log('error: ' + error)

  const db = client.db(dbName)


  // create one :
  // db.collection('experiment').insertOne({ "example" : {id: 1 , name: 'Eyal'}})

  // update one :
  // db.collection('experiment').updateOne({ _id: ObjectID("60d1a2eb40cd200da9b599a1").valueOf() }
  // , {$set : { "example.name" : 'Eyal updated' } })
  // .then((result)=>{
  //   console.log(result.modifiedCount)
  // }).catch((error)=>{
  //   console.log(error)
  // })

  // delete many :
  // db.collection('experiment').deleteMany( { "example.id" : 1 } )
  // .then((result)=>{
  //   console.log("deleted " + result.deletedCount)
  // }).catch((error)=>{
  //   console.log(error)
  // })

  // find and print all :
  // db.collection('experiment').find( { } ).forEach(x => console.log(x)) 

  console.log('connected')
})