const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const dotenv = require("dotenv");

dotenv.config();

const PORT = process.env.PORT;
const app = express();

// view engine
app.set("view engine", "ejs");

// middlewere
app.use(bodyParser.urlencoded({ extended: false }));
app.use("/public", express.static("public"));

// recipe model
const Receipes = mongoose.model("recepie", {
  receipeName: String,
  receipeTime: String,
  ingredeints: [String],
  serves: String,
});

//render pages routes

// get all receipes
app.get("/", (req, res) => {
  // return all the receipe in the Database
  Receipes.find()
    .then((receipe) => {
      //   res.json(receipe);
      res.render("home", { receipe });
    })
    .catch((err) => {
      res.json(err);
    });
});
// get create receipe form
app.get("/createreceipe", (req, res) => {
  res.render("CreateReceipe");
});
// get  update receipe form
app.get("/update", (req, res) => {
  const { id } = req.query;
  Receipes.findById(id)
    .then((doc) => {
      res.render("update", { doc });
    })
    .catch((error) => res.send(error));
});

// Rest APIs
/* --------------------*/

// create a receipe
app.post("/receipe", (req, res) => {
  const { receipeName, receipeTime, ingredeints, serves } = req.body;
  const receipe = new Receipes({
    receipeName,
    receipeTime,
    ingredeints,
    serves,
  });
  receipe
    .save()
    .then(() => {
      res.redirect("/");
    })
    .catch((error) => {
      res.json({ error: "Somehting went wrong" });
    });
});

// update receipe
app.post("/receipe/update/:id", (req, res) => {
  const { receipeName, receipeTime, ingredeints, serves } = req.body;
  const { id } = req.params;
  Receipes.findByIdAndUpdate(id, {
    $set: {
      receipeTime,
      receipeName,
      ingredeints,
      serves,
    },
  })
    .then((result) => {
      res.redirect("/");
    })
    .catch((err) => {
      res.send(err);
    });
});

// delete one Receipe
app.get("/receipe/delete/:id", (req, res) => {
  const { id } = req.params;
  Receipes.findByIdAndDelete(id)
    .then(() => {
      res.redirect("/");
    })
    .catch((error) => {
      res.json({ error: "Somehting went wrong" });
    });
});

app.listen(PORT, () => {
  mongoose
    .connect(process.env.MONGO_DB_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then(() => {
      console.log("DB connected succesfully");
      console.log(`Server started on port ${PORT}`);
    })
    .catch(() => console.log("DB connection failed"));
});
