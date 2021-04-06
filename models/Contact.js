const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator')

const contactSchema = new mongoose.Schema({
  name: {
    type: String,
    require: true,
    unique: true,
    minlength: 3,
  },
  number: {
    type: String,
    minlength: 8,
  },
})
const Contact = mongoose.model('Persons', contactSchema)
contactSchema.set('toJSON', {
  transform: (_, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  },
})
contactSchema.plugin(uniqueValidator)

module.exports = Contact
