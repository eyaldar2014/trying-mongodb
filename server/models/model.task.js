const mongoose = require('mongoose')


const taskSchemaOptions = {
    // add CreatedAt and UpdatedAT
    timestamps : true
}

const taskSchema = new mongoose.Schema({
    description: {
        type: String,
        required: true,
        trim: true
    },
    completed: {
        // while using the 'default', put attention that the 'false' expression:
        // represents the value of the field (and not 'falsing' the default validator).
        // Also notice that default creates automatically and doesnt need to be required.
        type: Boolean,
        default: false
    },
    owner: {
        // specified way to get to "ObjectId" as a type
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        // REFERENCE to the User MODEL
        ref: 'User'
    }
}, taskSchemaOptions)


const Task = mongoose.model('Task', taskSchema)

module.exports = Task