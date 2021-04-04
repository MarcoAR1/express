const express = require("express");
const morgan = require("morgan");
const cors = require("cors");

const app = express();
let number_id = Math.ceil(Math.random() * 30);
let db = [
  {
    name: "Arto Hellas",
    number: "040-123456",
    id: 1,
  },
  {
    name: "Ada Lovelace",
    number: "39-44-5323523",
    id: 2,
  },
  {
    name: "Dan Abramov",
    number: "12-43-234345",
    id: 3,
  },
  {
    name: "Mary Poppendieck",
    number: "39-23-6423122",
    id: 4,
  },
];

// Settings

app.set("port", process.env.PORT || 3001);

//Middleware

app.use(express.json());
app.use(
  morgan(":method :url :status :res[content-length] - :response-time ms :json")
);
app.use(cors());
morgan.token("json", (req, res) => {
  return JSON.stringify(req.body);
});
//Routes

app.get("/api/persons", (req, res) => {
  res.status(200).json(db);
});
app.get("/api/persons/:id", (req, res) => {
  const { id } = req.params;
  const find = db.find((contact) => {
    return contact.id === Number(id);
  });
  find
    ? res.status(200).json(find)
    : res.status(404).send(`<h1>Error 404 contact not found</h1>`);
});

app.get("/info", (req, res) => {
  res.send(
    `<p>Phonebook has info for ${db.length} people</p>
    <p>${new Date()}</p>
    `
  );
});

app.delete("/api/persons/:id", (req, res) => {
  const { id } = req.params;
  const find = db.findIndex((contact) => {
    return contact.id === Number(id);
  });
  find + 1
    ? res.status(204).json(db.splice(find, 1))
    : res.status(404).json({ error: "The contact dont exist 404" });
});

app.post("/api/persons", (req, res) => {
  const { name, number } = req.body;

  if (name && number) {
    if (/^[a-zA-Z0-9\s_\-]+$/.test(name) && /[0-9+\s_\-]+/.test(number)) {
      number_id += 1;
      db = [...db, { name, number, id: number_id }];
      res.status(201).json(db.find((contact) => contact.id === number_id));
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
// Server
app.listen(app.get("port"), () => {
  console.log(`Server on port ${app.get("port")}`);
});
