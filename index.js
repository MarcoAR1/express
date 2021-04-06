require("dotenv").config();
require("./mongo");
const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const Contact = require("./models/Contact.js");
const app = express();

// Settings

app.set("port", process.env.PORT);

//Middleware
app.use(express.static("build"));
app.use(express.json());
app.use(
  morgan(":method :url :status :res[content-length] - :response-time ms :json")
);
app.use(cors());
morgan.token("json", (req, _) => {
  return JSON.stringify(req.body);
});

//Routes

app.get("/api/persons", (_, res, next) => {
  Contact.find({})
    .then((contact) => res.status(200).json(contact))
    .catch((err) => next(err));
});

app.get("/api/persons/:id", (req, res, next) => {
  const { id } = req.params;
  Contact.findById(id)
    .then((contact) => {
      contact ? res.status(200).json(contact) : res.status(404).end();
    })
    .catch((err) => next(err));
});

app.get("/info", (_, res, next) => {
  Contact.find({})
    .then((contact) =>
      res.send(
        `<p>Phonebook has info for ${contact.length} people</p>
    <p>${new Date()}</p>
    `
      )
    )
    .catch((err) => next(err));
});

app.delete("/api/persons/:id", (req, res, next) => {
  const { id } = req.params;
  Contact.findByIdAndDelete(id)
    .then(() => res.status(204).end())
    .catch((err) => next(err));
});

app.post("/api/persons", (req, res, next) => {
  const { name, number } = req.body;

  if (name && number) {
    if (/^[a-zA-Z0-9\s_\-]+$/.test(name) && /[0-9+\s_\-]+/.test(number)) {
      const newContact = new Contact({
        name: name,
        number: number,
      });
      newContact
        .save()
        .then((contact) => {
          res.status(201).json(contact);
        })
        .catch((err) => next(err));
    } else {
      /^[a-zA-Z0-9\s_\-]+$/.test(name)
        ? res.status(400).json({ error: "invalid number field" })
        : res.status(400).json({ error: "invalid name field" });
    }
  } else {
    name
      ? res.status(400).json({ error: "missing number field" })
      : res.status(400).json({ error: "missing name field" });
  }
});

app.put("/api/persons/:id", (req, res, next) => {
  const { id } = req.params;
  console.log(req.body);
  Contact.findByIdAndUpdate(
    id,
    {
      name: req.body.name,
      number: req.body.number,
    },
    { new: true }
  )
    .then((contact) => {
      contact ? res.status(200).json(contact) : res.status(404).end();
    })
    .catch((err) => next(err));
});

// Middleware error

const errorHandler = (err, _, res, next) => {
  console.error(err.message);
  if (err.name === "CastError") {
    return res.status(404).send({ error: "malformatted id" });
  }
  next(error);
};

app.use(errorHandler);

// Server
app.listen(app.get("port"), () => {
  console.log(`Server on port ${app.get("port")}`);
});
