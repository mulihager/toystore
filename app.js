require("dotenv").config();
const path = require("path");
const express = require("express");
const cors = require("cors");

const app = express();
const userRoute = require("./routes/users");
const toyRoute = require("./routes/toys");

require("./db/mongoConnect");
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

app.use("/users", userRoute);
app.use("/toys", toyRoute);
app.get("/", (req, res) => {
  res.json("MULI TOYS STORE");
});

const port = process.env.PORT || 3001;
app.listen(port);
