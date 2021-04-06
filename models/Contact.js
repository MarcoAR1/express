const mongoose = require("mongoose");

const contactSchema = new mongoose.Schema({
  name: String,
  number: String,
});
const Contact = mongoose.model("Persons", contactSchema);
contactSchema.set("toJSON", {
  transform: (_, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});

module.exports = Contact;
