const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const db = require("./database");

const app = express();
const port = 8888;

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// Returns all existing surveys
app.get("/", (req, res) => {
  db.all("SELECT * FROM survey", (err, rows) => {
    if (err) {
      res.status(400);
    } else {
      res.json({ surveys: rows });
      res.status(200);
    }
  });

  return;
});

// Returns survey data for corresponding id param
app.get("/:id", (req, res) => {
  const id = req.params.id;

  db.get("SELECT * FROM survey WHERE id = ?", [id], (err, row) => {
    if (err) {
      res.status(400);
    } else {
      res.json({ surveys: [row] });
      res.status(200);
    }
  });

  return;
});

// Inserts new survey entry into database
app.post("/", (req, res) => {
  const data = req.body;

  db.run(
    "INSERT INTO survey (email, showName, rating) values(?, ?, ?)",
    [data.email, data.showName, data.rating],
    function (err) {
      if (err) {
        res.status(400);
      } else {
        res.status(201);
        res.json({id: this.lastID})
      }
    }
  );

  return;
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}!`);
});
